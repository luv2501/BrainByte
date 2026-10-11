import axios from "axios";

/**
 * Core AI Provider caller
 * Supports Google Gemini REST API, OpenAI-compatible APIs, and local fallback.
 */
async function callLLM(prompt, systemInstruction = "", fallbackContext = {}) {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
  const model = process.env.AI_MODEL || (provider === "openai" ? "gpt-3.5-turbo" : "gemini-1.5-flash");

  // Fallback / Mock mode when no API key is provided
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return generateFallbackResponse(prompt, systemInstruction, fallbackContext);
  }

  try {
    if (provider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: (systemInstruction ? `${systemInstruction}\n\n` : "") + prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        },
      };

      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      const candidate = response.data?.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;
      if (text) return text.trim();
      throw new Error("No text content returned from Gemini API");
    } else if (provider === "openai") {
      const baseUrl = process.env.AI_BASE_URL || "https://api.openai.com/v1";
      const response = await axios.post(
        `${baseUrl}/chat/completions`,
        {
          model,
          messages: [
            ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 1000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          timeout: 15000,
        }
      );

      return response.data?.choices?.[0]?.message?.content?.trim() || "";
    } else {
      throw new Error(`Unsupported AI provider: ${provider}`);
    }
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.warn(`[AI Service Warning] LLM call failed (${errorMsg}). Using fallback response.`);
    return generateFallbackResponse(prompt, systemInstruction, fallbackContext);
  }
}

/**
 * Intelligent deterministic fallback generator for testing & offline mode
 */
function generateFallbackResponse(prompt, systemInstruction, fallbackContext = {}) {
  const title = fallbackContext.problemTitle || "the problem";

  if (systemInstruction.includes("HINT_GENERATOR")) {
    return (
      `### Conceptual Hint for ${title}\n` +
      `1. **Identify the Core Pattern**: Consider whether storing previously visited state in a Hash Map, Set, or using two pointers can reduce time complexity.\n` +
      `2. **Check Constraints**: Check input size limits to determine if an O(n) or O(n log n) approach is required.\n` +
      `3. **Edge Cases**: Make sure your logic handles empty arrays, single elements, or boundary values appropriately.`
    );
  }

  if (systemInstruction.includes("CODE_EXPLAINER")) {
    return (
      `### Code Summary for ${title}\n` +
      `This solution implements an algorithmic approach to solve **${title}**.\n\n` +
      `### Step-by-Step Breakdown\n` +
      `- **Step 1**: Sets up initial data structures or state pointers.\n` +
      `- **Step 2**: Iterates through the input collection, applying the transformation or search condition.\n` +
      `- **Step 3**: Computes and returns the expected result.\n\n` +
      `### Complexity Analysis\n` +
      `- **Time Complexity**: \`O(n)\` - Single pass over the elements.\n` +
      `- **Space Complexity**: \`O(1)\` or \`O(n)\` auxiliary storage.`
    );
  }

  if (systemInstruction.includes("CODE_DEBUGGER")) {
    return (
      `### Potential Bug Analysis for ${title}\n` +
      `1. **Boundary / Off-by-One Condition**: Verify loop termination condition and array index boundaries.\n` +
      `2. **Edge Cases**: Check how the code behaves on minimal inputs or negative numbers.\n\n` +
      `### Suggested Fix\n` +
      `- Ensure variables are initialized properly.\n` +
      `- Verify index boundaries and return types before terminating.`
    );
  }

  return "AI Assistant response: Ensure your code handles base cases and optimal data structures.";
}

/**
 * Feature 1: Generate AI Hint without spoiling the solution
 */
export async function generateHint({
  problemId = null,
  problemSlug = null,
  problemTitle,
  description,
  difficulty,
  tags = [],
  constraints = [],
  examples = [],
  sampleTestCases = [],
  existingHints = [],
  currentCode,
  language = "javascript",
}) {
  const systemInstruction =
    "You are an expert algorithmic tutor named BrainByte AI (HINT_GENERATOR). " +
    "Your mission is to provide an intuitive, step-by-step hint for a coding problem WITHOUT giving away the complete solution or full code. " +
    "Focus on algorithmic intuition, data structures, and edge cases. Keep the response concise, formatted with clear markdown.";

  let prompt = `Problem: ${problemTitle || "Coding Problem"}\n`;
  if (difficulty) prompt += `Difficulty: ${difficulty}\n`;
  if (tags && tags.length > 0) prompt += `Tags: ${tags.join(", ")}\n`;
  if (description) prompt += `Description Summary:\n${description.slice(0, 800)}\n\n`;

  if (constraints && constraints.length > 0) {
    prompt += `Constraints:\n${constraints.map((c) => `- ${c}`).join("\n")}\n\n`;
  }

  if (examples && examples.length > 0) {
    prompt += `Sample Example:\nInput: ${examples[0].input}\nOutput: ${examples[0].output}\n\n`;
  }

  if (currentCode && currentCode.trim()) {
    prompt += `User's Current ${language || "code"}:\n\`\`\`${language || ""}\n${currentCode.slice(0, 1500)}\n\`\`\`\n\n`;
    prompt += "Guide the user based on where they might be stuck in their code.";
  } else {
    prompt += "Give a high-level conceptual hint to help the user get started.";
  }

  if (existingHints && existingHints.length > 0) {
    prompt += `\nExisting Hints: ${existingHints.join("; ")}`;
  }

  const hint = await callLLM(prompt, systemInstruction, { problemTitle, problemSlug });
  return {
    hint,
    problemId,
    problemSlug,
    problemTitle: problemTitle || null,
    difficulty: difficulty || null,
  };
}

