import mongoose from "mongoose";
import Problem from "../models/Problem.js";
import User from "../models/User.js";

// Helper function to generate URL-safe slugs
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

// @route POST /api/problems
// @desc  Create a new coding problem
// @access Private (Protected)
export const createProblem = async (req, res, next) => {
  try {
    const {
      title,
      slug: customSlug,
      description,
      difficulty,
      tags = [],
      constraints = [],
      examples = [],
      starterCode = {},
      testCases = [],
      hints = [],
    } = req.body;

    if (!title || !description || !difficulty) {
      return res.status(400).json({
        message: "Title, description, and difficulty are required",
      });
    }

    const validDifficulties = ["Easy", "Medium", "Hard"];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        message: "Difficulty must be one of: Easy, Medium, Hard",
      });
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({
        message: "At least one test case is required",
      });
    }

    const finalSlug = customSlug ? slugify(customSlug) : slugify(title);
    if (!finalSlug) {
      return res.status(400).json({
        message: "Unable to generate a valid slug from the title",
      });
    }

    // Check if slug already exists
    const existingProblem = await Problem.findOne({ slug: finalSlug });
    if (existingProblem) {
      return res.status(400).json({
        message: `A problem with slug '${finalSlug}' already exists`,
      });
    }

    // Normalize constraints if passed as a single string
    const normalizedConstraints = Array.isArray(constraints)
      ? constraints
      : typeof constraints === "string" && constraints.trim()
      ? [constraints.trim()]
      : [];

    const problem = await Problem.create({
      title: title.trim(),
      slug: finalSlug,
      description: description.trim(),
      difficulty,
      tags: Array.isArray(tags) ? tags.map((t) => t.trim()).filter(Boolean) : [],
      constraints: normalizedConstraints,
      examples: Array.isArray(examples) ? examples : [],
      starterCode: {
        javascript: starterCode.javascript || "",
        python: starterCode.python || "",
        cpp: starterCode.cpp || "",
        c: starterCode.c || "",
        java: starterCode.java || "",
        typescript: starterCode.typescript || "",
      },
      testCases,
      hints: Array.isArray(hints) ? hints.map((h) => h.trim()).filter(Boolean) : [],
      createdBy: req.user?._id || null,
    });

    res.status(201).json(problem);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/problems?difficulty=Easy&tag=Array&search=two+sum&page=1&limit=20
