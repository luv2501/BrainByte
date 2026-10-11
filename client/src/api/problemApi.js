import apiClient from "./client.js";

export const problemApi = {
  getProblems: async (params = {}) => {
    const response = await apiClient.get("/problems", { params });
    return response.data;
  },

  getProblemBySlug: async (slug) => {
    const response = await apiClient.get(`/problems/${slug}`);
    return response.data;
  },
};

