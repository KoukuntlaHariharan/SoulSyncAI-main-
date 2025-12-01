import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";

import authRoutes from "./routes/auth_routes.js";
import chatRoutes from "./routes/chat_routes.js";
import guestRoutes from "./routes/guest_routes.js";



dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/guest", guestRoutes);

// Root Check
app.get("/", (req, res) => {
  res.send("UnmuteMind Backend is Running ✔");
});

// Start server AFTER DB connects
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
