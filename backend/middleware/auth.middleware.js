import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; 
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to restrict to admin only
export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};


//chiarman middlewares
export const chairmanMiddleware = (req, res, next) => {
  if (req.user.role !== "club_chairman") {
    return res.status(403).json({ message: "Chairman access required" });
  }
  next();
};

//student middlewares
export const studentMiddleware = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "student access required" });
  }
  next();
};