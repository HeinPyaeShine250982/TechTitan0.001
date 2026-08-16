document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements - Login & Bot Controls
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("toggle-password");
  const speechBubble = document.getElementById("speech-bubble");
  const mainRobot = document.getElementById("main-robot");
  const loginForm = document.getElementById("login-form");
  const loginCard = document.querySelector(".login-card");

  // DOM Elements - Navigation & Page Dashboard
  const loginSection = document.getElementById("login-section");
  const appDashboard = document.getElementById("app-dashboard");
  const userDisplayName = document.getElementById("user-display-name");
  const logoutBtn = document.getElementById("logout-btn");
  const navBtns = document.querySelectorAll(".nav-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  // Helper Function: Manage Robot Emotions & Speech Bubble
  function setRobotState(mood, message) {
    // Remove all previous mood classes
    mainRobot.classList.remove(
      "mood-neutral",
      "mood-happy",
      "mood-angry",
      "mood-sad",
      "mood-excited",
      "mood-surprised",
      "password-mode"
    );

    // Apply selected mood if not neutral
    if (mood && mood !== "neutral") {
      mainRobot.classList.add(`mood-${mood}`);
    }

    if (message) {
      speechBubble.textContent = message;
    }
  }

  // Dynamic Eye-Tracking Movement
  document.addEventListener("mousemove", (e) => {
    // Skip cursor tracking if password mode is active
    if (mainRobot.classList.contains("password-mode")) return;

    const eyes = document.querySelectorAll(".robot-eye");
    eyes.forEach((eye) => {
      const rect = eye.getBoundingClientRect();
      const eyeX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
      const distance = Math.min(3, Math.hypot(e.clientX - eyeX, e.clientY - eyeY) / 30);

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;
      eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  // Event Listeners for Dynamic Feedback & Emotions
  usernameInput.addEventListener("focus", () => {
    setRobotState("neutral", "Enter your username below!");
  });

  usernameInput.addEventListener("input", (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) {
      setRobotState("neutral", `Identifying entity: ${val}...`);
    } else {
      setRobotState("neutral", "Enter your username below!");
    }
  });

  emailInput.addEventListener("focus", () => {
    setRobotState("neutral", "Provide your registered email address.");
  });

  passwordInput.addEventListener("focus", () => {
    setRobotState(null, "Hiding my eyes for your security!");
    mainRobot.classList.add("password-mode");
  });

  passwordInput.addEventListener("blur", () => {
    mainRobot.classList.remove("password-mode");
    setRobotState("neutral", "Beep Boop! I'm watching again.");
  });

  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.getAttribute("type") === "password";
    passwordInput.setAttribute("type", isPassword ? "text" : "password");
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");

    if (isPassword) {
      setRobotState("surprised", "Peeking at the password!");
    } else {
      setRobotState(null, "Keeping it secret!");
      mainRobot.classList.add("password-mode");
    }
  });

  // Hardcoded Authentication Checking Logic
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const usernameVal = usernameInput.value.trim();
    const emailVal = emailInput.value.trim().toLowerCase();
    const passwordVal = passwordInput.value;

    const isValidUsername = usernameVal === "TechTitan";
    const isValidEmail = emailVal === "shine250982@gmail.com" || emailVal === "techtitan001@gmail.com";
    const isValidPassword = passwordVal === "WeAreTechTitan";

    if (isValidUsername && isValidEmail && isValidPassword) {
      // SUCCESS STATE
      setRobotState("happy", "Access Granted! Welcome to TechTitan Hub!");

      setTimeout(() => {
        loginSection.classList.add("hidden");
        appDashboard.classList.remove("hidden");
        userDisplayName.textContent = usernameVal;
      }, 1000);

    } else {
      // FAILURE STATE
      setRobotState("angry", "Access Denied! Incorrect Credentials.");

      loginCard.classList.remove("shake");
      void loginCard.offsetWidth; // Force Reflow
      loginCard.classList.add("shake");
    }
  });

  // Navigation Logic
  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");

      navBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((tab) => {
        tab.classList.add("hidden-tab");
        tab.classList.remove("active-tab");
      });

      btn.classList.add("active");
      const activeTabEl = document.getElementById(targetTab);
      if (activeTabEl) {
        activeTabEl.classList.remove("hidden-tab");
        activeTabEl.classList.add("active-tab");
      }
    });
  });

  // Logout Functionality
  logoutBtn.addEventListener("click", () => {
    appDashboard.classList.add("hidden");
    loginSection.classList.remove("hidden");
    loginForm.reset();
    setRobotState("neutral", "Beep Boop! Welcome to TechTitan. Who goes there?");
  });
});

// Module Launcher Function
function openModule(moduleName) {
  alert(`Navigating to the [${moduleName}] module...`);
}