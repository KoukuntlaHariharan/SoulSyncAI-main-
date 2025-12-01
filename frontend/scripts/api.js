// ========================================
// UnmuteMind API CONFIG (Frontend)
// LOCAL DEVELOPMENT MODE (always localhost)
// ========================================

export const API = {
  // Always local backend during development
  BASE_URL: "http://localhost:5000/api",

  // AUTH ROUTES
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    PROFILE: "/auth/profile",
  },

  // CHAT ROUTES
  CHAT: {
    CREATE: "/chat/create",
    SEND: "/chat/send",
    HISTORY: "/chat/history",
    ALL: "/chat/all",
    DELETE: "/chat/delete",
  },

  GUEST: {
    SEND: "/guest/send",
  },
};

// ===================================================
// Generic Fetch Wrapper (JWT + JSON handling)
// ===================================================
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(API.BASE_URL + path, {
      ...options,
      headers,
    });

    // Try parsing JSON response
    const data = await response.json().catch(() => ({
      error: "Invalid JSON received from server",
    }));

    // Auto logout & redirect on unauthorized
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "../pages/login.html";
      return;
    }

    return data;
  } catch (err) {
    console.error("API Error:", err);
    return { error: err.message || "Network error" };
  }
}

// ===================================================
// Helper Methods for GET & POST
// ===================================================
export const apiGet = (path) => apiFetch(path);

export const apiPost = (path, bodyObj) =>
  apiFetch(path, {
    method: "POST",
    body: JSON.stringify(bodyObj),
  });
