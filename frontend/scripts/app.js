// app.js — chat send logic and bubbles
import { apiPost, API } from "./api.js";

// Expose activeChatId via window.activeChatId (managed by chat.js)
function addUserMessage(text) {
  const conversation = document.getElementById("conversation");
  const userBubble = document.createElement("div");
  userBubble.className = "msg user";
  userBubble.innerHTML = `<div class="bubble bubble-user">${escapeHtml(
    text
  )}</div>`;
  conversation.appendChild(userBubble);
  conversation.scrollTop = conversation.scrollHeight;
}

function addAssistantMessage(text) {
  const conversation = document.getElementById("conversation");
  const bot = document.createElement("div");
  bot.className = "msg assistant";
  bot.innerHTML = `<div class="bubble bubble-assistant">${escapeHtml(
    text
  )}</div>`;
  conversation.appendChild(bot);
  conversation.scrollTop = conversation.scrollHeight;
}

function escapeHtml(unsafe) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  const chatId = window.activeChatId;
  if (!chatId) {
    alert("Please create or open a chat first.");
    return;
  }

  addUserMessage(text);
  input.value = "";

  try {
    const res = await apiPost(API.CHAT.SEND, { message: text, chatId });

    if (res.reply) {
      addAssistantMessage(res.reply);
    } else {
      addAssistantMessage("⚠ AI did not respond.");
    }
  } catch (err) {
    console.error("SendMessage error:", err);
    addAssistantMessage("⚠ Something went wrong.");
  }
}
