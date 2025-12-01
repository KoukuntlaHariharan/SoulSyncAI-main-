// backend/controllers/chat_controller.js
import Chat from "../models/Chat.js";
import { callGemini } from "../utils/gemini_client.js";
import redis from "../utils/redis_client.js"; // Ensure this path is correct

// 1. CREATE CHAT (Original Logic)
export const createChat = async (req, res) => {
  try {
    const { chatName } = req.body;
    // Note: req.user comes from the session middleware now
    const userId = req.user.id;

    if (!chatName) return res.status(400).json({ error: "chatName required" });

    const newChat = await Chat.create({
      userId,
      chatName,
      messages: [],
    });

    res.json({ success: true, chat: newChat });
  } catch (err) {
    console.error("createChat error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 2. GET ALL CHATS (Original Logic)
export const getAllChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({ userId })
      .select("_id chatName updatedAt createdAt")
      .sort({ updatedAt: -1 });
    res.json({ chats });
  } catch (err) {
    console.error("getAllChats error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 3. GET CHAT HISTORY (Modified for Redis Caching)
export const getChatHistory = async (req, res) => {
  try {
    const { id } = req.query; // Chat ID
    
    // REDIS: Define a unique key
    const cacheKey = `chat_history:${id}`;

    // REDIS: Check cache first
    const cachedMessages = await redis.get(cacheKey);

    if (cachedMessages) {
        console.log("⚡ Serving Chat History from Redis Cache");
        return res.json({ messages: JSON.parse(cachedMessages) });
    }

    // If not in Redis, get from MongoDB
    console.log("🐢 Serving Chat History from MongoDB");
    const userId = req.user.id;
    const chat = await Chat.findOne({ _id: id, userId });
    
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // REDIS: Save to cache (Expires in 1 hour)
    await redis.setex(cacheKey, 3600, JSON.stringify(chat.messages));

    res.json({ messages: chat.messages });
  } catch (err) {
    console.error("getChatHistory error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 4. SEND MESSAGE (Modified for Redis Invalidation)
export const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    const userId = req.user.id;

    if (!message) return res.status(400).json({ error: "message required" });
    if (!chatId) return res.status(400).json({ error: "chatId required" });

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // Add User Message
    chat.messages.push({ role: "user", content: message });
    chat.updatedAt = new Date();
    
    // Call Gemini AI
    const aiReply = await callGemini(message);
    chat.messages.push({ role: "assistant", content: aiReply });
    
    // Save to MongoDB
    await chat.save();

    // REDIS: Invalidate (delete) the old cache so next fetch gets new data
    const cacheKey = `chat_history:${chatId}`;
    await redis.del(cacheKey); 

    res.json({ success: true, reply: aiReply, messages: chat.messages });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 5. DELETE CHAT (Original Logic + Cache Cleanup)
export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    
    await Chat.findOneAndDelete({ _id: chatId, userId });

    // Optional: Clean up Redis cache for this chat just in case
    const cacheKey = `chat_history:${chatId}`;
    await redis.del(cacheKey);

    res.json({ success: true });
  } catch (err) {
    console.error("deleteChat error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};