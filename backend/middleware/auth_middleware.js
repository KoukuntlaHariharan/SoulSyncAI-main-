import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
