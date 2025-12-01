import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Create Redis Client
// By default, it connects to localhost:6379. 
// Use REDIS_URL in .env for production (e.g., redis://user:pass@host:port)
const redis = new Redis(process.env.REDIS_URL || {
    host: "127.0.0.1", 
    port: 6379
});

redis.on("connect", () => {
    console.log("✅ Redis Connected Successfully");
});

redis.on("error", (err) => {
    console.error("❌ Redis Connection Error:", err);
});

export default redis;