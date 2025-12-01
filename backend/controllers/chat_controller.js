import Chat from "../models/Chat.js";
import { callGemini } from "../utils/gemini_client.js";
import redis from "../utils/redis_client.js"; // Import Redis

// ... createChat and getAllChats (Keep these as they were) ...
// You can keep createChat and getAllChats exactly as they are in your original file.
// I will only show the modified getChatHistory and sendMessage where caching matters.

// get chat messages (WITH REDIS CACHING)
export const getChatHistory = async (req, res) => {
  try {
    const { id } = req.query; // Chat ID
    
    // 1. Define a unique key for Redis
    const cacheKey = `chat_history:${id}`;

    // 2. Try to get data from Redis
    const cachedMessages = await redis.get(cacheKey);

    if (cachedMessages) {
        console.log("⚡ Serving Chat History from Redis Cache");
        // Parse the string back into JSON and return
        return res.json({ messages: JSON.parse(cachedMessages) });
    }

    // 3. If not in Redis, get from MongoDB
    console.log("🐢 Serving Chat History from MongoDB");
    const userId = req.session.user.id; // Note: accessing from session now!
    const chat = await Chat.findOne({ _id: id, userId });
    
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // 4. Save to Redis for next time (Expire in 1 hour = 3600 seconds)
    // We store the 'messages' array as a string
    await redis.setex(cacheKey, 3600, JSON.stringify(chat.messages));

    res.json({ messages: chat.messages });
  } catch (err) {
    console.error("getChatHistory error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// send message
export const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    const userId = req.session.user.id; // Accessing from Session

    if (!message) return res.status(400).json({ error: "message required" });
    if (!chatId) return res.status(400).json({ error: "chatId required" });

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // Logic to Add User Message
    chat.messages.push({ role: "user", content: message });
    chat.updatedAt = new Date();
    
    // Call Gemini
    const aiReply = await callGemini(message);
    chat.messages.push({ role: "assistant", content: aiReply });
    
    // Save to MongoDB
    await chat.save();

    // ------------------------------------------
    // INVALIDATE CACHE
    // ------------------------------------------
    // Since the chat history changed, the old cache is wrong.
    // We must delete the old key so the next 'get' fetches the new data.
    const cacheKey = `chat_history:${chatId}`;
    await redis.del(cacheKey); 
    // ------------------------------------------

    res.json({ success: true, reply: aiReply, messages: chat.messages });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};