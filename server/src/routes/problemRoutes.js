import express from "express";
import {
  createProblem,
  getProblems,
  getProblemByIdOrSlug,
  updateProblem,
  deleteProblem,
  toggleSaveProblem,
  getSavedProblems,
} from "../controllers/problemController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Problem collection routes
router.route("/")
  .get(getProblems)
  .post(protect, createProblem);

// User bookmark routes
router.get("/saved/me", protect, getSavedProblems);
router.post("/:id/save", protect, toggleSaveProblem);

// Individual problem item routes (by slug or MongoDB ObjectId)
router.route("/:identifier")
  .get(getProblemByIdOrSlug)
  .put(protect, updateProblem)
  .delete(protect, deleteProblem);

export default router;
