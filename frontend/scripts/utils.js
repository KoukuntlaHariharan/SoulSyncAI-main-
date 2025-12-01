// utils.js — loads navbar, sidebar, footer and applies theme/auth state
export function loadComponents() {
  return new Promise((resolve) => {
    applyGlobalTheme();

    let loaded = 0;
    const total = 3;
    const checkDone = () => {
      loaded++;
      if (loaded === total) resolve();
    };

    // NAVBAR
    const nav = document.getElementById("navbar");
    if (nav) {
      fetch("../components/navbar.html")
        .then((r) => r.text())
        .then((html) => {
          nav.innerHTML = html;
          // after nav inserted, apply auth state (small timeout for safe DOM)
          setTimeout(() => {
            if (typeof applyAuthState === "function") applyAuthState();
          }, 10);
          checkDone();
        })
        .catch(() => checkDone());
    } else checkDone();

    // FOOTER
    const footer = document.getElementById("footer");
    if (footer) {
      fetch("../components/footer.html")
        .then((r) => r.text())
        .then((html) => {
          footer.innerHTML = html;
          checkDone();
        })
        .catch(() => checkDone());
    } else checkDone();

    // SIDEBAR
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      fetch("../components/sidebar.html")
        .then((r) => r.text())
        .then((html) => {
          sidebar.innerHTML = html;

          // After sidebar is in DOM, import chat bindings
          import("./chat.js")
            .then((module) => {
              if (module && module.setupChatBindings)
                module.setupChatBindings();
              // and also ensure delete popup setup
              if (module && module.setupDeleteChatPopup)
                module.setupDeleteChatPopup();
            })
            .catch((err) => console.error("chat import failed", err));

          checkDone();
        })
        .catch(() => checkDone());
    } else checkDone();
  });
}

// auth state modification for navbar
export function applyAuthState() {
  const token = localStorage.getItem("token");
  const loginBtn = document.querySelector(".login-btn");
  const signupBtn = document.querySelector(".signup-btn");
  const profileIcon = document.querySelector(".profile-icon");

  const isLoggedIn = !!token;
  if (isLoggedIn) {
    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";
    if (profileIcon) profileIcon.style.display = "flex";
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (signupBtn) signupBtn.style.display = "inline-block";
    if (profileIcon) profileIcon.style.display = "none";
  }
}

// theme
export function applyGlobalTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.body.classList.add("theme-dark");
  else document.body.classList.remove("theme-dark");
}
