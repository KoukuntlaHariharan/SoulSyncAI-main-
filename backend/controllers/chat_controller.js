// chat_controller.js
import Chat from "../models/Chat.js";
import { callGemini } from "../utils/gemini_client.js";

// create chat
export const createChat = async (req, res) => {
  try {
    const { chatName } = req.body;
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

// get all chats for user
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

// get chat messages
export const getChatHistory = async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;
    const chat = await Chat.findOne({ _id: id, userId });
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json({ messages: chat.messages });
  } catch (err) {
    console.error("getChatHistory error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// send message (save user then call gemini, save assistant)
export const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    const userId = req.user.id;

    if (!message) return res.status(400).json({ error: "message required" });
    if (!chatId) return res.status(400).json({ error: "chatId required" });

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    chat.messages.push({ role: "user", content: message });
    // update timestamp
    chat.updatedAt = new Date();
    await chat.save();

    // call Gemini
    const aiReply = await callGemini(message);

    chat.messages.push({ role: "assistant", content: aiReply });
    chat.updatedAt = new Date();
    await chat.save();

    res.json({ success: true, reply: aiReply, messages: chat.messages });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// delete chat
export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    await Chat.findOneAndDelete({ _id: chatId, userId });
    res.json({ success: true });
  } catch (err) {
    console.error("deleteChat error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
