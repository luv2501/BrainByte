import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import BrainByteLogo from "./BrainByteLogo.jsx";
import {
  Flame,
  Zap,
  LogOut,
  User,
  Menu,
  X,
  Code2,
  FileCheck2,
  TrendingUp,
} from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Problems", path: "/problems", icon: Code2 },
    { name: "Submissions", path: "/submissions", icon: FileCheck2 },
    { name: "Progress", path: "/progress", icon: TrendingUp },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#08090c]/80 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <BrainByteLogo size="sm" showSubtitle={false} />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                location.pathname === link.path ||
                (link.path === "/problems" && location.pathname.startsWith("/problems/"));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-white bg-white/[0.08] shadow-[0_0_12px_rgba(255,255,255,0.05)] border border-white/[0.12]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#ff3b3b]" : "text-slate-400"}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Auth / Stats / Profile */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Streak Badge */}
              <div
                title="Daily Streak"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold select-none shadow-sm"
              >
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
                <span>{user?.streak || 0}</span>
                <span className="text-[10px] text-orange-400/70 uppercase">days</span>
              </div>

              {/* XP Badge */}
              <div
                title="Earned XP"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold select-none shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{user?.xp || 0}</span>
                <span className="text-[10px] text-amber-400/70 uppercase">XP</span>
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/[0.08]"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 border border-white/[0.15] flex items-center justify-center text-sm font-bold text-white shadow-inner">
                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-slate-200 max-w-[120px] truncate">
                    {user?.username}
                  </span>
                </button>

                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#12141a] border border-white/[0.1] shadow-2xl p-2 z-50 backdrop-blur-2xl">
                      <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/progress"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        <span>My Progress</span>
                      </Link>

                      <Link
                        to="/submissions"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <FileCheck2 className="w-4 h-4 text-slate-400" />
                        <span>My Submissions</span>
                      </Link>

                      <div className="my-1 border-t border-white/[0.06]" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#e13b3b] to-[#b91c1c] hover:from-[#f04b4b] hover:to-[#dc2626] transition-all shadow-[0_0_15px_rgba(225,59,59,0.35)] border border-red-500/30"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          {isAuthenticated && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{user?.xp || 0}</span>
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-[#0d0e12]/95 backdrop-blur-2xl border-b border-white/[0.1] space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "text-white bg-white/[0.08] border border-white/[0.12]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#ff3b3b]" : "text-slate-400"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-white/[0.08] space-y-2">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-xs text-slate-400">
                  Signed in as <span className="font-semibold text-white">{user?.username}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 bg-red-500/10 hover:bg-red-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-lg text-sm font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.08]"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

