export const protect = (req, res, next) => {
  // 1. Check if the session exists and has a user attached
  // express-session (with Redis) automatically populates req.session
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Not authorized, please login" });
  }

  // 2. Attach the user to the request object for controllers to use
  // We don't need to query MongoDB here! The user data is already in Redis/Session.
  req.user = req.session.user;

  next();
};