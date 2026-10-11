import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * GitHubSuccessPage
 *
 * The backend redirects here after a successful GitHub OAuth flow:
 *   /auth/github/success?token=...&_id=...&username=...&email=...&avatarUrl=...&xp=...&streak=...
 *
 * This page reads those query params, hydrates the auth context / localStorage
 * (same pattern as loginWithGoogle in AuthContext), then navigates to /problems.
 * On any failure it falls back to /login?error=github_failed.
 */
export default function GitHubSuccessPage() {
  const [searchParams] = useSearchParams();
  const { loginWithGitHub } = useAuth();
  const navigate = useNavigate();
  const handled = useRef(false); // guard against React StrictMode double-invoke

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get("token");
    if (!token) {
      navigate("/login?error=github_failed", { replace: true });
      return;
    }

    const userData = {
      _id: searchParams.get("_id"),
      username: searchParams.get("username"),
      email: searchParams.get("email"),
      avatarUrl: searchParams.get("avatarUrl") || "",
      xp: Number(searchParams.get("xp") || 0),
      streak: Number(searchParams.get("streak") || 0),
    };

    loginWithGitHub(token, userData);
    navigate("/problems", { replace: true });
  }, []);

  return (
    <div className="min-h-screen bg-[#08090c] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        <p className="text-slate-400 text-sm font-mono">Signing you in with GitHub…</p>
      </div>
    </div>
  );
}
