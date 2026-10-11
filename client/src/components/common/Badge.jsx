import React from "react";

export function DifficultyBadge({ difficulty, size = "md", className = "" }) {
  const styles = {
    Easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
    Hard: "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.15)]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  };

  const currentStyle = styles[difficulty] || styles.Easy;
  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${currentStyle} ${currentSize} ${className}`}
    >
      {difficulty}
    </span>
  );
}

export function VerdictBadge({ verdict, className = "" }) {
  const styles = {
    Accepted: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    "Wrong Answer": "bg-red-500/15 text-red-400 border-red-500/30",
    "Time Limit Exceeded": "bg-amber-500/15 text-amber-400 border-amber-500/30",
    "Runtime Error": "bg-purple-500/15 text-purple-400 border-purple-500/30",
    "Compilation Error": "bg-orange-500/15 text-orange-400 border-orange-500/30",
    Pending: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  };

  const currentStyle = styles[verdict] || styles.Pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle} ${className}`}
    >
      {verdict}
    </span>
  );
}

export function TagBadge({ tag, onClick, active = false, className = "" }) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
        onClick ? "cursor-pointer" : ""
      } ${
        active
          ? "bg-white/[0.15] text-white border-white/30"
          : "bg-white/[0.03] text-slate-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-slate-200"
      } ${className}`}
    >
      {tag}
    </span>
  );
}

