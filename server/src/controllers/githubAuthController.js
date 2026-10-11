import axios from "axios";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { syncAndGetEffectiveStreak } from "../utils/streak.js";



const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || "brainbyte_jwt_default_secret_key";
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * GET /api/auth/github
 * Redirects the browser to GitHub's OAuth authorization page.
 * Stores a random `state` value in a short-lived httpOnly cookie to prevent CSRF.
 */
export const githubLogin = (req, res) => {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

  const state = crypto.randomBytes(16).toString("hex");

  // Store state in a short-lived httpOnly cookie (10 minutes)
  res.cookie("github_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 10 * 60 * 1000, // 10 minutes
    secure: process.env.NODE_ENV === "production",
  });

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_CALLBACK_URL,
    scope: "read:user user:email",
    state,
  });

  return res.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
};

/**
 * GET /api/auth/github/callback
 * GitHub redirects here with ?code=...&state=...
 * 1. Verify state against cookie (CSRF check).
 * 2. Exchange code for access token.
 * 3. Fetch GitHub profile + primary verified email.
 * 4. Find or create BrainByte user (links to existing account by email).
 * 5. Issue BrainByte JWT and redirect frontend to /auth/github/success?token=...
 */
export const githubCallback = async (req, res) => {
  const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
  const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;


  try {
    const { code, state } = req.query;

    // ── 1. CSRF state check ──────────────────────────────────────────────────
    const storedState = req.cookies?.github_oauth_state;
    console.log("[GitHub OAuth Diagnostic] Step 1 - State check:", {
      queryStateReceived: Boolean(state),
      cookiePresent: Boolean(storedState),
      stateMatch: Boolean(state && storedState && state === storedState),
      cookiesReceived: Object.keys(req.cookies || {}),
    });

    res.clearCookie("github_oauth_state", { httpOnly: true, sameSite: "lax" });

    if (!state || !storedState || state !== storedState) {
      console.error("[GitHub OAuth] State mismatch — possible CSRF attempt.");
      return res.redirect(errorRedirect);
    }

    if (!code) {
      console.error("[GitHub OAuth] No code received from GitHub.");
      return res.redirect(errorRedirect);
    }
    console.log("[GitHub OAuth Diagnostic] Step 1 - Code received: true");

    // ── 2. Exchange code for access token ────────────────────────────────────
    let accessToken;
    try {
      const tokenRes = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: GITHUB_CALLBACK_URL,
        },
        {
          headers: { Accept: "application/json" },
          timeout: 10000,
        }
      );

      console.log("[GitHub OAuth Diagnostic] Step 2 - Token exchange response status:", tokenRes.status, {
        hasAccessToken: Boolean(tokenRes.data?.access_token),
        tokenType: tokenRes.data?.token_type || null,
        error: tokenRes.data?.error || null,
        error_description: tokenRes.data?.error_description || null,
      });

      accessToken = tokenRes.data.access_token;
      if (!accessToken) {
        console.error("[GitHub OAuth] Token exchange failed:", tokenRes.data);
        return res.redirect(errorRedirect);
      }
    } catch (err) {
      console.error("[GitHub OAuth] Token exchange error:", err.message, err.response?.data || "");
      return res.redirect(errorRedirect);
    }

    const ghHeaders = {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    };

    // ── 3. Fetch GitHub profile ───────────────────────────────────────────────
    let profile;
    try {
      const profileRes = await axios.get("https://api.github.com/user", {
        headers: ghHeaders,
        timeout: 10000,
      });
      console.log("[GitHub OAuth Diagnostic] Step 3 - Profile fetch status:", profileRes.status, {
        hasProfileId: Boolean(profileRes.data?.id),
        hasProfileEmail: Boolean(profileRes.data?.email),
      });
      profile = profileRes.data;
    } catch (err) {
      console.error("[GitHub OAuth] Profile fetch error:", err.message, err.response?.data || "");
      return res.redirect(errorRedirect);
    }

    const githubId = String(profile.id);
    const name = profile.name || profile.login || "";
    const picture = profile.avatar_url || "";

    // ── 4. Fetch primary verified email (profile.email can be null) ───────────
    let email = profile.email;
    if (!email) {
      try {
        const emailsRes = await axios.get(
          "https://api.github.com/user/emails",
          { headers: ghHeaders, timeout: 10000 }
        );
        console.log("[GitHub OAuth Diagnostic] Step 4 - Emails fetch status:", emailsRes.status, {
          emailsCount: Array.isArray(emailsRes.data) ? emailsRes.data.length : 0,
        });
        const primary = emailsRes.data.find((e) => e.primary && e.verified);
        email = primary?.email || null;
      } catch (err) {
        console.error("[GitHub OAuth] Email fetch error:", err.message, err.response?.data || "");
      }
    }

    console.log("[GitHub OAuth Diagnostic] Step 4 - Email resolved:", Boolean(email));

    if (!email) {
      console.error("[GitHub OAuth] Could not obtain a verified email for user:", githubId);
      return res.redirect(`${CLIENT_URL}/login?error=github_no_email`);
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ── 5. Find or create BrainByte user ─────────────────────────────────────
    let user = await User.findOne({ githubId });
    console.log("[GitHub OAuth Diagnostic] Step 5 - Existing user with githubId found:", Boolean(user));

    if (!user) {
      // Try linking to an existing account with the same email (Google or email/password)
      user = await User.findOne({ email: normalizedEmail });
      console.log("[GitHub OAuth Diagnostic] Step 5 - Existing user with email found to link:", Boolean(user));

      if (user) {
        // Link GitHub to the existing account
        user.githubId = githubId;
        if (!user.avatarUrl && picture) {
          user.avatarUrl = picture;
        }
        await user.save();
        console.log("[GitHub OAuth Diagnostic] Step 5 - Account linked successfully");
      } else {
        // Brand-new user — create account from GitHub profile
        const baseUsername = name
          ? name.replace(/\s+/g, "").toLowerCase().slice(0, 20)
          : normalizedEmail.split("@")[0].slice(0, 20);

        // Ensure username uniqueness
        let username = baseUsername;
        let attempt = 0;
        while (await User.findOne({ username })) {
          attempt++;
          username = `${baseUsername}${attempt}`;
        }

        user = await User.create({
          username,
          email: normalizedEmail,
          githubId,
          avatarUrl: picture,
          // No password — OAuth-only account
        });
        console.log("[GitHub OAuth Diagnostic] Step 5 - New user created successfully:", {
          hasUserId: Boolean(user._id),
          usernameLength: username.length,
        });
      }
    }

    // ── 6. Issue BrainByte JWT and redirect to frontend ───────────────────────
    await syncAndGetEffectiveStreak(user);

    const token = generateToken(user._id);

    // Pass the token via redirect query param — frontend reads it and stores in localStorage
    const successParams = new URLSearchParams({
      token,
      _id: String(user._id),
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl || "",
      xp: String(user.xp || 0),
      streak: String(user.streak || 0),
    });

    const maskedRedirect = `${CLIENT_URL}/auth/github/success?token=***MASKED***&_id=${String(user._id)}&username=${user.username}`;
    console.log("[GitHub OAuth Diagnostic] Step 6 - Final redirect URL:", maskedRedirect);

    return res.redirect(
      `${CLIENT_URL}/auth/github/success?${successParams.toString()}`
    );
  } catch (error) {
    console.error("[GitHub OAuth Diagnostic] Caught error in callback:", error.message, error.stack);
    return res.redirect(errorRedirect);
  }
};
