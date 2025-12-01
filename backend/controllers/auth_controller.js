import User from "../models/User.js";

// Note: We removed the JWT signing function because `express-session` handles the auth state now.
// If you still want to return a token for other reasons, you can keep it, but it's redundant.

export const signup = async (req, res) => {
  try {
    const user = await User.create(req.body);
    
    // Automatically log the user in after signup
    req.session.user = { id: user._id, username: user.username, email: user.email };
    
    res.json({ success: true, message: "User created and logged in", user });
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

  // SAVE USER TO REDIS SESSION
  // This magic line creates the cookie and saves data to Redis
  req.session.user = { id: user._id, username: user.username, email: user.email };

  res.json({
    success: true,
    message: "Logged in successfully",
    user, 
    // No "token" needed! The browser now has a cookie.
  });
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Could not log out" });
        res.clearCookie("connect.sid"); // Clear the cookie from browser
        res.json({ success: true, message: "Logged out" });
    });
};