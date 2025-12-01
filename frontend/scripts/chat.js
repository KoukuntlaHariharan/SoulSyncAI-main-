// chat.js — sidebar + chat session management
import { apiPost, apiGet, apiFetch, API } from "./api.js";

let deleteTarget = null;

// Load user chats and render history
export async function loadUserChats() {
  const list = document.getElementById("chat-history-list");
  if (!list) return;

  list.innerHTML = "";

  const res = await apiGet(API.CHAT.ALL);
  if (!res.chats || res.chats.length === 0) {
    list.innerHTML =
      "<p style='color:var(--text-muted)'>No chats yet. Start a new one.</p>";
    return;
  }

  res.chats.forEach((chat) => addToHistory(chat));

  // attach handlers after the nodes exist
  setupHistoryEvents();
}

function addToHistory(chat) {
  const list = document.getElementById("chat-history-list");
  if (!list) return;

  const existing = list.querySelector(`[data-chat-id="${chat._id}"]`);
  if (existing) return;

  const card = document.createElement("div");
  card.className = "history-card";
  card.setAttribute("data-chat-id", chat._id);

  card.innerHTML = `
    <span class="chat-title">→ ${escapeHtml(chat.chatName)}</span>
    <span class="delete-chat-btn" title="Delete chat">🗑️</span>
  `;

  card.onclick = () => {
    const id = card.getAttribute("data-chat-id");
    loadChat(id);
  };

  card.querySelector(".delete-chat-btn").onclick = (e) => {
    e.stopPropagation();
    openDeletePopup(chat._id, card);
  };

  list.prepend(card);
}


function setupHistoryEvents() {
  document.querySelectorAll(".history-card").forEach((card) => {
    const chatId = card.getAttribute("data-chat-id");
    const title = card.querySelector(".chat-title");
    const del = card.querySelector(".delete-chat-btn");

    title.onclick = () => loadChat(chatId);
    del.onclick = (e) => {
      e.stopPropagation();
      openDeletePopup(chatId, card);
    };
  });
}

export async function loadChat(chatId) {
  if (!chatId) return;

  window.activeChatId = chatId;
  localStorage.setItem("activeChatId", chatId);

  clearConversation();

  const res = await apiGet(API.CHAT.HISTORY + "?id=" + chatId);
  if (!res.messages) return;

  res.messages.forEach((m) => {
    if (m.role === "user") addUserMessage(m.content);
    else addAssistantMessage(m.content);
  });
}

function clearConversation() {
  const conversation = document.getElementById("conversation");
  if (conversation) conversation.innerHTML = "";
}

function addUserMessage(text) {
  const box = document.getElementById("conversation");
  box.innerHTML += `
    <div class="msg user"><div class="bubble bubble-user">${escapeHtml(
      text
    )}</div></div>`;
  box.scrollTop = box.scrollHeight;
}

function addAssistantMessage(text) {
  const box = document.getElementById("conversation");
  box.innerHTML += `
    <div class="msg assistant"><div class="bubble bubble-assistant">${escapeHtml(
      text
    )}</div></div>`;
  box.scrollTop = box.scrollHeight;
}

function escapeHtml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// CREATE CHAT
async function createChat() {
  const nameEl = document.getElementById("chatNameInput");
  if (!nameEl) return;
  const name = nameEl.value.trim();
  if (!name) return;
  document.getElementById("chatPopup").classList.add("hidden");

  const res = await apiPost(API.CHAT.CREATE, { chatName: name });
  if (res.chat) {
    window.activeChatId = res.chat._id;
    localStorage.setItem("activeChatId", res.chat._id);
    await loadUserChats();
    await loadChat(res.chat._id);
  } else {
    alert(res.error || "Unable to create chat");
  }
}

// DELETE UI
export function openDeletePopup(chatId, element) {
  deleteTarget = { chatId, element };
  document.getElementById("deleteChatPopup").classList.remove("hidden");
}

export function setupDeleteChatPopup() {
  const popup = document.getElementById("deleteChatPopup");
  const cancelBtn = document.getElementById("cancelDeleteBtn");
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  if (!cancelBtn || !confirmBtn) return;

  cancelBtn.onclick = () => {
    popup.classList.add("hidden");
    deleteTarget = null;
  };

  confirmBtn.onclick = async () => {
    if (!deleteTarget) return;
    const { chatId, element } = deleteTarget;
    const res = await apiFetch(API.CHAT.DELETE + "/" + chatId, {
      method: "DELETE",
    });
    if (res.success) {
      element.remove();
      if (window.activeChatId === chatId) {
        window.activeChatId = null;
        localStorage.removeItem("activeChatId");
        clearConversation();
      }
    } else {
      alert(res.error || "Failed to delete");
    }
    popup.classList.add("hidden");
    deleteTarget = null;
  };
}

// Bind the popup + new chat button
export function setupChatBindings() {
  const newChatBtn = document.getElementById("newChatBtn");
  const createBtn = document.getElementById("createChatBtn");
  const cancelBtn = document.getElementById("cancelChatBtn");
  if (newChatBtn) {
    newChatBtn.onclick = () => {
      document.getElementById("chatPopup").classList.remove("hidden");
      document.getElementById("chatNameInput").value = "";
    };
  }
  if (createBtn) createBtn.onclick = createChat;
  if (cancelBtn)
    cancelBtn.onclick = () =>
      document.getElementById("chatPopup").classList.add("hidden");
}
