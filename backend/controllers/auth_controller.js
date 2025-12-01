import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

const signToken = (id) =>
  jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES });

export const signup = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ token: signToken(user._id), user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { loginId, password } = req.body;

  const user =
    (await User.findOne({ email: loginId })) ||
    (await User.findOne({ username: loginId }));

  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await user.comparePassword(password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  res.json({
    token: signToken(user._id),
    user,
  });
};
