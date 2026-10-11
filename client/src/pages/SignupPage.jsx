import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import BrainByteLogo from "../components/common/BrainByteLogo.jsx";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await register(username.trim(), email.trim(), password);
      navigate("/problems", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full px-6 lg:px-12 py-6 flex items-center justify-between">
        <div className="opacity-0 pointer-events-none md:opacity-100">
          <BrainByteLogo size="sm" showSubtitle={false} />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">Already registered?</span>
          <Link
            to="/login"
            className="text-[#ff3b3b] hover:text-red-400 font-semibold transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Dual-Column Content */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6">
        {/* Left Hero Column */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 select-none">
          <BrainByteLogo size="xl" showSubtitle={true} showTagline={false} />

          <div className="flex items-center gap-3 text-lg sm:text-xl font-mono tracking-widest font-semibold pt-1">
            <span className="text-white">Code</span>
            <span className="text-[#ff3b3b]">Create</span>
            <span className="text-[#06b6d4]">Conquer</span>
          </div>

          <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full my-2" />

          <div className="space-y-1 font-mono text-sm text-slate-400/90 pl-1">
            <p className="text-slate-400">// Join 50+ Algorithmic Challenges</p>
            <p className="text-slate-400">// Built Different. For Serious Coders."</p>
          </div>

          <div className="pt-4 relative max-w-md rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] hidden sm:block group">
            <img
              src="/assets/hero-reference.jpg"
              alt="BrainByte Workspace"
              className="w-full h-56 object-cover object-left-bottom opacity-70 group-hover:opacity-85 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Free Account &bull; Instant Problem Access</span>
            </div>
          </div>
        </div>

        {/* Right Glassmorphism Card Column */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-3xl p-8 sm:p-10 backdrop-blur-2xl bg-[#0f1117]/80 border border-white/[0.1] shadow-[0_15px_50px_rgba(0,0,0,0.7)] relative">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>Join</span>
                <span className="text-[#ff3b3b] drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]">
                  BrainByte
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-2 font-normal">
                Create your developer account to begin solving
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Username
                </label>
                <div className="relative rounded-xl bg-[#141721] border border-white/[0.08] focus-within:border-red-500/60 focus-within:ring-1 focus-within:ring-red-500/40 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

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
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <div className="relative rounded-xl bg-[#141721] border border-white/[0.08] focus-within:border-red-500/60 focus-within:ring-1 focus-within:ring-red-500/40 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min 6 chars)"
                    className="w-full pl-10 pr-10 py-2.5 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Confirm Password
                </label>
                <div className="relative rounded-xl bg-[#141721] border border-white/[0.08] focus-within:border-red-500/60 focus-within:ring-1 focus-within:ring-red-500/40 transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-[#1c1d22] via-[#451b22] to-[#e13b3b] hover:from-[#252830] hover:via-[#5c1e28] hover:to-[#f04343] transition-all duration-300 flex items-center justify-center gap-2 border border-red-500/30 shadow-[0_0_20px_rgba(225,59,59,0.25)] group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              <span>Already have an account? </span>
              <Link
                to="/login"
                className="text-[#ff3b3b] hover:text-red-400 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

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

