import { callGemini } from "../utils/gemini_client.js";

export async function sendGuestMessage(req, res) {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const aiReply = await callGemini(message);

    return res.json({
      reply: aiReply,
    });
  } catch (err) {
    console.error("Guest Chat Error:", err);
    res.status(500).json({ error: "AI failed to respond" });
  }
}
