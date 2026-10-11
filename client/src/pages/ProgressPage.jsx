import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { submissionApi } from "../api/submissionApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import {
  TrendingUp,
  CheckCircle2,
  Zap,
  Flame,
  Award,
  BarChart3,
  Calendar,
  Code2,
  Sparkles,
} from "lucide-react";

export default function ProgressPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const TOTAL_EASY = 18;
  const TOTAL_MEDIUM = 26;
  const TOTAL_HARD = 9;
  const TOTAL_PROBLEMS = 53;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await submissionApi.getUserStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load user stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const easySolved = stats?.easySolved || 0;
  const mediumSolved = stats?.mediumSolved || 0;
  const hardSolved = stats?.hardSolved || 0;
  const problemsSolved = stats?.problemsSolved || 0;
  const totalSubmissions = stats?.totalSubmissions || 0;
  const acceptedSubmissions = stats?.acceptedSubmissions || 0;

  const acceptanceRate =
    totalSubmissions > 0
      ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
      : 0;

  const solvedPercentage = Math.round((problemsSolved / TOTAL_PROBLEMS) * 100);

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* User Hero Banner */}
        <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#12141c] via-[#0f1118] to-[#0a0b0e] border border-white/[0.08] shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-[#1e2230] border-2 border-white/[0.15] flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-white shadow-xl">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                    {user?.username}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[#ff4b4b] text-xs font-mono font-semibold">
                    PRO CODER
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-mono">
                  {user?.email} &bull; Member since {new Date(user?.createdAt || Date.now()).getFullYear()}
                </p>
              </div>
            </div>

            {/* Streak & XP Badges */}
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-[#141620] border border-white/[0.08] text-center min-w-[100px] shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-orange-400 font-bold text-xl">
                  <Flame className="w-5 h-5 fill-orange-500" />
                  <span>{user?.streak || stats?.streak || 0}</span>
                </div>
                <p className="text-[11px] font-mono text-slate-500 uppercase mt-0.5">
                  Day Streak
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141620] border border-white/[0.08] text-center min-w-[100px] shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-xl">
                  <Zap className="w-5 h-5 fill-amber-400" />
                  <span>{user?.xp || stats?.xp || 0}</span>
                </div>
                <p className="text-[11px] font-mono text-slate-500 uppercase mt-0.5">Total XP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Solved Problems Ring Card */}
          <div className="rounded-2xl p-6 bg-[#0f1117] border border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Solved Problems</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {problemsSolved}/{TOTAL_PROBLEMS}
              </span>
            </div>

            <div className="flex items-center justify-center py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG Progress Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-white/[0.06]"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * solvedPercentage) / 100}
                    strokeLinecap="round"
                    className="text-red-500 transition-all duration-1000 ease-out"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute text-center">
                  <p className="text-3xl font-extrabold text-white">{problemsSolved}</p>
                  <p className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                    Solved
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400">
              You have completed <strong className="text-white">{solvedPercentage}%</strong> of the
              entire BrainByte curriculum.
            </div>
          </div>

          {/* Difficulty Breakdown Card */}
          <div className="rounded-2xl p-6 bg-[#0f1117] border border-white/[0.08] space-y-6 md:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Difficulty Breakdown</span>
              </h2>
            </div>

            <div className="space-y-5 pt-1">
              {/* Easy Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-400">Easy</span>
                  <span className="font-mono text-slate-400">
                    <strong className="text-white">{easySolved}</strong> / {TOTAL_EASY}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                    style={{
                      width: `${(easySolved / TOTAL_EASY) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Medium Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-400">Medium</span>
                  <span className="font-mono text-slate-400">
                    <strong className="text-white">{mediumSolved}</strong> / {TOTAL_MEDIUM}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700"
                    style={{
                      width: `${(mediumSolved / TOTAL_MEDIUM) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Hard Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-red-400">Hard</span>
                  <span className="font-mono text-slate-400">
                    <strong className="text-white">{hardSolved}</strong> / {TOTAL_HARD}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-700"
                    style={{
                      width: `${(hardSolved / TOTAL_HARD) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Submission Performance summary */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.06] text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-slate-500 text-[11px]">Total Submissions</p>
                <p className="text-lg font-bold text-white mt-1">{totalSubmissions}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-slate-500 text-[11px]">Acceptance Rate</p>
                <p className="text-lg font-bold text-emerald-400 mt-1">{acceptanceRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Call to Action */}
        <div className="rounded-2xl p-6 bg-gradient-to-r from-[#181a24] to-[#12141c] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="w-4 h-4 text-[#ff3b3b]" />
              <span>Continue Your Coding Streak</span>
            </h3>
            <p className="text-xs text-slate-400">
              Solve at least one problem every day to maintain your streak and earn bonus XP.
            </p>
          </div>
          <Link
            to="/problems"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e13b3b] to-[#b91c1c] hover:from-[#f04b4b] hover:to-[#dc2626] text-white text-xs font-semibold shadow-[0_0_15px_rgba(225,59,59,0.3)] transition-all whitespace-nowrap"
          >
            Practice Next Problem &rarr;
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

