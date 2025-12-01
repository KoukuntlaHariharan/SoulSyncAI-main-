// Determine login state
const isLoggedIn = localStorage.getItem("token");

// Main CTA button
const btn = document.getElementById("landingMainBtn");

if (btn) {
  if (isLoggedIn) {
    // Logged in → Go to chat.html
    btn.textContent = "Chat ↗";
    btn.href = "./chat.html";

    // Optional style tweak for logged-in users
    btn.style.padding = "14px 28px";
  } else {
    // Not logged in → Try as Guest
    btn.textContent = "Try as Guest";
    btn.href = "./chat-guest.html?guest=true";
  }
}
