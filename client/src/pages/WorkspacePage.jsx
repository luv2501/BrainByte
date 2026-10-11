import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import confetti from "canvas-confetti";
import { problemApi } from "../api/problemApi.js";
import { submissionApi } from "../api/submissionApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import BrainByteLogo from "../components/common/BrainByteLogo.jsx";
import { DifficultyBadge, VerdictBadge } from "../components/common/Badge.jsx";
import AIAssistantDrawer from "../components/editor/AIAssistantDrawer.jsx";
import {
  Play,
  Send,
  Sparkles,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Terminal,
  FileText,
  History,
  Lightbulb,
  Zap,
  Flame,
  Maximize2,
  RotateCcw,
} from "lucide-react";

export default function WorkspacePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, updateUserStats } = useAuth();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Editor states
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [activeLeftTab, setActiveLeftTab] = useState("description"); // description, submissions, hints
  const [activeConsoleTab, setActiveConsoleTab] = useState("testcases"); // testcases, result, custom
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);
  const [customInput, setCustomInput] = useState("");

  // Execution states
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // AI Assistant drawer
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  const supportedLanguages = [
    { id: "javascript", label: "JavaScript (Node.js)" },
    { id: "python", label: "Python 3" },
    { id: "cpp", label: "C++ (GCC)" },
    { id: "java", label: "Java (OpenJDK)" },
    { id: "typescript", label: "TypeScript" },
    { id: "c", label: "C (GCC)" },
  ];

  // Fetch problem details
  useEffect(() => {
    const loadProblem = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await problemApi.getProblemBySlug(slug);
        setProblem(data);

        // Load starter code for selected language
        const initialCode =
          data.starterCode?.[language] ||
          data.starterCode?.javascript ||
          "// Write your solution here\n";
        setCode(initialCode);
      } catch (err) {
        setError(err.message || "Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    loadProblem();
  }, [slug]);

  // Update starter code when language changes
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (problem?.starterCode?.[newLang]) {
      setCode(problem.starterCode[newLang]);
    }
  };

  const handleResetCode = () => {
    if (problem?.starterCode?.[language]) {
      setCode(problem.starterCode[language]);
    }
  };

  // Fetch user submission history for this problem
  const fetchSubmissionHistory = async () => {
    if (!problem?._id) return;
    try {
      setLoadingHistory(true);
      const data = await submissionApi.getMySubmissions({ problemId: problem._id });
      setSubmissionHistory(data || []);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeLeftTab === "submissions") {
      fetchSubmissionHistory();
    }
  }, [activeLeftTab, problem]);

  // Quick Run against sample visible test cases (Zero DB writes)
  const handleRun = async () => {
    if (!code || !code.trim()) return;

    try {
      setRunning(true);
      setActiveConsoleTab("result");
      setExecutionResult(null);

      let payload = {
        code,
        language,
      };

      if (activeConsoleTab === "custom" && customInput.trim()) {
        payload.input = customInput;
      } else {
        payload.slug = problem.slug;
        payload.problemId = problem._id;
      }

      const result = await submissionApi.runCode(payload);
      setExecutionResult({
        type: "run",
        ...result,
      });
    } catch (err) {
      setExecutionResult({
        type: "run",
        status: "Error",
        stderr: err.message,
      });
    } finally {
      setRunning(false);
    }
  };

  // Final Submit against ALL test cases (grades, awards XP & streak)
  const handleSubmit = async () => {
    if (!code || !code.trim()) return;

    try {
      setSubmitting(true);
      setActiveConsoleTab("result");
      setExecutionResult(null);

      const data = await submissionApi.submitCode({
        code,
        language,
        problemId: problem._id,
        slug: problem.slug,
      });

      const submission = data.submission;
      const evaluation = data.evaluation;

      setExecutionResult({
        type: "submit",
        verdict: submission.verdict,
        status: submission.verdict,
        passedTests: submission.passedTestCases,
        totalTests: submission.totalTestCases,
        runtimeMs: submission.runtimeMs,
        firstTimeSolved: data.firstTimeSolved,
        xpAwarded: data.xpAwarded,
        results: evaluation?.results || [],
      });

      // If Accepted, trigger celebration & sync stats
      if (submission.verdict === "Accepted") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ef4444", "#06b6d4", "#f59e0b", "#ffffff"],
        });

        if (data.firstTimeSolved) {
          updateUserStats({
            xp: (user?.xp || 0) + data.xpAwarded,
            streak: (user?.streak || 0) + 1,
          });
        }
      }

      // Refresh history tab if active
      fetchSubmissionHistory();
    } catch (err) {
      setExecutionResult({
        type: "submit",
        verdict: "Error",
        status: "Error",
        stderr: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
          <p className="text-slate-400 font-mono text-xs tracking-wider animate-pulse">
            INITIALIZING WORKSPACE...
          </p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-[#08090c] text-white flex flex-col items-center justify-center p-6 space-y-4">
        <p className="text-red-400 font-semibold">{error || "Problem not found"}</p>
        <Link
          to="/problems"
          className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-sm font-medium transition-colors"
        >
          &larr; Back to Problems
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#08090c] text-slate-200 overflow-hidden font-sans">
      {/* Top Workspace Action Header */}
      <header className="h-14 px-4 border-b border-white/[0.08] bg-[#0c0d12] flex items-center justify-between shrink-0 z-30">
        {/* Left: Navigation & Problem Title */}
        <div className="flex items-center gap-4">
          <Link
            to="/problems"
            className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Problems</span>
          </Link>

          <div className="h-4 w-[1px] bg-white/[0.1]" />

          <div className="flex items-center gap-2.5">
            <h1 className="text-sm font-bold text-white max-w-[200px] sm:max-w-md truncate">
              {problem.title}
            </h1>
            <DifficultyBadge difficulty={problem.difficulty} size="sm" />
          </div>
        </div>

        {/* Center/Right: Actions (Language, AI Drawer, Run, Submit) */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-[#14161f] border border-white/[0.1] text-xs font-medium text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-red-500/50 cursor-pointer"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-[#14161f] text-slate-200">
                {lang.label}
              </option>
            ))}
          </select>

          {/* AI Assistant Toggle Button */}
          <button
            onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              aiDrawerOpen
                ? "bg-gradient-to-r from-red-600/30 to-cyan-600/30 text-white border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/[0.08]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff3b3b]" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          {/* Run Button (Transient Test) */}
          <button
            onClick={handleRun}
            disabled={running || submitting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-white/[0.06] hover:bg-white/[0.1] hover:text-white border border-white/[0.1] transition-all disabled:opacity-50"
          >
            {running ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-300/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            )}
            <span>Run</span>
          </button>

          {/* Submit Button (Final Grading) */}
          <button
            onClick={handleSubmit}
            disabled={running || submitting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#e13b3b] to-[#b91c1c] hover:from-[#f04b4b] hover:to-[#dc2626] border border-red-500/30 shadow-[0_0_15px_rgba(225,59,59,0.35)] transition-all disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Submit</span>
          </button>
        </div>
      </header>

      {/* Main Split-Pane Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Pane: Problem Details / Submissions / Hints */}
        <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#0d0e14] overflow-hidden">
          {/* Left Tabs Bar */}
          <div className="flex items-center gap-1 px-4 border-b border-white/[0.08] bg-[#12141c] h-10 shrink-0">
            <button
              onClick={() => setActiveLeftTab("description")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeLeftTab === "description"
                  ? "text-white bg-white/[0.08] font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#ff3b3b]" />
              <span>Description</span>
            </button>

            <button
              onClick={() => setActiveLeftTab("submissions")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeLeftTab === "submissions"
                  ? "text-white bg-white/[0.08] font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Submissions</span>
            </button>

            {problem.hints && problem.hints.length > 0 && (
              <button
                onClick={() => setActiveLeftTab("hints")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeLeftTab === "hints"
                    ? "text-white bg-white/[0.08] font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Hints ({problem.hints.length})</span>
              </button>
            )}
          </div>

          {/* Left Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm leading-relaxed text-slate-300">
            {activeLeftTab === "description" && (
              <>
                {/* Description Body */}
                <div className="space-y-4">
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap">
                    {problem.description}
                  </div>
                </div>

                {/* Examples Section */}
                {problem.examples && problem.examples.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                      Examples
                    </h3>
                    <div className="space-y-3">
                      {problem.examples.map((ex, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl bg-[#14161f] border border-white/[0.06] space-y-1.5 font-mono text-xs"
                        >
                          <p className="font-semibold text-slate-400">Example {i + 1}:</p>
                          <p>
                            <span className="text-slate-500">Input: </span>
                            <span className="text-slate-200">{ex.input}</span>
                          </p>
                          <p>
                            <span className="text-slate-500">Output: </span>
                            <span className="text-emerald-400">{ex.output}</span>
                          </p>
                          {ex.explanation && (
                            <p className="text-slate-400 text-[11px] font-sans pt-1">
                              <span className="text-slate-500 font-mono">Explanation: </span>
                              {ex.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Constraints Section */}
                {problem.constraints && problem.constraints.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                      Constraints
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-xs font-mono text-slate-400 pl-1">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {problem.tags && problem.tags.length > 0 && (
                  <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500 font-mono">Tags:</span>
                    {problem.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[11px] text-slate-400 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeLeftTab === "submissions" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                  My Submission History
                </h3>
                {loadingHistory ? (
                  <div className="py-8 text-center text-xs text-slate-500 font-mono animate-pulse">
                    LOADING SUBMISSIONS...
                  </div>
                ) : submissionHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4">No submissions yet for this problem.</p>
                ) : (
                  <div className="space-y-2">
                    {submissionHistory.map((sub) => (
                      <div
                        key={sub._id}
                        className="p-3 rounded-xl bg-[#14161f] border border-white/[0.06] flex items-center justify-between text-xs font-mono"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <VerdictBadge verdict={sub.verdict} />
                            <span className="text-slate-400">{sub.language}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {new Date(sub.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right text-slate-400">
                          <p>
                            {sub.passedTestCases}/{sub.totalTestCases} Passed
                          </p>
                          {sub.runtimeMs && <p className="text-[11px]">{sub.runtimeMs}ms</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeLeftTab === "hints" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                  Problem Hints
                </h3>
                {problem.hints.map((hint, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-[#14161f] border border-white/[0.06] text-xs text-slate-300 space-y-1"
                  >
                    <p className="font-semibold text-amber-400 font-mono">Hint {i + 1}:</p>
                    <p>{hint}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Monaco Editor & Interactive Test Console */}
        <div className="w-full lg:w-1/2 flex flex-col bg-[#0b0c10] overflow-hidden">
          {/* Editor Header */}
          <div className="h-10 px-4 border-b border-white/[0.08] bg-[#12141c] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>solution.{language === "python" ? "py" : language === "cpp" ? "cpp" : language === "java" ? "java" : "js"}</span>
            </div>

            <button
              onClick={handleResetCode}
              title="Reset code template"
              className="p-1 rounded hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Monaco Code Editor Container */}
          <div className="flex-1 min-h-[300px]">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language === "java" ? "java" : language === "python" ? "python" : language === "typescript" ? "typescript" : "javascript"}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                fontSize: 13,
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                roundedSelection: true,
                padding: { top: 12, bottom: 12 },
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>

          {/* Bottom Test & Results Console */}
          <div className="h-64 border-t border-white/[0.08] bg-[#0e1017] flex flex-col shrink-0">
            {/* Console Tabs Bar */}
            <div className="flex items-center justify-between px-4 border-b border-white/[0.08] bg-[#12141c] h-9">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveConsoleTab("testcases")}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                    activeConsoleTab === "testcases"
                      ? "text-white bg-white/[0.08]"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Test Cases
                </button>
                <button
                  onClick={() => setActiveConsoleTab("result")}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                    activeConsoleTab === "result"
                      ? "text-white bg-white/[0.08]"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Test Result
                </button>
                <button
                  onClick={() => setActiveConsoleTab("custom")}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                    activeConsoleTab === "custom"
                      ? "text-white bg-white/[0.08]"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Custom Input
                </button>
              </div>
            </div>

            {/* Console Body */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300">
              {activeConsoleTab === "testcases" && (
                <div className="space-y-3">
                  {/* Test case index selector */}
                  <div className="flex items-center gap-2">
                    {(problem.testCases || []).map((tc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTestCaseIdx(idx)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          selectedTestCaseIdx === idx
                            ? "bg-white/[0.12] text-white"
                            : "bg-white/[0.04] text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>

                  {/* Selected Test Case Content */}
                  {problem.testCases?.[selectedTestCaseIdx] && (
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-500 uppercase">Input</span>
                        <div className="p-2.5 rounded-lg bg-[#14161f] border border-white/[0.06] text-slate-200">
                          {problem.testCases[selectedTestCaseIdx].input}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-500 uppercase">Expected Output</span>
                        <div className="p-2.5 rounded-lg bg-[#14161f] border border-white/[0.06] text-emerald-400">
                          {problem.testCases[selectedTestCaseIdx].expectedOutput}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeConsoleTab === "result" && (
                <div>
                  {running || submitting ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                      <div className="w-5 h-5 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin" />
                      <p className="text-xs">
                        {submitting ? "Evaluating all test cases on Judge0..." : "Running code..."}
                      </p>
                    </div>
                  ) : !executionResult ? (
                    <p className="text-slate-500 py-6 text-center">
                      Run your code or Submit to view execution verdicts.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {/* Verdict Banner */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <VerdictBadge verdict={executionResult.verdict || executionResult.status} />
                          {executionResult.firstTimeSolved && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-500/30 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-400" />
                              +{executionResult.xpAwarded} XP Earned!
                            </span>
                          )}
                        </div>

                        {executionResult.runtimeMs && (
                          <span className="text-slate-400 text-xs flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {executionResult.runtimeMs}ms
                          </span>
                        )}
                      </div>

                      {/* Passed Test Count */}
                      {executionResult.totalTests && (
                        <p className="text-slate-300 text-xs">
                          Passed:{" "}
                          <strong className="text-white">
                            {executionResult.passedTests} / {executionResult.totalTests}
                          </strong>{" "}
                          test cases
                        </p>
                      )}

                      {/* Stdout / Stderr / Compile Error */}
                      {executionResult.stdout && (
                        <div className="space-y-1">
                          <span className="text-[11px] text-slate-500 uppercase">Stdout:</span>
                          <pre className="p-2.5 rounded-lg bg-[#14161f] border border-white/[0.06] text-slate-200 overflow-x-auto">
                            {executionResult.stdout}
                          </pre>
                        </div>
                      )}

                      {executionResult.stderr && (
                        <div className="space-y-1">
                          <span className="text-[11px] text-red-400 uppercase">Error Output:</span>
                          <pre className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 text-red-300 overflow-x-auto whitespace-pre-wrap">
                            {executionResult.stderr}
                          </pre>
                        </div>
                      )}

                      {executionResult.compile_output && (
                        <div className="space-y-1">
                          <span className="text-[11px] text-orange-400 uppercase">Compile Output:</span>
                          <pre className="p-2.5 rounded-lg bg-orange-950/30 border border-orange-500/30 text-orange-300 overflow-x-auto whitespace-pre-wrap">
                            {executionResult.compile_output}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeConsoleTab === "custom" && (
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-500 uppercase">Custom Input String:</span>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter custom stdin test input..."
                    rows={4}
                    className="w-full p-2.5 rounded-lg bg-[#14161f] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-red-500/40 resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Assistant Drawer (Docked / Slide-over) */}
        {aiDrawerOpen && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-96 z-40 shadow-2xl">
            <AIAssistantDrawer
              problem={problem}
              code={code}
              language={language}
              lastExecutionResult={executionResult}
              isOpen={aiDrawerOpen}
              onClose={() => setAiDrawerOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

