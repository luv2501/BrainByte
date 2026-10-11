import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext.jsx";
import BrainByteLogo from "../components/common/BrainByteLogo.jsx";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/problems";

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Show an error if redirected back from a failed OAuth attempt
  useEffect(() => {
    const errorParam = new URLSearchParams(location.search).get("error");
    if (errorParam === "github_failed") {
      setError("GitHub sign-in failed. Please try again or use email/password.");
    } else if (errorParam === "github_no_email") {
      setError(
        "Your GitHub account has no verified public email. Please add one on GitHub and retry."
      );
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // useGoogleLogin triggers the Google popup and returns an access_token (implicit flow).
  // We send it to our backend which verifies it with Google's tokeninfo API.
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      setGoogleLoading(true);
      try {
        // tokenResponse.access_token is the Google OAuth access token
        await loginWithGoogle(tokenResponse.access_token);
        navigate(from, { replace: true });
      } catch (err) {
        setError(err.message || "Google sign-in failed. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError("Google sign-in was cancelled or failed. Please try again.");
      setGoogleLoading(false);
    },
    scope: "openid email profile",
  });

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Cinematic subtle background glowing ambient spheres */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full px-6 lg:px-12 py-6 flex items-center justify-between">
        <div className="opacity-0 pointer-events-none md:opacity-100">
          <BrainByteLogo size="sm" showSubtitle={false} />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">New here?</span>
          <Link
            to="/signup"
            className="text-[#ff3b3b] hover:text-red-400 font-semibold transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Dual-Column Content */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6">
        {/* Left Hero Column */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 select-none">
          {/* Main Logo & Typography matching reference */}
          <BrainByteLogo size="xl" showSubtitle={true} showTagline={false} />

          {/* Tagline: Code. Create. Conquer. */}
          <div className="flex items-center gap-3 text-lg sm:text-xl font-mono tracking-widest font-semibold pt-1">
            <span className="text-white">Code</span>
            <span className="text-[#ff3b3b]">Create</span>
            <span className="text-[#06b6d4]">Conquer</span>
          </div>

          <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full my-2" />

          {/* Code Comments Quote */}
          <div className="space-y-1 font-mono text-sm text-slate-400/90 pl-1">
            <p className="text-slate-400">// Better Developers</p>
            <p className="text-slate-400">// A Brighter Tomorrow"</p>
          </div>

          {/* Embedded High-Res Cinematic Setup preview */}
          <div className="pt-4 relative max-w-md rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] hidden sm:block group">
            <img
              src="/assets/hero-reference.jpg"
              alt="BrainByte Workspace"
              className="w-full h-56 object-cover object-left-bottom opacity-70 group-hover:opacity-85 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>53+ Algorithmic Challenges Ready</span>
            </div>
          </div>
        </div>

        {/* Right Glassmorphism Card Column */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-3xl p-8 sm:p-10 backdrop-blur-2xl bg-[#0f1117]/80 border border-white/[0.1] shadow-[0_15px_50px_rgba(0,0,0,0.7)] relative">
            {/* Card Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>Welcome</span>
                <span className="text-[#ff3b3b] drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]">
                  Back
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-2 font-normal">
                Sign in to continue your coding journey
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Email Address
                </label>
                <div className="relative rounded-xl bg-[#141721] border border-white/[0.08] focus-within:border-red-500/60 focus-within:ring-1 focus-within:ring-red-500/40 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Please contact support or re-register if password is lost.")}
                    className="text-xs text-[#ff3b3b] hover:text-red-400 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative rounded-xl bg-[#141721] border border-white/[0.08] focus-within:border-red-500/60 focus-within:ring-1 focus-within:ring-red-500/40 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-[#1c1d22] via-[#451b22] to-[#e13b3b] hover:from-[#252830] hover:via-[#5c1e28] hover:to-[#f04343] transition-all duration-300 flex items-center justify-center gap-2 border border-red-500/30 shadow-[0_0_20px_rgba(225,59,59,0.25)] group disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Social Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]" />
              </div>
              <span className="relative px-3 bg-[#0f1117] text-xs text-slate-500 font-medium uppercase tracking-wider">
                or continue with
              </span>
            </div>

            {/* Social Icons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                disabled={loading || googleLoading}
                className="py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sign in with Google"
              >
                {googleLoading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z" />
                    <path fill="#34A853" d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.5z" />
                    <path fill="#FBBC05" d="M6.54 13.59A5.86 5.86 0 0 1 6.23 12c0-.55.11-1.08.31-1.59V7.88H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.37l3.25-2.53z" />
                    <path fill="#EA4335" d="M12 6.38c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.43 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.71 5.38l3.25 2.53C7.31 8.1 9.46 6.38 12 6.38z" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = `${API_URL}/api/auth/github`;
                }}
                disabled={loading || googleLoading}
                className="py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sign in with GitHub"
              >
                <FaGithub className="text-lg text-slate-300" />
              </button>
              <button
                type="button"
                onClick={() => setError("LinkedIn authentication is coming soon. Please use email/password.")}
                disabled={loading || googleLoading}
                className="py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="LinkedIn"
              >
                <FaLinkedin className="text-lg text-blue-400" />
              </button>
            </div>

            {/* Footer inside card */}
            <div className="mt-8 text-center text-xs text-slate-400">
              <span>Don't have an account? </span>
              <Link
                to="/signup"
                className="text-[#ff3b3b] hover:text-red-400 font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer matching reference design */}
      <footer className="relative z-20 w-full px-6 lg:px-12 py-6 border-t border-white/[0.06] text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          &copy; 2025 BrainByte. Built Different. Code Create Conquer.
        </div>
        <div className="flex items-center gap-6 text-slate-400">
          <span className="hover:text-slate-200 transition-colors cursor-pointer">About</span>
          <span className="hover:text-slate-200 transition-colors cursor-pointer">Contact</span>
          <span className="hover:text-slate-200 transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-slate-200 transition-colors cursor-pointer">Terms</span>
        </div>
      </footer>
    </div>
  );
}

