import { apiPost, API } from "./api.js";

let guestMessageCount = 0;
const GUEST_LIMIT = 5;

export function setupGuestChat() {
  updateGuestCounter();

  document.getElementById("guestSendBtn").onclick = sendGuestMessage;

  document.getElementById("guestMessage").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendGuestMessage();
    }
  });

  document.getElementById("guestLimitClose").onclick = () => {
    document.getElementById("guestLimitPopup").classList.add("hidden");
  };
}

function updateGuestCounter() {
  document.getElementById("guestMessagesLeft").textContent =
    GUEST_LIMIT - guestMessageCount;
}

function renderUser(text) {
  const box = document.getElementById("guestConversation");
  box.innerHTML += `
      <div class="msg user">
        <div class="bubble bubble-user">${text}</div>
      </div>`;
  box.scrollTop = box.scrollHeight;
}

function renderAssistant(text) {
  const box = document.getElementById("guestConversation");
  box.innerHTML += `
      <div class="msg assistant">
        <div class="bubble bubble-assistant">${text}</div>
      </div>`;
  box.scrollTop = box.scrollHeight;
}

async function sendGuestMessage() {
  const input = document.getElementById("guestMessage");
  const text = input.value.trim();
  if (!text) return;

  // LIMIT CHECK
  if (guestMessageCount >= GUEST_LIMIT) {
    document.getElementById("guestLimitPopup").classList.remove("hidden");
    return;
  }

  renderUser(text);
  input.value = "";

  guestMessageCount++;
  updateGuestCounter();

  try {
    // CALL REAL GEMINI ENDPOINT
    const res = await apiPost(API.GUEST.SEND, { message: text });

    if (res.reply) {
      renderAssistant(res.reply);
    } else {
      renderAssistant("⚠ AI did not respond.");
    }
  } catch (err) {
    console.error(err);
    renderAssistant("⚠ Something went wrong with AI.");
  }
}
