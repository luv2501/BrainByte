import React, { useState } from "react";
import { aiApi } from "../../api/aiApi.js";
import {
  Sparkles,
  Lightbulb,
  BookOpen,
  Bug,
  X,
  Loader2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AIAssistantDrawer({
  problem,
  code,
  language,
  lastExecutionResult,
  isOpen,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState("hint");
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState({
    hint: "",
    explain: "",
    debug: "",
  });
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGetHint = async () => {
    try {
      setLoading(true);
      const data = await aiApi.getHint({
        problemId: problem._id,
        slug: problem.slug,
        currentCode: code,
        language,
      });
      setResponses((prev) => ({ ...prev, hint: data.hint }));
    } catch (err) {
      setResponses((prev) => ({
        ...prev,
        hint: `⚠️ Error fetching hint: ${err.message}`,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleExplainCode = async () => {
    if (!code || !code.trim()) {
      setResponses((prev) => ({ ...prev, explain: "Please write some code first to explain." }));
      return;
    }

    try {
      setLoading(true);
      const data = await aiApi.explainCode({
        code,
        language,
        problemId: problem._id,
        slug: problem.slug,
        problemTitle: problem.title,
      });
      setResponses((prev) => ({ ...prev, explain: data.explanation }));
    } catch (err) {
      setResponses((prev) => ({
        ...prev,
        explain: `⚠️ Error generating explanation: ${err.message}`,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleDebugCode = async () => {
    if (!code || !code.trim()) {
      setResponses((prev) => ({ ...prev, debug: "Please write some code first to debug." }));
      return;
    }

    try {
      setLoading(true);
      const data = await aiApi.debugCode({
        code,
        language,
        problemId: problem._id,
        slug: problem.slug,
        errorDetails:
          lastExecutionResult?.stderr ||
          lastExecutionResult?.compile_output ||
          (lastExecutionResult?.status !== "Accepted" ? lastExecutionResult?.status : ""),
        input: lastExecutionResult?.results?.[0]?.input || "",
        expectedOutput: lastExecutionResult?.results?.[0]?.expectedOutput || "",
        actualOutput: lastExecutionResult?.results?.[0]?.actualOutput || lastExecutionResult?.stdout || "",
      });
      setResponses((prev) => ({ ...prev, debug: data.debugAdvice }));
    } catch (err) {
      setResponses((prev) => ({
        ...prev,
        debug: `⚠️ Error analyzing code: ${err.message}`,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "hint", label: "Hint", icon: Lightbulb, handler: handleGetHint },
    { id: "explain", label: "Explain", icon: BookOpen, handler: handleExplainCode },
    { id: "debug", label: "Debug", icon: Bug, handler: handleDebugCode },
  ];

  const currentContent = responses[activeTab];

  return (
    <div className="flex flex-col h-full bg-[#0d0e14] border-t lg:border-t-0 lg:border-l border-white/[0.08] text-slate-200">
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#12141c]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-red-500 to-cyan-500 flex items-center justify-center p-1">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            BrainByte AI Assistant
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Tabs Bar */}
      <div className="grid grid-cols-3 p-2 gap-1.5 border-b border-white/[0.06] bg-[#0a0b0e]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (!responses[tab.id]) {
                  tab.handler();
                }
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.1]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isActive
                    ? tab.id === "hint"
                      ? "text-amber-400"
                      : tab.id === "explain"
                      ? "text-cyan-400"
                      : "text-red-400"
                    : "text-slate-400"
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase text-slate-500 tracking-wider">
            {activeTab === "hint"
              ? "Progressive Hint"
              : activeTab === "explain"
              ? "Code Explanation"
              : "Bug Analysis"}
          </span>

          <div className="flex items-center gap-2">
            {currentContent && (
              <button
                onClick={() => handleCopy(currentContent)}
                className="flex items-center gap-1 px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            )}

            <button
              onClick={() => {
                const currentTabObj = tabs.find((t) => t.id === activeTab);
                if (currentTabObj) currentTabObj.handler();
              }}
              disabled={loading}
              className="px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.1] text-[11px] text-slate-300 hover:text-white font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Generating..." : "Regenerate"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
            <p className="text-xs font-mono animate-pulse">BrainByte AI is thinking...</p>
          </div>
        ) : currentContent ? (
          <div className="p-4 rounded-xl bg-[#12141c] border border-white/[0.06] text-xs leading-relaxed text-slate-200 space-y-2 whitespace-pre-wrap font-sans">
            {currentContent}
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">
              Click{" "}
              <strong className="text-slate-200">
                {activeTab === "hint" ? "Hint" : activeTab === "explain" ? "Explain" : "Debug"}
              </strong>{" "}
              to generate contextual guidance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

