import express from "express";
import {
  getAIHint,
  getCodeExplanation,
  getDebugAdvice,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All AI routes are protected by JWT authentication
router.post("/hint", protect, getAIHint);
router.post("/explain", protect, getCodeExplanation);
router.post("/debug", protect, getDebugAdvice);

export default router;

