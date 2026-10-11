import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("brainbyte_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("brainbyte_token"));
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const freshUser = await authApi.getMe();
          setUser(freshUser);
          localStorage.setItem("brainbyte_user", JSON.stringify(freshUser));
        } catch (err) {
          console.warn("Session expired or invalid:", err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    // Backend returns a flat object: { _id, username, email, token, xp, streak, ... }
    const { token: receivedToken, ...userFields } = data;
    setToken(receivedToken);
    setUser(userFields);
    localStorage.setItem("brainbyte_token", receivedToken);
    localStorage.setItem("brainbyte_user", JSON.stringify(userFields));
    return data;
  };

  const loginWithGoogle = async (access_token) => {
    const data = await authApi.googleAuth(access_token);
    const { token: receivedToken, ...userFields } = data;
    setToken(receivedToken);
    setUser(userFields);
    localStorage.setItem("brainbyte_token", receivedToken);
    localStorage.setItem("brainbyte_user", JSON.stringify(userFields));
    return data;
  };

  /**
   * Called by GitHubSuccessPage after the server-side redirect flow.
   * The backend already verified the GitHub token; we receive the final
   * BrainByte JWT and user object directly — no extra API call needed.
   */
  const loginWithGitHub = (receivedToken, userFields) => {
    setToken(receivedToken);
    setUser(userFields);
    localStorage.setItem("brainbyte_token", receivedToken);
    localStorage.setItem("brainbyte_user", JSON.stringify(userFields));
  };

  const register = async (username, email, password) => {
    const data = await authApi.register(username, email, password);
    // Backend returns a flat object: { _id, username, email, token, xp, streak, ... }
    const { token: receivedToken, ...userFields } = data;
    setToken(receivedToken);
    setUser(userFields);
    localStorage.setItem("brainbyte_token", receivedToken);
    localStorage.setItem("brainbyte_user", JSON.stringify(userFields));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("brainbyte_token");
    localStorage.removeItem("brainbyte_user");
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const freshUser = await authApi.getMe();
      setUser(freshUser);
      localStorage.setItem("brainbyte_user", JSON.stringify(freshUser));
    } catch (err) {
      console.error("Failed to refresh user:", err.message);
    }
  };

  const updateUserStats = (newStats) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...newStats };
      localStorage.setItem("brainbyte_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        loginWithGoogle,
        loginWithGitHub,
        register,
        logout,
        refreshUser,
        updateUserStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

