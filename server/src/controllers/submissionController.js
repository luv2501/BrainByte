import mongoose from "mongoose";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";
import { runCode, evaluateSubmission } from "../services/jdoodleService.js";

// @route POST /api/submissions/run
// @desc  Quick transient code execution (no permanent DB save)
// @access Private (Protected)
export const runAgainstInput = async (req, res, next) => {
  try {
    const { code, language, input, problemId, slug } = req.body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ message: "Code is required" });
    }

    if (!language || typeof language !== "string" || !language.trim()) {
      return res.status(400).json({ message: "Language is required" });
    }

    // If problemId or slug is specified, evaluate against visible sample test cases only
    if (problemId || slug) {
      const identifier = problemId || slug;
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

      const visibleTestCases = problem.testCases.filter((tc) => !tc.isHidden);
      if (visibleTestCases.length === 0) {
        return res.status(400).json({ message: "No visible sample test cases found for this problem" });
      }

      const evaluation = await evaluateSubmission(code, language, visibleTestCases);

      if (evaluation.verdict === "Execution Provider Error") {
        return res.status(502).json({
          message: "Code execution provider (JDoodle) is unavailable or returned an error.",
          status: "Execution Provider Error",
          error: evaluation.providerError || "Execution provider failure",
          evaluation,
        });
      }

      return res.json({
        problemId: problem._id,
        problemSlug: problem.slug,
        ...evaluation,
      });
    }

    // Run against custom input string
    const result = await runCode(code, language, input ?? "");

    if (result.status === "Execution Provider Error") {
      return res.status(502).json({
        message: "Code execution provider (JDoodle) is unavailable or returned an error.",
        status: "Execution Provider Error",
        error: result.stderr || "Execution provider failure",
        result,
      });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @route POST /api/submissions/submit or POST /api/submissions/:problemId
// @desc  Final submission: evaluates all test cases (including hidden), saves to MongoDB, awards XP & tracks solved status
// @access Private (Protected)
export const submitSolution = async (req, res, next) => {
  try {
    const { code, language, problemId: bodyProblemId, slug } = req.body;
    const paramProblemId = req.params.problemId;
    const identifier = paramProblemId || bodyProblemId || slug;

    if (!identifier) {
      return res.status(400).json({ message: "Problem ID or slug is required for submission" });
    }

    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ message: "Code is required" });
    }

    if (!language || typeof language !== "string" || !language.trim()) {
      return res.status(400).json({ message: "Language is required" });
    }

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

    // Run evaluation across ALL test cases (including hidden cases)
    const evaluation = await evaluateSubmission(code, language, problem.testCases);

    // If the execution provider failed, return 502 Bad Gateway without saving a submission record
    // or awarding XP/streak
    if (evaluation.verdict === "Execution Provider Error") {
      return res.status(502).json({
        message: "Code execution provider (JDoodle) is unavailable or returned an error.",
        status: "Execution Provider Error",
        error: evaluation.providerError || "Execution provider failure",
        evaluation,
      });
    }

    const runtimeMs = evaluation.totalTime
      ? Math.round(parseFloat(evaluation.totalTime) * 1000)
      : null;

    // Save submission permanently in database
    const submission = await Submission.create({
      user: req.user._id,
      problem: problem._id,
      language: language.toLowerCase().trim(),
      code,
      verdict: evaluation.verdict,
      passedTestCases: evaluation.passedTests,
      totalTestCases: evaluation.totalTests,
      runtimeMs,
    });

    let firstTimeSolved = false;
    let xpAwarded = 0;

    // Track solved problem and award XP only on first-time Accepted
    if (evaluation.verdict === "Accepted") {
      const priorAccepted = await Submission.findOne({
        user: req.user._id,
        problem: problem._id,
        verdict: "Accepted",
        _id: { $ne: submission._id },
      });

      if (!priorAccepted) {
        firstTimeSolved = true;
        const xpMap = { Easy: 10, Medium: 20, Hard: 30 };
        xpAwarded = xpMap[problem.difficulty] || 10;

        const user = await User.findById(req.user._id);
        if (user) {
          user.xp = (user.xp || 0) + xpAwarded;

          // Add to solvedProblems array if not present
          if (!user.solvedProblems) user.solvedProblems = [];
          if (!user.solvedProblems.some((id) => id.toString() === problem._id.toString())) {
            user.solvedProblems.push(problem._id);
          }

          // Update streak
          const today = new Date().toDateString();
          const lastSolved = user.lastSolvedDate ? user.lastSolvedDate.toDateString() : null;
          if (lastSolved !== today) {
            user.streak = (user.streak || 0) + 1;
            user.lastSolvedDate = new Date();
          }

          await user.save();
        }
      }
    }

    res.status(201).json({
      submission,
      evaluation,
      firstTimeSolved,
      xpAwarded,
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/submissions/me?problemId=...&slug=...
// @desc  Get submission history for the authenticated user
// @access Private (Protected)
export const getMySubmissions = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.problemId) {
      filter.problem = req.query.problemId;
    } else if (req.query.slug) {
      const problem = await Problem.findOne({ slug: req.query.slug.toLowerCase().trim() });
      if (problem) {
        filter.problem = problem._id;
      } else {
        return res.json([]);
      }
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const submissions = await Submission.find(filter)
      .populate("problem", "title slug difficulty tags")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/submissions/:id
// @desc  Get details for a single submission (authenticated user can only view their own)
// @access Private (Protected)
export const getSubmissionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid submission ID" });
    }

    const submission = await Submission.findById(id).populate(
      "problem",
      "title slug difficulty tags"
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Security check: Verify submission belongs to the requesting user
    if (submission.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You cannot access another user's submission" });
    }

    res.json(submission);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/submissions/stats/me or /api/submissions/me/stats
// @desc  Get user progress statistics (total submissions, problems solved by difficulty, xp, streak)
// @access Private (Protected)
export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Total submissions count
    const totalSubmissions = await Submission.countDocuments({ user: userId });

    // Accepted submissions count
    const acceptedSubmissions = await Submission.countDocuments({
      user: userId,
      verdict: "Accepted",
    });

    // Distinct problems solved by the user
    const solvedProblemIds = await Submission.distinct("problem", {
      user: userId,
      verdict: "Accepted",
    });

    const problemsSolved = solvedProblemIds.length;

    // Difficulty breakdown across distinct solved problems
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    if (problemsSolved > 0) {
      const solvedProblems = await Problem.find({
        _id: { $in: solvedProblemIds },
      }).select("difficulty");

      for (const p of solvedProblems) {
        if (p.difficulty === "Easy") easySolved++;
        else if (p.difficulty === "Medium") mediumSolved++;
        else if (p.difficulty === "Hard") hardSolved++;
      }
    }

    // Fetch user profile for live XP and streak
    const user = await User.findById(userId).select("xp streak lastSolvedDate");

    res.json({
      totalSubmissions,
      acceptedSubmissions,
      problemsSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      xp: user?.xp || 0,
      streak: user?.streak || 0,
    });
  } catch (error) {
    next(error);
  }
};
