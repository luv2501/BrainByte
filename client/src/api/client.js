import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "";
const API_BASE_URL = rawBase ? `${rawBase.replace(/\/api\/?$/, "").replace(/\/$/, "")}/api` : "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Attach JWT token from localStorage to outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("brainbyte_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor to handle user-friendly errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message extraction
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === "ECONNABORTED"
        ? "Request timed out. Please try again."
        : "An unexpected error occurred. Please try again.");

    // Handle token expiration
    if (error.response?.status === 401 && !window.location.pathname.includes("/login")) {
      localStorage.removeItem("brainbyte_token");
      localStorage.removeItem("brainbyte_user");
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;

