import apiClient from "./client.js";

export const submissionApi = {
  // Quick test execution against sample cases (zero DB writes)
  runCode: async ({ code, language, problemId, slug, input }) => {
    const response = await apiClient.post("/submissions/run", {
      code,
      language,
      problemId,
      slug,
      input,
    });
    return response.data;
  },

  // Final submission against ALL test cases (saves to MongoDB, awards XP & streak)
  submitCode: async ({ code, language, problemId, slug }) => {
    const response = await apiClient.post("/submissions/submit", {
      code,
      language,
      problemId,
      slug,
    });
    return response.data;
  },

  // User's private submission history
  getMySubmissions: async (params = {}) => {
    const response = await apiClient.get("/submissions/me", { params });
    return response.data;
  },

  // Single submission details (owner only)
  getSubmissionById: async (id) => {
    const response = await apiClient.get(`/submissions/${id}`);
    return response.data;
  },

  // User progress stats (total submissions, problems solved by difficulty, xp, streak)
  getUserStats: async () => {
    const response = await apiClient.get("/submissions/stats/me");
    return response.data;
  },
};

