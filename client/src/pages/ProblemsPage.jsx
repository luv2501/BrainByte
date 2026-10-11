import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { problemApi } from "../api/problemApi.js";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import { DifficultyBadge, TagBadge } from "../components/common/Badge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Code2,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function ProblemsPage() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);

  const categories = [
    "All",
    "Array",
    "String",
    "Hash Table",
    "Two Pointers",
    "Sliding Window",
    "Stack",
    "Binary Search",
    "Linked List",
    "Tree",
    "Graph",
    "Dynamic Programming",
    "Greedy",
    "Bit Manipulation",
  ];

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 100,
      };
      if (search.trim()) params.search = search.trim();
      if (difficulty !== "All") params.difficulty = difficulty;
      if (selectedTag !== "All") params.tag = selectedTag;

      const data = await problemApi.getProblems(params);
      setProblems(data.problems || []);
      setTotalPages(data.totalPages || 1);
      setTotalProblems(data.total || 0);
    } catch (err) {
      console.error("Failed to load problems:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [page, difficulty, selectedTag]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProblems();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const solvedSet = new Set(
    (user?.solvedProblems || []).map((id) => (typeof id === "object" ? id._id || id : id))
  );

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner with Cinematic Glow */}
        <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#12141c] via-[#0e1017] to-[#0a0b0e] border border-white/[0.08] shadow-2xl overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#ff3b3b]" />
              <span>53 CURATED ALGORITHMIC CHALLENGES</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
              Master Data Structures &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-red-400">
                Algorithmic Thinking
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Solve real-world coding problems with live Judge0 multi-language execution, progressive hints, and our AI Coding Assistant.
            </p>

            <div className="flex items-center gap-6 pt-2 font-mono text-xs text-slate-400">
              <div>
                <span className="text-white font-bold text-base">{totalProblems}</span> Total Problems
              </div>
              <div className="border-l border-white/[0.1] pl-6">
                <span className="text-emerald-400 font-bold text-base">18</span> Easy
              </div>
              <div className="border-l border-white/[0.1] pl-6">
                <span className="text-amber-400 font-bold text-base">26</span> Medium
              </div>
              <div className="border-l border-white/[0.1] pl-6">
                <span className="text-red-400 font-bold text-base">9</span> Hard
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search Control Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search problem title or topic..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12141a] border border-white/[0.08] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">Difficulty:</span>
              <div className="flex items-center rounded-xl bg-[#12141a] border border-white/[0.08] p-1">
                {["All", "Easy", "Medium", "Hard"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setDifficulty(diff);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      difficulty === diff
                        ? "bg-white/[0.1] text-white shadow-sm font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Tag Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <TagBadge
                key={cat}
                tag={cat}
                active={selectedTag === cat}
                onClick={() => {
                  setSelectedTag(cat);
                  setPage(1);
                }}
              />
            ))}
          </div>
        </div>

        {/* Problems Table / List */}
        <div className="rounded-2xl bg-[#0f1117] border border-white/[0.08] overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
              <p className="text-slate-500 font-mono text-xs">LOADING PROBLEMS...</p>
            </div>
          ) : problems.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Code2 className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-semibold text-slate-300">No matching problems found</h3>
              <p className="text-sm text-slate-500">
                Try clearing your search or difficulty filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4 w-12 text-center">Status</th>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4 w-32">Difficulty</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Tags</th>
                    <th className="py-3.5 px-4 w-28 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-sm">
                  {problems.map((problem, idx) => {
                    const isSolved = solvedSet.has(problem._id);
                    return (
                      <tr
                        key={problem._id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        {/* Status Icon */}
                        <td className="py-4 px-4 text-center">
                          {isSolved ? (
                            <CheckCircle2
                              className="w-4 h-4 text-emerald-400 inline-block"
                              title="Solved"
                            />
                          ) : (
                            <Circle
                              className="w-4 h-4 text-slate-600 inline-block group-hover:text-slate-400"
                              title="Unsolved"
                            />
                          )}
                        </td>

                        {/* Problem Title & Slug Link */}
                        <td className="py-4 px-4">
                          <Link
                            to={`/problems/${problem.slug}`}
                            className="font-semibold text-slate-200 group-hover:text-[#ff4b4b] transition-colors flex items-center gap-2"
                          >
                            <span>
                              {problem.title}
                            </span>
                          </Link>
                        </td>

                        {/* Difficulty */}
                        <td className="py-4 px-4">
                          <DifficultyBadge difficulty={problem.difficulty} size="sm" />
                        </td>

                        {/* Tags */}
                        <td className="py-4 px-4 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1.5">
                            {(problem.tags || []).slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.04]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Action Link */}
                        <td className="py-4 px-4 text-right">
                          <Link
                            to={`/problems/${problem.slug}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white border border-white/[0.08] transition-all"
                          >
                            <span>Solve</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

