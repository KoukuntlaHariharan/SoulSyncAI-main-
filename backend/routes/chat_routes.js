import express from "express";
import {
  createChat, 
  getAllChats,
  getChatHistory,
  sendMessage,
  deleteChat,
} from "../controllers/chat_controller.js";
import { protect } from "../middleware/auth_middleware.js";

const router = express.Router();

router.post("/create", protect, createChat);
router.get("/all", protect, getAllChats);
router.get("/history", protect, getChatHistory);
router.post("/send", protect, sendMessage);
router.delete("/delete/:chatId", protect, deleteChat);

export default router;
