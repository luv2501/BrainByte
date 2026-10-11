import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ProblemsPage from "./pages/ProblemsPage.jsx";
import WorkspacePage from "./pages/WorkspacePage.jsx";
import SubmissionsPage from "./pages/SubmissionsPage.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import GitHubSuccessPage from "./pages/GitHubSuccessPage.jsx";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/github/success" element={<GitHubSuccessPage />} />

            {/* Protected Application Routes */}
            <Route
              path="/"
              element={<Navigate to="/problems" replace />}
            />
            <Route
              path="/problems"
              element={
                <ProtectedRoute>
                  <ProblemsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/problems/:slug"
              element={
                <ProtectedRoute>
                  <WorkspacePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submissions"
              element={
                <ProtectedRoute>
                  <SubmissionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <ProgressPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/problems" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

