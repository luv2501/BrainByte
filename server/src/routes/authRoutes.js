import express from "express";
import { register, signup, login, getMe } from "../controllers/authController.js";
import { googleAuth } from "../controllers/googleAuthController.js";
import { githubLogin, githubCallback } from "../controllers/githubAuthController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/github", githubLogin);
router.get("/github/callback", githubCallback);
router.get("/me", protect, getMe);

export default router;

