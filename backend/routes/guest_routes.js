import express from "express";
import { sendGuestMessage } from "../controllers/guest_controller.js";

const router = express.Router();

router.post("/send", sendGuestMessage);

export default router;
