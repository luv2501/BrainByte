import apiClient from "./client.js";

export const aiApi = {
  getHint: async ({ problemId, slug, currentCode, language }) => {
    const response = await apiClient.post("/ai/hint", {
      problemId,
      slug,
      currentCode,
      language,
    });
    return response.data;
  },

  explainCode: async ({ code, language, problemId, slug, problemTitle }) => {
    const response = await apiClient.post("/ai/explain", {
      code,
      language,
      problemId,
      slug,
      problemTitle,
    });
    return response.data;
  },

  debugCode: async ({
    code,
    language,
    problemId,
    slug,
    errorDetails,
    input,
    expectedOutput,
    actualOutput,
  }) => {
    const response = await apiClient.post("/ai/debug", {
      code,
      language,
      problemId,
      slug,
      errorDetails,
      input,
      expectedOutput,
      actualOutput,
    });
    return response.data;
  },
};

