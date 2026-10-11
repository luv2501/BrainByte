import mongoose from "mongoose";
import Problem from "../models/Problem.js";
import { generateHint, explainCode, debugCode } from "../services/aiService.js";

/**
 * Helper to fetch and sanitize problem context from MongoDB.
 * Strictly excludes all hidden test cases to protect grading integrity.
 */
async function resolveProblemContext(identifier) {
  if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
    return null;
  }

  const trimmed = identifier.trim();
  let query;
  if (mongoose.Types.ObjectId.isValid(trimmed)) {
    query = { _id: trimmed };
  } else {
    query = { slug: trimmed.toLowerCase() };
  }

  const problem = await Problem.findOne(query);
  if (!problem) {
    return null;
  }

  return {
    problemId: problem._id,
    problemSlug: problem.slug,
    problemTitle: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
    tags: problem.tags || [],
    constraints: problem.constraints || [],
    examples: problem.examples || [],
    existingHints: problem.hints || [],
    sampleTestCases: (problem.testCases || [])
      .filter((tc) => !tc.isHidden)
      .map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      })),
  };
}

// @route POST /api/ai/hint
// @desc  Get a contextual AI hint for a problem without spoiling the full solution
// @access Private (Protected)
export const getAIHint = async (req, res, next) => {
  try {
    const {
      problemId,
      slug,
      problemTitle,
      description,
      difficulty,
      currentCode,
      language = "javascript",
      tags,
      constraints,
      examples,
    } = req.body;

    const identifier = problemId || slug;
    let problemContext = null;

    if (identifier) {
      problemContext = await resolveProblemContext(identifier);
      if (!problemContext) {
        return res.status(404).json({ message: "Problem not found" });
      }
    }

    const finalTitle = problemContext?.problemTitle || problemTitle;
    const finalDescription = problemContext?.description || description;
    const finalDifficulty = problemContext?.difficulty || difficulty;
    const finalTags = problemContext?.tags || tags || [];
    const finalConstraints = problemContext?.constraints || constraints || [];
    const finalExamples = problemContext?.examples || examples || [];
    const existingHints = problemContext?.existingHints || [];
    const sampleTestCases = problemContext?.sampleTestCases || [];

    if (!finalTitle && !finalDescription && !currentCode) {
      return res.status(400).json({
        message:
          "Please provide problem information (problemId, slug, title, description) or current code to receive a hint.",
      });
    }

    const result = await generateHint({
      problemId: problemContext?.problemId || null,
      problemSlug: problemContext?.problemSlug || null,
      problemTitle: finalTitle,
      description: finalDescription,
      difficulty: finalDifficulty,
      tags: finalTags,
      constraints: finalConstraints,
      examples: finalExamples,
      sampleTestCases,
      existingHints,
      currentCode,
      language,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @route POST /api/ai/explain
// @desc  Explain code in plain English in the context of the problem with logic breakdown and Time/Space complexity
// @access Private (Protected)
export const getCodeExplanation = async (req, res, next) => {
  try {
    const {
      code,
      language = "javascript",
      problemId,
      slug,
      problemTitle,
      description,
      constraints,
    } = req.body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ message: "Code is required for explanation" });
    }

    const identifier = problemId || slug;
    let problemContext = null;

    if (identifier) {
      problemContext = await resolveProblemContext(identifier);
      if (!problemContext) {
        return res.status(404).json({ message: "Problem not found" });
      }
    }

    const finalTitle = problemContext?.problemTitle || problemTitle || "";
    const finalDescription = problemContext?.description || description || "";
    const finalConstraints = problemContext?.constraints || constraints || [];

    const result = await explainCode({
      code,
      language,
      problemId: problemContext?.problemId || null,
      problemSlug: problemContext?.problemSlug || null,
      problemTitle: finalTitle,
      description: finalDescription,
      constraints: finalConstraints,
      difficulty: problemContext?.difficulty || null,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @route POST /api/ai/debug
// @desc  Identify potential bugs in code against the problem requirements and suggest targeted fixes
// @access Private (Protected)
export const getDebugAdvice = async (req, res, next) => {
  try {
    const {
      code,
      language = "javascript",
      problemId,
      slug,
      problemTitle,
      description,
      constraints,
      errorDetails,
      input,
      expectedOutput,
      actualOutput,
    } = req.body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ message: "Code is required for debugging" });
    }

    const identifier = problemId || slug;
    let problemContext = null;

    if (identifier) {
      problemContext = await resolveProblemContext(identifier);
      if (!problemContext) {
        return res.status(404).json({ message: "Problem not found" });
      }
    }

    const finalTitle = problemContext?.problemTitle || problemTitle || "";
    const finalDescription = problemContext?.description || description || "";
    const finalConstraints = problemContext?.constraints || constraints || [];
    const sampleTestCases = problemContext?.sampleTestCases || [];

    const result = await debugCode({
      code,
      language,
      problemId: problemContext?.problemId || null,
      problemSlug: problemContext?.problemSlug || null,
      problemTitle: finalTitle,
      description: finalDescription,
      constraints: finalConstraints,
      sampleTestCases,
      difficulty: problemContext?.difficulty || null,
      errorDetails,
      input,
      expectedOutput,
      actualOutput,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};
