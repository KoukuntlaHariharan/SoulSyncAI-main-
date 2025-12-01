// =========================================================
// UnmuteMind - Authentication Logic (Login + Signup)
// Includes: Password Toggle, Emoji Backdrop, API calls
// =========================================================

import { apiPost, API } from "./api.js";

/* =========================================================
   SIMPLE PASSWORD TOGGLE (👁️ → 🚫)
========================================================= */
export function togglePassword(id, el) {
  const input = document.getElementById(id);
  if (!input) return;

  if (input.type === "password") {
    input.type = "text";
    el.textContent = "🚫"; // hide icon
  } else {
    input.type = "password";
    el.textContent = "👁️"; // show icon
  }
}

// Make available globally for HTML onclick=""
window.togglePassword = togglePassword;

/* =========================================================
   RUN AFTER PAGE LOAD
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     LOGIN HANDLER
  ========================================================= */
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const loginId = document.getElementById("loginId").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      const res = await apiPost(API.AUTH.LOGIN, { loginId, password });

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        window.location.href = "./chat.html";
      } else {
        alert(res.message || "Login failed ❌");
      }
    });
  }

  /* =========================================================
     SIGNUP HANDLER
  ========================================================= */
  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        email: document.getElementById("signupEmail").value.trim(),
        firstName: document.getElementById("signupFname").value.trim(),
        lastName: document.getElementById("signupLname").value.trim(),
        dob: document.getElementById("signupDob").value,
        username: document.getElementById("signupUsername").value.trim(),
        password: document.getElementById("signupPassword").value.trim(),
      };

      const res = await apiPost(API.AUTH.SIGNUP, payload);

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        window.location.href = "./chat.html";
      } else {
        alert(res.message || "Signup failed ❌");
      }
    });
  }

  /* =========================================================
     RANDOM EMOJI BACKDROP POSITIONS
  ========================================================= */
  const emojis = document.querySelectorAll(".emoji-bg span");

  emojis.forEach((emoji) => {
    emoji.style.top = Math.random() * 100 + "%";
    emoji.style.left = Math.random() * 100 + "%";
    emoji.style.fontSize = 40 + Math.random() * 40 + "px";
    emoji.style.animationDelay = Math.random() * 5 + "s";
  });
});
