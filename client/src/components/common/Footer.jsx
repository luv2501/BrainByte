import React from "react";
import { Github, Linkedin, Instagram, Globe } from "lucide-react";

export default function Footer({ className = "" }) {
  return (
    <footer className={`w-full border-t border-white/[0.06] bg-[#08090c]/90 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left branding */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} BrainByte.</span>
          <span className="text-slate-400 font-mono font-medium">Built Different.</span>
          <span className="hidden md:inline text-slate-600">&bull;</span>
          <span className="hidden md:inline text-slate-400">Code. Create. Conquer.</span>
        </div>

        {/* Right links & socials */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-slate-200 transition-colors cursor-pointer">About</span>
            <span className="hover:text-slate-200 transition-colors cursor-pointer">Contact</span>
            <span className="hover:text-slate-200 transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-slate-200 transition-colors cursor-pointer">Terms</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 pl-4 border-l border-white/[0.08]">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors p-1"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors p-1"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors p-1"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

