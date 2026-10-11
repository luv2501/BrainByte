import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { syncAndGetEffectiveStreak } from "../utils/streak.js";

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Not authorized, token missing" });
      }

      const secret = process.env.JWT_SECRET || "brainbyte_jwt_default_secret_key";
      const decoded = jwt.verify(token, secret);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      await syncAndGetEffectiveStreak(req.user);

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Not authorized, token has expired" });
      }
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