// @desc  Get all problems with optional filters and pagination (excluding hidden test cases)
// @access Public
export const getProblems = async (req, res, next) => {
  try {
    const { difficulty, tag, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (tag) {
      filter.tags = tag;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [problems, total] = await Promise.all([
      Problem.find(filter)
        .select("title slug difficulty tags createdAt")
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limitNum),
      Problem.countDocuments(filter),
    ]);

    res.json({
      problems,
      total,
      totalPages: Math.ceil(total / limitNum),
      page: pageNum,
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/problems/:identifier (identifier can be slug or MongoDB ObjectId)
// @desc  Get a single problem by ID or slug (hides secret grading test cases)
// @access Public
export const getProblemByIdOrSlug = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    let query;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { _id: identifier };
    } else {
      query = { slug: identifier.toLowerCase().trim() };
    }

    const problem = await Problem.findOne(query);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const problemObj = problem.toObject();

    // Filter out hidden test cases so users cannot see grading-only inputs/outputs
    const visibleTestCases = (problemObj.testCases || []).filter(
      (tc) => !tc.isHidden
    );

    res.json({
      ...problemObj,
      testCases: visibleTestCases,
    });
  } catch (error) {
    next(error);
  }
};

// Backward-compatible alias for getProblemByIdOrSlug
export const getProblemBySlug = getProblemByIdOrSlug;

// @route PUT /api/problems/:id or /api/problems/:identifier
// @desc  Update an existing problem
// @access Private (Protected)
export const updateProblem = async (req, res, next) => {
  try {
    const id = req.params.identifier || req.params.id;

    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { slug: id.toLowerCase().trim() };
    }

    const problem = await Problem.findOne(query);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const {
      title,
      slug: customSlug,
      description,
      difficulty,
      tags,
      constraints,
      examples,
      starterCode,
      testCases,
      hints,
    } = req.body;

    if (title !== undefined) problem.title = title.trim();
    if (description !== undefined) problem.description = description.trim();
    if (difficulty !== undefined) {
      const validDifficulties = ["Easy", "Medium", "Hard"];
      if (!validDifficulties.includes(difficulty)) {
        return res.status(400).json({
          message: "Difficulty must be one of: Easy, Medium, Hard",
        });
      }
      problem.difficulty = difficulty;
    }

    if (customSlug) {
      const newSlug = slugify(customSlug);
      if (newSlug !== problem.slug) {
        const existing = await Problem.findOne({ slug: newSlug, _id: { $ne: problem._id } });
        if (existing) {
          return res.status(400).json({
            message: `A problem with slug '${newSlug}' already exists`,
          });
        }
        problem.slug = newSlug;
      }
    }

    if (tags !== undefined) {
      problem.tags = Array.isArray(tags) ? tags.map((t) => t.trim()).filter(Boolean) : [];
    }

    if (constraints !== undefined) {
      problem.constraints = Array.isArray(constraints)
        ? constraints
        : typeof constraints === "string" && constraints.trim()
        ? [constraints.trim()]
        : [];
    }

    if (examples !== undefined) {
      problem.examples = Array.isArray(examples) ? examples : [];
    }

    if (starterCode !== undefined) {
      problem.starterCode = {
        javascript: starterCode.javascript ?? problem.starterCode?.javascript ?? "",
        python: starterCode.python ?? problem.starterCode?.python ?? "",
        cpp: starterCode.cpp ?? problem.starterCode?.cpp ?? "",
        c: starterCode.c ?? problem.starterCode?.c ?? "",
        java: starterCode.java ?? problem.starterCode?.java ?? "",
        typescript: starterCode.typescript ?? problem.starterCode?.typescript ?? "",
      };
    }

    if (testCases !== undefined) {
      if (!Array.isArray(testCases) || testCases.length === 0) {
        return res.status(400).json({
          message: "At least one test case is required",
        });
      }
      problem.testCases = testCases;
    }

    if (hints !== undefined) {
      problem.hints = Array.isArray(hints) ? hints.map((h) => h.trim()).filter(Boolean) : [];
    }

    await problem.save();
    res.json(problem);
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/problems/:id or /api/problems/:identifier
// @desc  Delete a problem
// @access Private (Protected)
export const deleteProblem = async (req, res, next) => {
  try {
    const id = req.params.identifier || req.params.id;

    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { slug: id.toLowerCase().trim() };
    }

    const problem = await Problem.findOneAndDelete(query);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json({
      message: "Problem deleted successfully",
      id: problem._id,
      slug: problem.slug,
    });
  } catch (error) {
    next(error);
  }
};


// @route POST /api/problems/:id/save (toggle save/unsave)
// @desc  Bookmark or unbookmark a problem for current user
// @access Private (Protected)
export const toggleSaveProblem = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const problemId = req.params.id;

    const alreadySaved = user.savedProblems.some(
      (id) => id.toString() === problemId
    );

    if (alreadySaved) {
      user.savedProblems = user.savedProblems.filter(
        (id) => id.toString() !== problemId
      );
    } else {
      user.savedProblems.push(problemId);
    }

    await user.save();
    res.json({ savedProblems: user.savedProblems, saved: !alreadySaved });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/problems/saved/me
// @desc  Get bookmarked problems for current user
// @access Private (Protected)
export const getSavedProblems = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "savedProblems",
      "title slug difficulty tags"
    );
    res.json(user.savedProblems);
  } catch (error) {
    next(error);
  }
};
