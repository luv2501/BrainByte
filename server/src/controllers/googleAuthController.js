import axios from "axios";
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
 * POST /api/auth/google
 * Body: { access_token: "<Google OAuth access token from the client>" }
 *
 * Verifies the access token by calling Google's userinfo endpoint (server-side),
 * then finds or creates the corresponding BrainByte user and responds with a
 * BrainByte JWT. Never trusts any profile data supplied by the client.
 */
export const googleAuth = async (req, res, next) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ message: "Google access token is required" });
    }

    // Verify the token with Google's own userinfo endpoint — only Google can issue it
    let googleUser;
    try {
      const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
        timeout: 10000,
      });
      googleUser = response.data;
    } catch (verifyError) {
      return res.status(401).json({ message: "Invalid or expired Google token" });
    }

    const { sub: googleId, email, name, picture } = googleUser;

    if (!email || !googleId) {
      return res.status(400).json({ message: "Google account does not provide a valid email" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try to find user by googleId (returning user via Google)
    let user = await User.findOne({ googleId });

    if (!user) {
      // 2. Check if an email/password account exists with this email → link it
      user = await User.findOne({ email: normalizedEmail });

      if (user) {
        // Link Google account to existing email/password account
        user.googleId = googleId;
        if (!user.avatarUrl && picture) {
          user.avatarUrl = picture;
        }
        await user.save();
      } else {
        // 3. Brand new user — create account from verified Google profile
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
          googleId,
          avatarUrl: picture || "",
          // No password — this is an OAuth-only account
        });
      }
    }

    await syncAndGetEffectiveStreak(user);

    // Return the same response shape as email/password login
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl || "",
      xp: user.xp || 0,
      streak: user.streak || 0,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};
