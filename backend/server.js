import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session"; // Import Session
import RedisStore from "connect-redis"; // Import Redis Store adapter
import { connectDB } from "./config/database.js";
import redisClient from "./utils/redis_client.js"; // Import your new Redis Client

import authRoutes from "./routes/auth_routes.js";
import chatRoutes from "./routes/chat_routes.js";
import guestRoutes from "./routes/guest_routes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors({
    origin: "http://127.0.0.1:5500", // IMPORTANT: Must match your frontend URL exactly for cookies to work
    credentials: true // Allow cookies to be sent with requests
}));
app.use(express.json());

// ----------------------------------------------------
// REDIS SESSION SETUP
// ----------------------------------------------------
// Initialize the Redis Store
const redisStore = new RedisStore({
    client: redisClient,
    prefix: "soulsync:sess:", // Prefix for keys in Redis (keeps it organized)
});

// Configure Session Middleware
app.use(
    session({
        store: redisStore,
        secret: process.env.SESSION_SECRET || "supersecretkey", // Change this in .env
        resave: false, // Don't save session if unmodified
        saveUninitialized: false, // Don't create session until something is stored
        cookie: {
            secure: false, // Set to TRUE if using HTTPS (Production)
            httpOnly: true, // Prevents JS from reading the cookie (Security)
            maxAge: 1000 * 60 * 60 * 24, // 1 Day Expiry
        },
    })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/guest", guestRoutes);

// Root Check
app.get("/", (req, res) => {
    // Just a debug helper to see if Redis is counting views
    if(req.session.views) {
        req.session.views++;
    } else {
        req.session.views = 1;
    }
    res.send(`UnmuteMind Backend Running. You visited this page ${req.session.views} times.`);
});

// Start server AFTER DB connects
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});