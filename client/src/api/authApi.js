import apiClient from "./client.js";

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await apiClient.post("/auth/register", { username, email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  googleAuth: async (access_token) => {
    const response = await apiClient.post("/auth/google", { access_token });
    return response.data;
  },
  githubAuth: async (access_token) => {
    const response = await apiClient.post("/auth/github", { access_token });
    return response.data;
  },
};

