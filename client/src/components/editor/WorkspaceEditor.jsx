import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Code2,
  Terminal,
} from "lucide-react";

/**
 * Custom Monaco theme definition matching BrainByte Obsidian & Crimson design system
 */
const defineBrainByteTheme = (monaco) => {
  monaco.editor.defineTheme("brainbyte-obsidian", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "64748b", fontStyle: "italic" },
      { token: "keyword", foreground: "f87171", fontStyle: "bold" },
      { token: "identifier", foreground: "e2e8f0" },
      { token: "string", foreground: "34d399" },
      { token: "number", foreground: "fbbf24" },
      { token: "type", foreground: "38bdf8" },
      { token: "delimiter", foreground: "94a3b8" },
      { token: "operator", foreground: "f43f5e" },
      { token: "function", foreground: "60a5fa" },
    ],
    colors: {
      "editor.background": "#0a0b10",
      "editor.foreground": "#e2e8f0",
      "editorLineNumber.foreground": "#475569",
      "editorLineNumber.activeForeground": "#f87171",
      "editor.lineHighlightBackground": "#131622",
      "editor.selectionBackground": "#33415577",
      "editor.inactiveSelectionBackground": "#1e293b66",
      "editorCursor.foreground": "#ff4b4b",
      "editorWhitespace.foreground": "#334155",
      "editorIndentGuide.background1": "#1e293b",
      "editorIndentGuide.activeBackground1": "#ef444455",
      "editorGutter.background": "#0a0b10",
      "scrollbarSlider.background": "#ffffff15",
      "scrollbarSlider.hoverBackground": "#ffffff25",
      "scrollbarSlider.activeBackground": "#ffffff40",
    },
  });
};

export default function WorkspaceEditor({
  language = "javascript",
  code = "",
  onChange,
  onResetCode,
  isMaximized = false,
  onToggleMaximize,
}) {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("brainbyte_editor_fontsize");
    return saved ? parseInt(saved, 10) : 14;
  });
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    defineBrainByteTheme(monaco);
    monaco.editor.setTheme("brainbyte-obsidian");

    // Force layout update once mounted
    setTimeout(() => {
      editor.layout();
    }, 50);
  };

  const handleFontSizeChange = (delta) => {
    setFontSize((prev) => {
      const next = Math.min(24, Math.max(11, prev + delta));
      localStorage.setItem("brainbyte_editor_fontsize", String(next));
      return next;
    });
  };

  const handleCopyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Failed to copy code to clipboard", e);
    }
  };

  // Keep Monaco layout in sync when window or panels resize
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  }, [fontSize, isMaximized]);

  const fileExtensionMap = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    cpp: "cpp",
    c: "c",
    java: "java",
  };

  const ext = fileExtensionMap[language] || "txt";

  return (
    <div className="flex-1 flex flex-col bg-[#0a0b10] min-h-0 overflow-hidden relative border-b border-white/[0.06]">
      {/* Professional Editor Toolbar */}
      <div className="h-9 px-3 border-b border-white/[0.06] bg-[#0e1017] flex items-center justify-between shrink-0 select-none">
        {/* Left: File indicator & Language icon */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            <span className="font-semibold text-slate-200">solution.{ext}</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider hidden sm:inline">
            {language}
          </span>
        </div>

        {/* Right: Controls (Font +/- , Copy, Reset, Maximize) */}
        <div className="flex items-center gap-1">
          {/* Font Controls */}
          <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-md px-1 py-0.5 mr-1">
            <button
              onClick={() => handleFontSizeChange(-1)}
              title="Decrease font size"
              disabled={fontSize <= 11}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-medium text-slate-300 px-1.5 min-w-[32px] text-center">
              {fontSize}px
            </span>
            <button
              onClick={() => handleFontSizeChange(1)}
              title="Increase font size"
              disabled={fontSize >= 24}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Copy code button */}
          <button
            onClick={handleCopyCode}
            title="Copy code"
            className="p-1.5 rounded-md hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Reset template button */}
          {onResetCode && (
            <button
              onClick={onResetCode}
              title="Reset code template"
              className="p-1.5 rounded-md hover:bg-white/[0.06] text-slate-400 hover:text-amber-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Maximize / restore editor */}
          {onToggleMaximize && (
            <button
              onClick={onToggleMaximize}
              title={isMaximized ? "Restore layout" : "Maximize editor"}
              className={`p-1.5 rounded-md transition-colors ${
                isMaximized
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "hover:bg-white/[0.06] text-slate-400 hover:text-slate-200"
              }`}
            >
              {isMaximized ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 w-full h-full relative overflow-hidden min-h-0">
        <Editor
          height="100%"
          width="100%"
          language={
            language === "cpp"
              ? "cpp"
              : language === "java"
              ? "java"
              : language === "python"
              ? "python"
              : language === "typescript"
              ? "typescript"
              : language === "c"
              ? "c"
              : "javascript"
          }
          theme="vs-dark"
          value={code}
          onChange={(val) => onChange && onChange(val || "")}
          onMount={handleEditorDidMount}
          options={{
            fontSize: fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            roundedSelection: true,
            padding: { top: 12, bottom: 12 },
            automaticLayout: true,
            tabSize: 2,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            renderLineHighlight: "all",
            overviewRulerBorder: false,
            bracketPairColorization: { enabled: true },
            wordWrap: "off",
          }}
        />
      </div>
    </div>
  );
}
