import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { submissionApi } from "../api/submissionApi.js";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import { VerdictBadge, DifficultyBadge } from "../components/common/Badge.jsx";
import {
  FileCheck2,
  Clock,
  Code2,
  X,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const data = await submissionApi.getMySubmissions();
        setSubmissions(data || []);
      } catch (err) {
        console.error("Failed to load submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white flex items-center gap-2">
              <FileCheck2 className="w-7 h-7 text-[#ff3b3b]" />
              <span>Submission History</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Review your past coding submissions, verdicts, runtime performance, and source code.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            Total Submissions: <strong className="text-white">{submissions.length}</strong>
          </div>
        </div>

        {/* Submissions Table Container */}
        <div className="rounded-2xl bg-[#0f1117] border border-white/[0.08] overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
              <p className="text-slate-500 font-mono text-xs">LOADING SUBMISSIONS...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Code2 className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-semibold text-slate-300">No submissions recorded yet</h3>
              <p className="text-sm text-slate-500">
                Go to the problems dashboard, write a solution, and submit your code.
              </p>
              <Link
                to="/problems"
                className="inline-block mt-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Browse Problems
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4">Problem</th>
                    <th className="py-3.5 px-4">Verdict</th>
                    <th className="py-3.5 px-4">Language</th>
                    <th className="py-3.5 px-4">Test Cases</th>
                    <th className="py-3.5 px-4">Runtime</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">View Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-xs font-mono">
                  {submissions.map((sub) => (
                    <tr
                      key={sub._id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Problem Title & Slug */}
                      <td className="py-4 px-4 font-sans font-medium text-slate-200">
                        <Link
                          to={`/problems/${sub.problem?.slug}`}
                          className="hover:text-[#ff3b3b] transition-colors flex items-center gap-1.5"
                        >
                          <span>{sub.problem?.title || "Problem"}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-red-400" />
                        </Link>
                      </td>

                      {/* Verdict */}
                      <td className="py-4 px-4">
                        <VerdictBadge verdict={sub.verdict} />
                      </td>

                      {/* Language */}
                      <td className="py-4 px-4 text-slate-400 capitalize">
                        {sub.language}
                      </td>

                      {/* Test Cases Passed */}
                      <td className="py-4 px-4 text-slate-300">
                        {sub.passedTestCases} / {sub.totalTestCases}
                      </td>

                      {/* Runtime */}
                      <td className="py-4 px-4 text-slate-400">
                        {sub.runtimeMs ? `${sub.runtimeMs}ms` : "-"}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-slate-500 font-sans text-[11px]">
                        {new Date(sub.createdAt).toLocaleDateString()}{" "}
                        {new Date(sub.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* View Code Action Button */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Code Viewer Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-[#12141c] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#ff3b3b]" />
                <h3 className="text-sm font-bold text-white">
                  {selectedSubmission.problem?.title} &bull;{" "}
                  <span className="capitalize font-mono text-slate-400">
                    {selectedSubmission.language}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Stats Bar */}
            <div className="px-6 py-2.5 bg-[#0a0b0e] border-b border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <VerdictBadge verdict={selectedSubmission.verdict} />
                <span className="text-slate-400">
                  {selectedSubmission.passedTestCases}/{selectedSubmission.totalTestCases} Passed
                </span>
              </div>
              <span className="text-slate-500">
                {new Date(selectedSubmission.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Modal Code Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#090a0d]">
              <pre className="p-4 rounded-xl bg-[#0e1017] border border-white/[0.06] font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {selectedSubmission.code}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-white/[0.08] flex items-center justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

