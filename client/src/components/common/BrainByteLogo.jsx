import React from "react";
import { Link } from "react-router-dom";

export default function BrainByteLogo({
  size = "md",
  showSubtitle = true,
  showTagline = false,
  clickable = true,
  className = "",
}) {
  const sizeMap = {
    sm: { icon: "w-7 h-7", text: "text-lg", subtitle: "text-[9px]" },
    md: { icon: "w-10 h-10", text: "text-2xl", subtitle: "text-[10px]" },
    lg: { icon: "w-16 h-16", text: "text-4xl", subtitle: "text-xs tracking-[0.3em]" },
    xl: { icon: "w-24 h-24", text: "text-5xl", subtitle: "text-sm tracking-[0.4em]" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`flex flex-col items-start select-none ${className}`}>
      <div className="flex items-center gap-3">
        {/* SVG Brain Emblem */}
        <div className={`relative ${currentSize.icon} flex items-center justify-center`}>
          <img
            src="/assets/brainbyte-logo.svg"
            alt="BrainByte Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(239,68,68,0.35)]"
          />
        </div>

        {/* Brand Text */}
        <div className="flex flex-col">
          <div className={`font-extrabold tracking-tight ${currentSize.text} leading-none flex items-center`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400">
              Brain
            </span>
            <span className="text-[#ff3b3b] drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              Byte
            </span>
          </div>

          {showSubtitle && (
            <span
              className={`text-slate-400 font-mono uppercase tracking-[0.25em] ${currentSize.subtitle} mt-1 font-semibold opacity-90`}
            >
              Built Different
            </span>
          )}
        </div>
      </div>

      {showTagline && (
        <div className="mt-4 flex items-center gap-2 font-mono text-sm tracking-wider">
          <span className="text-white font-medium">Code.</span>
          <span className="text-[#ff3b3b] font-medium">Create.</span>
          <span className="text-[#06b6d4] font-medium">Conquer.</span>
        </div>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" className="inline-block transition-transform hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
}