/**
 * Feature 2: Explain Code in the context of the specific problem
 */
export async function explainCode({
  code,
  language = "javascript",
  problemId = null,
  problemSlug = null,
  problemTitle = "",
  description = "",
  constraints = [],
  difficulty = null,
}) {
  const systemInstruction =
    "You are an expert software engineer and technical educator named BrainByte AI (CODE_EXPLAINER). " +
    "Explain the provided code in clear, simple terms in the context of the problem. " +
    "Structure your response with:\n" +
    "1. Brief summary of what the code does and how it addresses the problem\n" +
    "2. Step-by-step logic breakdown\n" +
    "3. Time Complexity with Big-O notation (and whether it fits the problem constraints)\n" +
    "4. Space Complexity with Big-O notation";

  let prompt = `Language: ${language}\n`;
  if (problemTitle) prompt += `Problem Title: ${problemTitle}\n`;
  if (difficulty) prompt += `Difficulty: ${difficulty}\n`;
  if (description) prompt += `Problem Description Summary:\n${description.slice(0, 600)}\n`;
  if (constraints && constraints.length > 0) {
    prompt += `Constraints: ${constraints.join("; ")}\n`;
  }
  prompt += `\nCode to Explain:\n\`\`\`${language}\n${code.slice(0, 2000)}\n\`\`\``;

  const explanation = await callLLM(prompt, systemInstruction, { problemTitle, problemSlug });
  return {
    explanation,
    language,
    problemId,
    problemSlug,
    problemTitle: problemTitle || null,
  };
}

/**
 * Feature 3: Debug Code against the specific problem requirements
 */
export async function debugCode({
  code,
  language = "javascript",
  problemId = null,
  problemSlug = null,
  problemTitle = "",
  description = "",
  constraints = [],
  sampleTestCases = [],
  difficulty = null,
  errorDetails = "",
  input = "",
  expectedOutput = "",
  actualOutput = "",
}) {
  const systemInstruction =
    "You are an expert debugging assistant named BrainByte AI (CODE_DEBUGGER). " +
    "Your goal is to pinpoint likely bugs, off-by-one errors, edge-case failures, or runtime issues in the user's code against the specific problem. " +
    "Provide targeted suggestions on what needs fixing WITHOUT rewriting the entire program from scratch.";

  let prompt = `Language: ${language}\n`;
  if (problemTitle) prompt += `Problem Title: ${problemTitle}\n`;
  if (difficulty) prompt += `Difficulty: ${difficulty}\n`;
  if (description) prompt += `Problem Description Summary:\n${description.slice(0, 600)}\n`;
  if (constraints && constraints.length > 0) {
    prompt += `Constraints: ${constraints.join("; ")}\n`;
  }

  prompt += `\nSource Code:\n\`\`\`${language}\n${code.slice(0, 2000)}\n\`\`\`\n\n`;

  if (errorDetails) {
    prompt += `Runtime / Compiler Error Output:\n${errorDetails.slice(0, 600)}\n\n`;
  }
  if (input || expectedOutput || actualOutput) {
    prompt += `Failed Test Case Info:\n`;
    if (input) prompt += `Input: ${input.slice(0, 200)}\n`;
    if (expectedOutput) prompt += `Expected Output: ${expectedOutput.slice(0, 200)}\n`;
    if (actualOutput) prompt += `Actual Output: ${actualOutput.slice(0, 200)}\n`;
  }

  prompt += "Identify the issue and provide actionable advice to resolve it.";

  const debugAdvice = await callLLM(prompt, systemInstruction, { problemTitle, problemSlug });
  return {
    debugAdvice,
    language,
    problemId,
    problemSlug,
    problemTitle: problemTitle || null,
  };
}
