import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || "brainbyte_jwt_default_secret_key";
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @route POST /api/auth/register or /api/auth/signup
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters long" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const trimmedUsername = username.trim();

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: trimmedUsername }],
    });

    if (existingUser) {
      const field = existingUser.email === normalizedEmail ? "Email" : "Username";
      return res.status(400).json({ message: `${field} is already in use` });
    }

    const user = await User.create({
      username: trimmedUsername,
      email: normalizedEmail,
      password,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl || "",
      xp: user.xp || 0,
      streak: user.streak || 0,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// Backward-compatible alias for register
export const signup = register;

// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl || "",
      xp: user.xp || 0,
      streak: user.streak || 0,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

