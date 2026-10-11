import express from "express";
import {
  runAgainstInput,
  submitSolution,
  getMySubmissions,
  getSubmissionById,
  getUserStats,
} from "../controllers/submissionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Quick execution (playground / sample testing, no DB write)
router.post("/run", protect, runAgainstInput);

// Progress statistics
router.get("/stats/me", protect, getUserStats);
router.get("/me/stats", protect, getUserStats);

// User submission history
router.get("/me", protect, getMySubmissions);

// Final submission (runs against all test cases, saves record, awards XP & tracks solved problems)
router.post("/submit", protect, submitSolution);
router.post("/:problemId", protect, submitSolution);

// Single submission details (protected by user ownership)
router.get("/:id", protect, getSubmissionById);

export default router;
