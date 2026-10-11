import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { problemApi } from "../api/problemApi.js";
import { submissionApi } from "../api/submissionApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { DifficultyBadge, VerdictBadge } from "../components/common/Badge.jsx";
import WorkspaceEditor from "../components/editor/WorkspaceEditor.jsx";
import WorkspaceConsole from "../components/editor/WorkspaceConsole.jsx";
import AIAssistantDrawer from "../components/editor/AIAssistantDrawer.jsx";
import {
  Play,
  Send,
  Sparkles,
  ChevronLeft,
  FileText,
  History,
  Lightbulb,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sliders,
  ChevronRight,
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

  // Layout states (resizable panels & fullscreen editor)
  const [leftWidthPercent, setLeftWidthPercent] = useState(() => {
    const saved = localStorage.getItem("brainbyte_workspace_split");
    return saved ? parseFloat(saved) : 45;
  });
  const [consoleHeightPx, setConsoleHeightPx] = useState(() => {
    const saved = localStorage.getItem("brainbyte_console_height");
    return saved ? parseInt(saved, 10) : 260;
  });
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);

  // Dragging states
  const isDraggingHorizontal = useRef(false);
  const isDraggingVertical = useRef(false);
  const workspaceContainerRef = useRef(null);
  const rightPaneRef = useRef(null);

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

  const handleResetLayout = () => {
    setLeftWidthPercent(45);
    setConsoleHeightPx(260);
    setIsEditorMaximized(false);
    setIsConsoleCollapsed(false);
    localStorage.removeItem("brainbyte_workspace_split");
    localStorage.removeItem("brainbyte_console_height");
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

  // Panel Resizing logic (Smooth Draggable Dividers)
  const handleMouseDownH = useCallback((e) => {
    e.preventDefault();
    isDraggingHorizontal.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const handleMouseDownV = useCallback((e) => {
    e.preventDefault();
    isDraggingVertical.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Horizontal split (between left description and right editor)
      if (isDraggingHorizontal.current && workspaceContainerRef.current) {
        const containerRect = workspaceContainerRef.current.getBoundingClientRect();
        const newLeftWidth = e.clientX - containerRect.left;
        const totalWidth = containerRect.width;
        let percentage = (newLeftWidth / totalWidth) * 100;
        percentage = Math.max(20, Math.min(80, percentage));
        setLeftWidthPercent(percentage);
        localStorage.setItem("brainbyte_workspace_split", percentage.toFixed(1));
      }

      // Vertical split (between editor and bottom console)
      if (isDraggingVertical.current && rightPaneRef.current) {
        const rightRect = rightPaneRef.current.getBoundingClientRect();
        const newConsoleHeight = rightRect.bottom - e.clientY;
        const clampedHeight = Math.max(100, Math.min(rightRect.height - 120, newConsoleHeight));
        setConsoleHeightPx(clampedHeight);
        localStorage.setItem("brainbyte_console_height", String(clampedHeight));
      }
    };

    const handleMouseUp = () => {
      if (isDraggingHorizontal.current || isDraggingVertical.current) {
        isDraggingHorizontal.current = false;
        isDraggingVertical.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Quick Run against sample visible test cases (Zero DB writes)
  const handleRun = async () => {
    if (!code || !code.trim()) return;

    try {
      setRunning(true);
      setActiveConsoleTab("result");
      setIsConsoleCollapsed(false);
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
      setIsConsoleCollapsed(false);
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

        const updatedStats = {};
        if (data.firstTimeSolved && data.xpAwarded) {
          updatedStats.xp = (user?.xp || 0) + data.xpAwarded;
        }
        if (typeof data.streak === "number") {
          updatedStats.streak = data.streak;
        }
        if (Object.keys(updatedStats).length > 0) {
          updateUserStats(updatedStats);
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
      <header className="h-14 px-4 border-b border-white/[0.08] bg-[#0c0d13] flex items-center justify-between shrink-0 z-30 select-none">
        {/* Left: Navigation & Problem Title */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            to="/problems"
            className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Problems</span>
          </Link>

          <div className="h-4 w-[1px] bg-white/[0.1] shrink-0" />

          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-sm font-bold font-display text-white max-w-[160px] sm:max-w-xs md:max-w-md truncate">
              {problem.title}
            </h1>
            <DifficultyBadge difficulty={problem.difficulty} size="sm" />
          </div>
        </div>

        {/* Center/Right: Actions (Language, AI Drawer, Run, Submit, Layout Reset) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Reset Layout button */}
          <button
            onClick={handleResetLayout}
            title="Reset workspace panels layout"
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden lg:inline text-[11px]">Reset Layout</span>
          </button>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-[#141622] border border-white/[0.1] text-xs font-mono font-medium text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-red-500/50 cursor-pointer"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-[#141622] text-slate-200">
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
      <div
        ref={workspaceContainerRef}
        className="flex-1 flex flex-col lg:flex-row overflow-hidden relative min-h-0"
      >
        {/* Left Pane: Problem Details / Submissions / Hints */}
        {!isEditorMaximized && (
          <div
            style={{ width: `${leftWidthPercent}%` }}
            className="hidden lg:flex flex-col bg-[#0d0e14] overflow-hidden min-w-[280px]"
          >
            {/* Left Tabs Bar */}
            <div className="flex items-center gap-1 px-4 border-b border-white/[0.08] bg-[#12141c] h-10 shrink-0 select-none">
              <button
                onClick={() => setActiveLeftTab("description")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeLeftTab === "description"
                    ? "text-white bg-white/[0.08] font-semibold shadow-sm"
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
                    ? "text-white bg-white/[0.08] font-semibold shadow-sm"
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
                      ? "text-white bg-white/[0.08] font-semibold shadow-sm"
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
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
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
                            className="p-3.5 rounded-xl bg-[#141620] border border-white/[0.06] space-y-2 font-mono text-xs shadow-inner"
                          >
                            <p className="font-semibold text-slate-300">Example {i + 1}:</p>
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
                      <ul className="list-disc list-inside space-y-1.5 text-xs font-mono text-slate-400 pl-1">
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
                          className="p-3 rounded-xl bg-[#141620] border border-white/[0.06] flex items-center justify-between text-xs font-mono"
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
                      className="p-3.5 rounded-xl bg-[#141620] border border-white/[0.06] text-xs text-slate-300 space-y-1"
                    >
                      <p className="font-semibold text-amber-400 font-mono">Hint {i + 1}:</p>
                      <p>{hint}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vertical Draggable Divider (Horizontal Split between description and editor) */}
        {!isEditorMaximized && (
          <div
            onMouseDown={handleMouseDownH}
            className="hidden lg:flex w-2 bg-[#090a0f] hover:bg-red-500/40 active:bg-red-500/60 workspace-resizer-col items-center justify-center transition-colors border-x border-white/[0.04] z-20 group"
            title="Drag to resize panels"
          >
            <div className="w-0.5 h-8 bg-slate-600 rounded group-hover:bg-red-400 transition-colors" />
          </div>
        )}

        {/* Right Pane: Monaco Code Editor & Test Console */}
        <div
          ref={rightPaneRef}
          style={{ width: isEditorMaximized ? "100%" : undefined }}
          className={`flex-1 flex flex-col bg-[#0b0c10] overflow-hidden min-w-[320px] ${
            isEditorMaximized ? "w-full" : ""
          }`}
        >
          {/* Top: Editor Panel */}
          <WorkspaceEditor
            language={language}
            code={code}
            onChange={setCode}
            onResetCode={handleResetCode}
            isMaximized={isEditorMaximized}
            onToggleMaximize={() => setIsEditorMaximized(!isEditorMaximized)}
          />

          {/* Horizontal Draggable Divider (Vertical Split between editor and console) */}
          {!isConsoleCollapsed && (
            <div
              onMouseDown={handleMouseDownV}
              className="h-2 bg-[#090a0f] hover:bg-red-500/40 active:bg-red-500/60 workspace-resizer-row flex items-center justify-center transition-colors border-y border-white/[0.04] z-20 group shrink-0"
              title="Drag to resize test console"
            >
              <div className="h-0.5 w-12 bg-slate-600 rounded group-hover:bg-red-400 transition-colors" />
            </div>
          )}

          {/* Bottom: Test Cases & Execution Console */}
          <div
            style={{
              height: isConsoleCollapsed ? "36px" : `${consoleHeightPx}px`,
            }}
            className="flex flex-col shrink-0 overflow-hidden transition-all duration-150"
          >
            <WorkspaceConsole
              activeTab={activeConsoleTab}
              setActiveTab={setActiveConsoleTab}
              problem={problem}
              selectedTestCaseIdx={selectedTestCaseIdx}
              setSelectedTestCaseIdx={setSelectedTestCaseIdx}
              customInput={customInput}
              setCustomInput={setCustomInput}
              running={running}
              submitting={submitting}
              executionResult={executionResult}
              isCollapsed={isConsoleCollapsed}
              onToggleCollapse={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
            />
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
