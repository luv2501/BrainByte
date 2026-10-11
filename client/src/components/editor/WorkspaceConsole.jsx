import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Zap,
  ChevronRight,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";
import { VerdictBadge } from "../common/Badge.jsx";

export default function WorkspaceConsole({
  activeTab = "testcases",
  setActiveTab,
  problem,
  selectedTestCaseIdx = 0,
  setSelectedTestCaseIdx,
  customInput = "",
  setCustomInput,
  running = false,
  submitting = false,
  executionResult = null,
  isCollapsed = false,
  onToggleCollapse,
}) {
  const testCases = problem?.testCases || [];

  return (
    <div className="flex-1 flex flex-col bg-[#0b0c12] min-h-0 overflow-hidden select-none">
      {/* Console Header Tabs */}
      <div className="h-9 px-3 border-b border-white/[0.06] bg-[#0e1017] flex items-center justify-between shrink-0">
        {/* Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setActiveTab("testcases");
              if (isCollapsed && onToggleCollapse) onToggleCollapse();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeTab === "testcases"
                ? "text-white bg-white/[0.08] font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Test Cases</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("result");
              if (isCollapsed && onToggleCollapse) onToggleCollapse();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeTab === "result"
                ? "text-white bg-white/[0.08] font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                executionResult
                  ? executionResult.verdict === "Accepted"
                    ? "bg-emerald-400"
                    : "bg-red-400"
                  : "bg-slate-500"
              }`}
            />
            <span>Test Result</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("custom");
              if (isCollapsed && onToggleCollapse) onToggleCollapse();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeTab === "custom"
                ? "text-white bg-white/[0.08] font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
            }`}
          >
            <span>Custom Input</span>
          </button>
        </div>

        {/* Right Console Actions: Collapse / Expand */}
        {onToggleCollapse && (
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleCollapse}
              title={isCollapsed ? "Expand test panel" : "Collapse test panel"}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              {isCollapsed ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Console Content Area */}
      {!isCollapsed && (
        <div className="flex-1 p-3.5 overflow-y-auto font-mono text-xs text-slate-300">
          {/* TAB 1: SAMPLE TEST CASES */}
          {activeTab === "testcases" && (
            <div className="space-y-3">
              {/* Test Case Selectors */}
              <div className="flex items-center gap-2 flex-wrap">
                {testCases.map((tc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTestCaseIdx(idx)}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-all border ${
                      selectedTestCaseIdx === idx
                        ? "bg-white/[0.1] text-white border-white/[0.15] font-semibold shadow-sm"
                        : "bg-white/[0.02] text-slate-400 border-white/[0.04] hover:bg-white/[0.06] hover:text-slate-200"
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>

              {/* Selected Test Case Details */}
              {testCases[selectedTestCaseIdx] ? (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider">
                      Input
                    </span>
                    <pre className="p-3 rounded-lg bg-[#12141c] border border-white/[0.06] text-slate-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                      {testCases[selectedTestCaseIdx].input}
                    </pre>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider">
                      Expected Output
                    </span>
                    <pre className="p-3 rounded-lg bg-[#12141c] border border-white/[0.06] text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                      {testCases[selectedTestCaseIdx].expectedOutput}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 py-4">No test cases available.</p>
              )}
            </div>
          )}

          {/* TAB 2: EXECUTION RESULT */}
          {activeTab === "result" && (
            <div>
              {running || submitting ? (
                <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <div className="w-6 h-6 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
                  <p className="text-xs font-mono tracking-wide">
                    {submitting
                      ? "Evaluating all test cases on Judge..."
                      : "Executing code against sample cases..."}
                  </p>
                </div>
              ) : !executionResult ? (
                <div className="py-10 text-center space-y-2">
                  <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-slate-400 font-medium">Ready for execution</p>
                  <p className="text-slate-500 text-[11px]">
                    Click <strong className="text-slate-300">Run</strong> to test sample cases or{" "}
                    <strong className="text-slate-300">Submit</strong> to grade your solution.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {/* Verdict and Performance Bar */}
                  <div className="p-3 rounded-xl bg-[#12141c] border border-white/[0.06] flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <VerdictBadge verdict={executionResult.verdict || executionResult.status} />

                      {executionResult.firstTimeSolved && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-semibold border border-amber-500/30 flex items-center gap-1 shadow-sm">
                          <Zap className="w-3 h-3 text-amber-400" />
                          +{executionResult.xpAwarded} XP Earned!
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      {executionResult.runtimeMs && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{executionResult.runtimeMs}ms</span>
                        </span>
                      )}

                      {executionResult.totalTests && (
                        <span className="text-slate-300">
                          Passed:{" "}
                          <strong className="text-white">
                            {executionResult.passedTests}/{executionResult.totalTests}
                          </strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Test Results Breakdown (if present) */}
                  {executionResult.results && executionResult.results.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider">
                        Evaluated Cases
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {executionResult.results.map((r, i) => (
                          <div
                            key={i}
                            className={`p-2.5 rounded-lg border font-mono text-xs flex items-center justify-between ${
                              r.passed
                                ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-300"
                                : "bg-red-950/20 border-red-500/20 text-red-300"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {r.passed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                              <span>Test Case {i + 1}</span>
                            </div>
                            <span className="text-[11px] opacity-80">
                              {r.passed ? "Passed" : "Wrong Answer"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stdout Output */}
                  {executionResult.stdout && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider">
                        Stdout
                      </span>
                      <pre className="p-3 rounded-lg bg-[#12141c] border border-white/[0.06] text-slate-200 overflow-x-auto whitespace-pre-wrap font-mono text-xs">
                        {executionResult.stdout}
                      </pre>
                    </div>
                  )}

                  {/* Stderr Error Output */}
                  {executionResult.stderr && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono font-medium text-red-400 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Execution Error</span>
                      </span>
                      <pre className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-red-300 overflow-x-auto whitespace-pre-wrap font-mono text-xs">
                        {executionResult.stderr}
                      </pre>
                    </div>
                  )}

                  {/* Compile Output */}
                  {executionResult.compile_output && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono font-medium text-orange-400 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Compilation Error</span>
                      </span>
                      <pre className="p-3 rounded-lg bg-orange-950/30 border border-orange-500/30 text-orange-300 overflow-x-auto whitespace-pre-wrap font-mono text-xs">
                        {executionResult.compile_output}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CUSTOM INPUT */}
          {activeTab === "custom" && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider">
                Custom Standard Input (stdin)
              </span>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter custom stdin test input..."
                rows={5}
                className="w-full p-3 rounded-lg bg-[#12141c] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-red-500/50 resize-none placeholder-slate-600"
              />
              <p className="text-[11px] text-slate-500 font-mono">
                Clicking <strong>Run</strong> will feed this custom string directly into your program's stdin.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
