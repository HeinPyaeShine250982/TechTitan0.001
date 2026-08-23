document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements - Login & Bot Controls
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("toggle-password");
  const speechBubble = document.getElementById("speech-bubble");
  const mainRobot = document.getElementById("main-robot");
  const robotHead = document.querySelector(".robot-head");
  const loginForm = document.getElementById("login-form");
  const loginCard = document.querySelector(".login-card");

  // DOM Elements - Side Bot Password Checklists
  const leftPassChecklist = document.getElementById("left-pass-checklist");
  const rightPassChecklist = document.getElementById("right-pass-checklist");
  const reqLength = document.getElementById("req-length");
  const reqSpecial = document.getElementById("req-special");
  const reqUppercase = document.getElementById("req-uppercase");
  const reqNumber = document.getElementById("req-number");

  // DOM Elements - Navigation & Page Dashboard
  const loginSection = document.getElementById("login-section");
  const appDashboard = document.getElementById("app-dashboard");
  const userDisplayName = document.getElementById("user-display-name");
  const logoutBtn = document.getElementById("logout-btn");
  const navBtns = document.querySelectorAll(".nav-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  // Helper Function: Manage Robot Emotions & Speech Bubble
  function setRobotState(mood, message) {
    mainRobot.classList.remove(
      "mood-neutral",
      "mood-happy",
      "mood-angry",
      "mood-sad",
      "mood-excited",
      "mood-surprised",
      "mood-waving",
      "password-mode"
    );

    if (mood && mood !== "neutral") {
      mainRobot.classList.add(`mood-${mood}`);
    } else {
      mainRobot.classList.add("mood-neutral");
    }

    if (message) {
      speechBubble.textContent = message;
    }
  }

  // Dynamic Eye-Tracking & Gentle Head Tilt
  document.addEventListener("mousemove", (e) => {
    if (mainRobot.classList.contains("password-mode")) return;

    // Head Tilt Calculation
    if (robotHead) {
      const rect = mainRobot.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const tiltX = (e.clientX - centerX) / 45;
      const tiltY = (e.clientY - centerY) / 45;

      robotHead.style.transform = `rotate(${tiltX * 0.5}deg) translate(${tiltX * 0.3}px, ${tiltY * 0.3}px)`;
    }

    // Eye Tracking Calculation
    const eyes = document.querySelectorAll(".robot-eye");
    eyes.forEach((eye) => {
      const rect = eye.getBoundingClientRect();
      const eyeX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
      const distance = Math.min(3.5, Math.hypot(e.clientX - eyeX, e.clientY - eyeY) / 25);

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;
      eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  document.addEventListener("mousemove", (e) => {
  const miniEyes = document.querySelectorAll(".mini-robot-eye");
  miniEyes.forEach((eye) => {
    const rect = eye.getBoundingClientRect();
    const eyeX = rect.left + rect.width / 2;
    const eyeY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
    const distance = Math.min(1.5, Math.hypot(e.clientX - eyeX, e.clientY - eyeY) / 30);

    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;
    eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
    
  // Mini-Robot Hand Waving Click/Tap Event
  const miniHands = document.querySelectorAll(".mini-hand");

  miniHands.forEach((hand) => {
    hand.addEventListener("click", (e) => {
      e.stopPropagation();

      // Reset animation
      hand.classList.remove("waving");
      void hand.offsetWidth; // Force CSS reflow
      hand.classList.add("waving");

      // Keep waving active for 5 seconds (5000 ms)
      setTimeout(() => {
        hand.classList.remove("waving");
      }, 5000);
    });
  });
});

  // Random Idle Expressions for Personality
  setInterval(() => {
    if (
      !mainRobot.classList.contains("password-mode") &&
      !mainRobot.classList.contains("mood-waving") &&
      mainRobot.classList.contains("mood-neutral")
    ) {
      mainRobot.classList.add("mood-happy");
      setTimeout(() => {
        if (mainRobot.classList.contains("mood-happy")) {
          mainRobot.classList.remove("mood-happy");
          mainRobot.classList.add("mood-neutral");
        }
      }, 1800);
    }
  }, 12000);

  // Username Logic & Validation Formatting (A-Z standard only)
  usernameInput.addEventListener("focus", () => {
    const val = usernameInput.value;
    if (val.length > 0 && !/^[a-zA-Z]+$/.test(val)) {
      setRobotState("angry", "Wrong Format, only use Eng Letter A-Z");
    } else {
      setRobotState("neutral", "Enter your username below!");
    }
  });

  usernameInput.addEventListener("input", (e) => {
    const val = e.target.value;
    if (val.length === 0) {
      setRobotState("neutral", "Enter your username below!");
      return;
    }

    if (!/^[a-zA-Z]+$/.test(val)) {
      setRobotState("angry", "Wrong Format, only use Eng Letter A-Z");
    } else {
      setRobotState("neutral", `Identifying entity: ${val}...`);
    }
  });

  // Email Focus Handling
  emailInput.addEventListener("focus", () => {
    setRobotState("neutral", "Provide your registered email address.");
  });

  // Password Real-Time Checklist Validation
  function updateRequirement(element, isMet, labelText) {
    if (isMet) {
      element.innerHTML = `<i class="fa-solid fa-check tick"></i> ${labelText}`;
    } else {
      element.innerHTML = `<i class="fa-solid fa-xmark cross"></i> ${labelText}`;
    }
  }

  function validatePasswordRequirements(val) {
    const hasLength = val.length >= 8;
    const hasSpecial = /[^a-zA-Z0-9]/.test(val);
    const hasUppercase = /[A-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);

    updateRequirement(reqLength, hasLength, "At least 8 Characters");
    updateRequirement(reqSpecial, hasSpecial, "At least 1 Special Character");
    updateRequirement(reqUppercase, hasUppercase, "At least 1 Upper Case");
    updateRequirement(reqNumber, hasNumber, "At least 1 Number");

    return hasLength && hasSpecial && hasUppercase && hasNumber;
  }

  passwordInput.addEventListener("focus", () => {
    setRobotState(null, "Hiding my eyes for your security!");
    mainRobot.classList.add("password-mode");

    if (robotHead) robotHead.style.transform = "none";

    leftPassChecklist.classList.remove("hidden");
    rightPassChecklist.classList.remove("hidden");
    validatePasswordRequirements(passwordInput.value);
  });

  passwordInput.addEventListener("input", (e) => {
    validatePasswordRequirements(e.target.value);
  });

  passwordInput.addEventListener("blur", () => {
    mainRobot.classList.remove("password-mode");
    setRobotState("neutral", "Beep Boop! I'm watching again.");

    leftPassChecklist.classList.add("hidden");
    rightPassChecklist.classList.add("hidden");
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

  // Authentication Checking Logic
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const usernameVal = usernameInput.value.trim();
    const emailVal = emailInput.value.trim().toLowerCase();
    const passwordVal = passwordInput.value;

    const isValidUsername = /^[a-zA-Z]+$/.test(usernameVal);
    const isValidEmail = emailVal.endsWith("@gmail.com") && emailVal.length > 10;
    const isValidPassword = validatePasswordRequirements(passwordVal);

    if (!isValidUsername) {
      setRobotState("angry", "Wrong Format, only use Eng Letter A-Z");
      loginCard.classList.remove("shake");
      void loginCard.offsetWidth;
      loginCard.classList.add("shake");
      return;
    }

    if (isValidUsername && isValidEmail && isValidPassword) {
      setRobotState("happy", "Access Granted! Welcome to TechTitan Hub!");

      setTimeout(() => {
        loginSection.classList.add("hidden");
        appDashboard.classList.remove("hidden");
        userDisplayName.textContent = usernameVal;
      }, 1000);

    } else {
      setRobotState("angry", "Access Denied! Check your credentials format.");

      loginCard.classList.remove("shake");
      void loginCard.offsetWidth;
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
    showCustomConfirm({
      title: "Logout?",
      message: "Are you sure you want to log out of TechTitan Hub?",
      iconType: "warning",
      confirmText: "Logout",
      confirmClass: "modal-btn-warning",
      onConfirm: () => {
        appDashboard.classList.add("hidden");
        loginSection.classList.remove("hidden");
        loginForm.reset();
        triggerWaveAndSmile("both", true);
      }
    });
  });

  // State Management for Waving Animation
  let waveTimeout = null;

  /**
   * Triggers the robot waving, smiling, and welcome message display.
   * @param {string} handSide - 'left', 'right', or 'both'
   * @param {boolean} isAutoWave - True if triggered automatically on page load.
   */
  function triggerWaveAndSmile(handSide = 'both', isAutoWave = false) {
    if (waveTimeout) {
      clearTimeout(waveTimeout);
    }

    // Set robot happy/waving mood
    setRobotState("waving", "Beep Boop! Welcome to TechTitan! Great to see you!");

    // Apply hand wave animation classes
    mainRobot.classList.remove("waving-left", "waving-right");
    if (handSide === 'left') {
      mainRobot.classList.add("waving-left");
    } else if (handSide === 'right') {
      mainRobot.classList.add("waving-right");
    } else {
      mainRobot.classList.add("waving-left", "waving-right");
    }

    // Auto wave stops after 5 seconds
    if (isAutoWave) {
      waveTimeout = setTimeout(() => {
        stopWaveAndSmile();
      }, 5000);
    } else {
      // Manual hand taps stop waving after 3.5 seconds
      waveTimeout = setTimeout(() => {
        stopWaveAndSmile();
      }, 3500);
    }
  }

  /**
   * Resets the robot from waving to normal idle state.
   */
  function stopWaveAndSmile() {
    mainRobot.classList.remove("waving-left", "waving-right", "mood-waving");
    setRobotState("neutral", "Beep Boop! Welcome to TechTitan. Who goes there?");
  }

  // 1. Hand Tap Event Listeners
  const leftHand = document.getElementById('left-hand');
  const rightHand = document.getElementById('right-hand');

  if (leftHand) {
    leftHand.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerWaveAndSmile('left', false);
    });
  }

  if (rightHand) {
    rightHand.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerWaveAndSmile('right', false);
    });
  }

  // 2. Automatic Wave on Website Entry (5 Seconds)
  triggerWaveAndSmile('both', true);
});

// ================= MODULE NAVIGATION CONTROLLER =================
function openModule(moduleName) {
  const tabContents = document.querySelectorAll(".tab-content");
  const navBtns = document.querySelectorAll(".nav-btn");
  
  navBtns.forEach((b) => b.classList.remove("active"));
  tabContents.forEach((tab) => {
    tab.classList.add("hidden-tab");
    tab.classList.remove("active-tab");
  });
  if (moduleName === "Disaster Alert System") {
        document.getElementById("disaster-tab").classList.remove("hidden-tab");
        document.getElementById("disaster-tab").classList.add("active-tab");
        initDisasterAlertSystem();
    }

  else if (moduleName === "Calculator & Tools") {
    document.getElementById("calculator-tab").classList.remove("hidden-tab");
    document.getElementById("calculator-tab").classList.add("active-tab");
  } else if (moduleName === "Food Ordering") {
    document.getElementById("food-tab").classList.remove("hidden-tab");
    document.getElementById("food-tab").classList.add("active-tab");
    initFoodModule();
  } else if (moduleName === "Clothing Store") {
    document.getElementById("clothing-tab").classList.remove("hidden-tab");
    document.getElementById("clothing-tab").classList.add("active-tab");
    initClothingModule();

    } else if (moduleName === "Money Manager") {
    document.getElementById("money-tab").classList.remove("hidden-tab");
    document.getElementById("money-tab").classList.add("active-tab");
    initMoneyManager();

  } else if (moduleName === "Digital Bookstore" || moduleName === "Digital Book Store") {
    document.getElementById("books-tab").classList.remove("hidden-tab");
    document.getElementById("books-tab").classList.add("active-tab");
    initBooksModule();

  }
else if (moduleName === "AI Assistant Chat") {
  document.getElementById("ai-chat-tab").classList.remove("hidden-tab");
  document.getElementById("ai-chat-tab").classList.add("active-tab");
  initAIChatModule();


  } else function showToast(message) {
  const toast = document.getElementById("toast-notification");
  const toastMsg = document.getElementById("toast-message");

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function openModule(moduleName) {
  // REPLACE alert(...) WITH THIS:
  showToast(`Navigating to ${moduleName}...`);

  // Existing module routing logic...
}
}

function closeModule() {
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((tab) => {
    tab.classList.add("hidden-tab");
    tab.classList.remove("active-tab");
  });
  
  const homeTab = document.getElementById("home-tab");
  homeTab.classList.remove("hidden-tab");
  homeTab.classList.add("active-tab");
}

// ================= CALCULATOR & TOOLS LOGIC =================
function switchCalcSubtab(tabId) {
  document.querySelectorAll(".sub-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".calc-box").forEach(box => {
    box.classList.add("hidden-calc");
    box.classList.remove("active-calc");
  });

  event.currentTarget.classList.add("active");
  const selected = document.getElementById(tabId);
  selected.classList.remove("hidden-calc");
  selected.classList.add("active-calc");
}

// Standard Calculator
let stdExpression = "";
function stdAppend(val) {
  const display = document.getElementById("std-display");
  if (display.value === "0" && val !== ".") stdExpression = "";
  stdExpression += val;
  display.value = stdExpression;
}
function stdClear() {
  stdExpression = "";
  document.getElementById("std-display").value = "0";
}
function stdBackspace() {
  stdExpression = stdExpression.slice(0, -1);
  document.getElementById("std-display").value = stdExpression || "0";
}
function stdCalculate() {
  try {
    stdExpression = eval(stdExpression).toString();
    document.getElementById("std-display").value = stdExpression;
  } catch (e) {
    document.getElementById("std-display").value = "Error";
    stdExpression = "";
  }
}

// Scientific Calculator
let sciExpression = "";
function stdAppendSci(val) {
  const display = document.getElementById("sci-display");
  if (display.value === "0" && val !== ".") sciExpression = "";
  sciExpression += val;
  display.value = sciExpression;
}
function sciClear() {
  sciExpression = "";
  document.getElementById("sci-display").value = "0";
}
function sciFunc(func) {
  try {
    let val = parseFloat(document.getElementById("sci-display").value || "0");
    let res = 0;
    if (func === 'sin') res = Math.sin(val);
    if (func === 'cos') res = Math.cos(val);
    if (func === 'tan') res = Math.tan(val);
    if (func === 'sqrt') res = Math.sqrt(val);
    if (func === 'pow') res = Math.pow(val, 2);
    if (func === 'log') res = Math.log10(val);
    sciExpression = res.toString();
    document.getElementById("sci-display").value = sciExpression;
  } catch (e) {
    document.getElementById("sci-display").value = "Error";
  }
}
function sciCalculate() {
  try {
    sciExpression = eval(sciExpression).toString();
    document.getElementById("sci-display").value = sciExpression;
  } catch (e) {
    document.getElementById("sci-display").value = "Error";
    sciExpression = "";
  }
}

// BMI Calculator
function calculateBMI() {
  const w = parseFloat(document.getElementById("bmi-weight").value);
  const h = parseFloat(document.getElementById("bmi-height").value) / 100;
  if (!w || !h) return alert("Please enter valid weight and height.");
  const bmi = (w / (h * h)).toFixed(1);
  let status = "";
  if (bmi < 18.5) status = "Underweight";
  else if (bmi < 24.9) status = "Normal weight";
  else if (bmi < 29.9) status = "Overweight";
  else status = "Obese";
  document.getElementById("bmi-result").innerText = `BMI: ${bmi} (${status})`;
}

// Age Calculator
function calculateAge() {
  const dobInput = document.getElementById("age-dob").value;
  if (!dobInput) return alert("Select a date.");
  const dob = new Date(dobInput);
  const diff = new Date(Date.now() - dob.getTime());
  const age = Math.abs(diff.getUTCFullYear() - 1970);
  document.getElementById("age-result").innerText = `Age: ${age} years old`;
}

// Unit Converter
function convertUnit() {
  const val = parseFloat(document.getElementById("unit-val").value);
  const from = document.getElementById("unit-from").value;
  const to = document.getElementById("unit-to").value;
  if (isNaN(val)) return;

  const rates = { m: 1, km: 0.001, cm: 100, ft: 3.28084 };
  const inMeters = val / rates[from];
  const converted = (inMeters * rates[to]).toFixed(4);
  document.getElementById("unit-result").innerText = `${val} ${from} = ${converted} ${to}`;
}

// Currency Converter
function convertCurrency() {
  const amt = parseFloat(document.getElementById("curr-amt").value);
  const from = document.getElementById("curr-from").value;
  const to = document.getElementById("curr-to").value;
  
  const ratesInUSD = { USD: 1.0, EUR: 0.92, GBP: 0.79, JPY: 155.0,MMK:3663 };
  const amtUSD = amt / ratesInUSD[from];
  const converted = (amtUSD * ratesInUSD[to]).toFixed(2);
  document.getElementById("curr-result").innerText = `${amt} ${from} = ${converted} ${to}`;
}

// Percentage Calculator
function calculatePercentage() {
  const pct = parseFloat(document.getElementById("pct-val").value);
  const total = parseFloat(document.getElementById("pct-total").value);
  if (isNaN(pct) || isNaN(total)) return;
  const res = (pct / 100) * total;
  document.getElementById("pct-result").innerText = `${pct}% of ${total} is ${res.toFixed(2)}`;
}

// ================= FOOD ORDERING MODULE LOGIC =================
let foodItems = JSON.parse(localStorage.getItem("foodItems")) || [
  { id: 1, name: "Burger", category: "Fast Food", price: 8.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300", desc: "Delicious beef burger" },
  { id: 2, name: "Pepperoni Pizza", category: "Italian", price: 12.50, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300", desc: "Cheesy pepperoni pizza" },

      { id: 52, name: "Chicken Biryani", category: "India", price: 9.00, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyP6VoZWRb3kU-WHH67G1TXsjSUi1GI1PBYUn5Tpk-rAI9MiaBaL1e7NPAekMgooI&s=10&ec=121924532"},
      { id: 53, name: "Samosa", category: "India", price: 3.00, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300", desc: "Fried pastry filled with spiced potatoes" },
      { id: 54, name: "Garlic Naan & Curry", category: "India", price: 6.50, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300", desc: "Indian flatbread served with curry sauce" },
      { id: 55, name: "Masala Dosa", category: "India", price: 5.50, image: "https://www.cookwithmanali.com/wp-content/uploads/2020/05/Masala-Dosa.jpg"},
      { id: 56, name: "Chicken Tikka Masala", category: "India", price: 10.50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbG30fOARmH_Rxwcp_eBY2FelkOaZKXJx0o9BmxISu93uwXpXsmLU5TklXcs9x0-E&s=10&ec=121924532"},
      { id: 57, name: "Pani Puri", category: "India", price: 4.00, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw2NsB6TLNUmn7-ctfWWQys5JsoGOHtPghZzOlqfkaMFCv4Owwim5790agbCisnvXV5kMEUxpK42znNyjnn8CIuXZG6Y3NvshB5rNu8lRt8GuEQE8kQ3ujJMaPOjhnvg&s=10&ec=121924532"},
      { id: 58, name: "Rogan Josh", category: "India", price: 11.50, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300", desc: "Kashmiri style aromatic lamb curry" },
      { id: 59, name: "Palak Paneer", category: "India", price: 8.00, image: "https://d17df4wezm00f0.cloudfront.net/recipe-images/b04e7a7c-3920-4956-bada-0cff3804e414/1765136999263.jpg"},
      { id: 60, name: "Gulab Jamun", category: "India", price: 3.50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0PgbS925reWb4CyQV-2MXgevF-Po5yV5eQgy2Hv1wV6HArjlNxZgIXn3zVsNRYuGHIACPtCARVoZGsOrhTR95WjlPF9v5LIw&s&ec=121924532"},
      // --- Italy ---
      { id: 61, name: "Margherita Pizza", category: "Italy", price: 11.00, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300", desc: "Classic Neapolitan pizza with basil and mozzarella" },
      { id: 62, name: "Carbonara", category: "Italy", price: 12.00, image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300", desc: "Spaghetti with egg, cheese, and guanciale" },
      { id: 63, name: "Lasagna", category: "Italy", price: 13.00, image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=300", desc: "Layered pasta with meat sauce and cheese" },
      { id: 64, name: "Mushroom Risotto", category: "Italy", price: 11.50, image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=300", desc: "Creamy arborio rice with wild mushrooms" },
      { id: 65, name: "Gelato", category: "Italy", price: 4.00, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLD6bjr81fUKOrX_BnkTkxeN4bLCZwS8v-1374nXBrI7_FrpStE-z8nCoW3lFvyWfu&s=10&ec=121924532"},
      { id: 66, name: "Tiramisu", category: "Italy", price: 5.50, image: "https://staticcookist.akamaized.net/wp-content/uploads/sites/22/2024/09/THUMB-VIDEO-2_rev1-56.jpeg"},
      { id: 67, name: "Ravioli", category: "Italy", price: 11.00, image: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/spinach_and_ricotta_21673_16x9.jpg"},
      { id: 68, name: "Arancini", category: "Italy", price: 5.00, image: "https://www.sandravalvassori.com/wp-content/uploads/2025/12/Arancini-2150.jpg"},
      { id: 69, name: "Potato Gnocchi", category: "Italy", price: 10.00, image: "https://images.immediate.co.uk/production/volatile/sites/30/2008/01/Gnocchi-59587b6.jpg"},
      { id: 70, name: "Focaccia", category: "Italy", price: 4.50, image: "https://www.kingarthurbaking.com/sites/default/files/styles/featured_image_sm/public/2025-10/Big-%26-Bubbly-Sourdough-Focaccia_2025_Shot-1_5328.jpg?itok=CHJTMYn4"},
      // --- Mexico ---
      { id: 71, name: "Beef Tacos", category: "Mexico", price: 7.00, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300", desc: "Mexican corn tortillas filled with spiced beef" },
      { id: 72, name: "Guacamole & Chips", category: "Mexico", price: 5.00, image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTLYJ55ZELTKbJgo0q_K3UOa08Q_s2xElp24aidTgxFhAERpa-e"},
      { id: 73, name: "Quesadilla", category: "Mexico", price: 7.50, image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=300", desc: "Grilled tortilla filled with melted cheese" },
      { id: 74, name: "Burrito", category: "Mexico", price: 8.50, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300", desc: "Wrapped flour tortilla with beans and meat" },
      { id: 75, name: "Enchiladas", category: "Mexico", price: 9.00, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqHIvxILbv1LQDBAObclnp6eUAPiTfTUAv9qdkiTbSqX-P3E2kHiSyWtTp0I_KR28&s=10&ec=121924532"},
      { id: 76, name: "Churros", category: "Mexico", price: 4.00, image: "https://images.unsplash.com/photo-1624371414361-e670edf4898d?w=300", desc: "Fried dough sticks dusted with cinnamon sugar" },
      { id: 77, name: "Nachos Loaded", category: "Mexico", price: 6.50, image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300", desc: "Tortilla chips with cheese and jalapeños" },
      { id: 78, name: "Mole Poblano", category: "Mexico", price: 10.00, image: "https://www.mexicoinmykitchen.com/wp-content/uploads/2009/02/Mole-Poblano-Recipe-3.jpg"},
      { id: 79, name: "Tamales", category: "Mexico", price: 5.50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0PFicXZ5yVsPYd6Qs2ogce4T6YXX1g3yYwtVldaPPABpE84X49vlcahgVutisGWg&s=10&ec=121924532"},
      { id: 80, name: "Ceviche", category: "Mexico", price: 9.50, image: "https://cravingsjournal.com/wp-content/uploads/2018/08/ceviche-con-leche-de-tigre-2.jpg"},
      // --- Vietnam ---
      { id: 81, name: "Pho Bo", category: "Vietnam", price: 7.50, image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300", desc: "Vietnamese beef noodle soup with herbs" },
      { id: 82, name: "Banh Mi", category: "Vietnam", price: 5.00, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfAaDKT9tYp5NCPlqTfr-rZqc9B9wLsMqJW6k9hYJhExetxUEE9TM0wnepNgbjToHe&s=10&ec=121924532"},
      { id: 83, name: "Goi Cuon", category: "Vietnam", price: 4.50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtClR07qajoh02nUEic8M3cK7zsDCmiSjUhW5WEVzyZ7peu9dXOmyD5l8nv5_6l7Cu&s=10&ec=121924532"},
      { id: 84, name: "Bun Cha", category: "Vietnam", price: 7.00, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbLsHZLFPmXOybGVEyS2OPCW9-NbKghKvSZpjXI6LLzYyn6pKf3YVmnyueCaVz-Bpk7V9-4FTZxMynTnywEQ2sszryyWCr-usyjHTdhlUNQjjmqKusRzkIQJPxJyDxmA&s=10&ec=121924532"},
      { id: 85, name: "Banh Xeo", category: "Vietnam", price: 6.00, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU_DzAzJfU1NvZoBqLBPQuJzAAFcMNTwGBUk1wCDUOzMr0pdrb53MSoz28oGWajkYh-2uprKl5mi9_OnbaLs7dj27gIRdt1jEnGkRTNasdLV6KC8RNqLAFsY8vkRpZ&s=10&ec=121924532"},
      { id: 86, name: "Cao Lau", category: "Vietnam", price: 6.50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT17x8Y7v9Am-j4kDkl4VMeFG3OvqWwqBwy0VRHC9K2AjsteasFKRIyuXB8zrVflonvwFU02AfL949kHsJkSije3it00FYfo2UAlUFJ82ALRF6-UVvg3YKrm-rid7SZ&s=10&ec=121924532"},
      { id: 87, name: "Egg Coffee", category: "Vietnam", price: 3.50, image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/vietnamese-egg-coffee-7823671.jpg"},
      // --- France ---
      { id: 88, name: "Butter Croissant", category: "France", price: 3.00, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300", desc: "Flaky buttery French pastry" },
      { id: 89, name: "Escargot", category: "France", price: 12.00, image: "https://lindseyeatsla.com/wp-content/uploads/2025/04/escargot-recipe-500x500.jpg"},

      { id: 91, name: "Macarons", category: "France", price: 6.00, image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=300", desc: "Colorful sweet French almond meringue cookies" },

      // --- USA / Fast Food ---
      { id: 92, name: "Cheeseburger", category: "Fast Food", price: 8.99, image: "https://www.recipetineats.com/tachyon/2022/08/Stack-of-cheeseburgers.jpg"},
      { id: 93, name: "Buffalo Chicken Wings", category: "Fast Food", price: 9.50, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=300", desc: "Spicy glazed deep-fried chicken wings" },
      { id: 94, name: "BBQ Pork Ribs", category: "Fast Food", price: 15.00, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrWoudDm9XjEuHUav1OgcL13BFl-9XmWa28fZowZJDi0rrvA2YPK9cJBJnt-CBHQT3&s=10&ec=121924532"},
      // --- Spain ---
      { id: 95, name: "Seafood Paella", category: "Spain", price: 14.00, image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=300", desc: "Spanish saffron rice with mixed seafood" },
      { id: 96, name: "Spanish Tapas", category: "Spain", price: 8.00, image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=300", desc: "Assorted Spanish savory appetizers" },

      // --- Turkey ---
      { id: 97, name: "Doner Kebab", category: "Turkey", price: 7.00, image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=300", desc: "Turkish style roasted meat wrapped in flatbread" },
      { id: 98, name: "Baklava", category: "Turkey", price: 4.50, image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=300", desc: "Sweet pastry with nuts and honey syrup" },

      // --- Indonesia & Malaysia ---
      { id: 99, name: "Nasi Goreng", category: "Indonesia", price: 6.00, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300", desc: "Indonesian fried rice topped with fried egg" },
      { id: 100, name: "Nasi Lemak", category: "Malaysia", price: 5.50, image: "https://t4.ftcdn.net/jpg/06/00/30/59/360_F_600305943_MgOsurgt6EjaRgh6402AHxgh5Q9Q6e4K.jpg"}
     
    
    ];
  
let foodCart = [];

function initFoodModule() {
  renderFoodItems();
  renderFoodCart();
}

function renderFoodItems() {
  const grid = document.getElementById("food-grid");
  const search = document.getElementById("food-search") ? document.getElementById("food-search").value.toLowerCase() : "";
  if (!grid) return;
  grid.innerHTML = "";

  foodItems
    .filter(item => item.name.toLowerCase().includes(search) || item.category.toLowerCase().includes(search))
    .forEach(item => {
      const isInCart = foodCart.some(c => c.id === item.id);
      const buttonHtml = isInCart
        ? `<button class="btn-store-add added" onclick="addFoodToCart(${item.id})"><i class="fa-solid fa-check"></i> Added</button>`
        : `<button class="btn-store-add" onclick="addFoodToCart(${item.id})">Add to Cart</button>`;

      grid.innerHTML += `
        <div class="store-card">
          <img src="${item.image}" alt="${item.name}">
          <div class="store-card-body">
            <h4 class="store-card-title">${item.name}</h4>
            <span class="store-card-badge">${item.category}</span>
            <p class="store-card-desc">${item.desc}</p>
            <div class="store-card-price">$${item.price.toFixed(2)}</div>
            ${buttonHtml}
          </div>
        </div>
      `;
    });
}

function addFoodToCart(id) {
  const item = foodItems.find(f => f.id === id);
  if (!item) return;
  const existing = foodCart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    foodCart.push({ ...item, qty: 1 });
  }
  renderFoodCart();
  renderFoodItems(); // Refresh buttons
}

function updateFoodQty(id, delta) {
  const item = foodCart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    foodCart = foodCart.filter(c => c.id !== id);
  }
  renderFoodCart();
  renderFoodItems(); // Refresh buttons
}

function renderFoodCart() {
  const cartContainer = document.getElementById("food-cart-items");
  const totalEl = document.getElementById("food-cart-total");
  if (!cartContainer || !totalEl) return;

  if (foodCart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart-state">
        <span class="empty-icon">🛒</span>
        <p>Your food cart is empty</p>
        <small>Add delicious items to get started!</small>
      </div>
    `;
    totalEl.innerText = "$0.00";
    return;
  }

  cartContainer.innerHTML = "";
  let total = 0;

  foodCart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    cartContainer.innerHTML += `
      <div class="cart-item">
        <div class="cart-item-left">
          <img src="${item.image}" class="cart-thumb" alt="${item.name}">
          <div class="cart-details">
            <span class="cart-item-title">${item.name}</span>
            <span class="cart-item-unit-price">$${item.price.toFixed(2)} × ${item.qty}</span>
            <span class="cart-item-subtotal">$${subtotal.toFixed(2)}</span>
          </div>
        </div>
        <div class="cart-qty-ctrl">
          <button onclick="updateFoodQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateFoodQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `;
  });

  totalEl.innerText = `$${total.toFixed(2)}`;
}

// ================= CLOTHING STORE MODULE LOGIC =================
let clothesItems = [
  { id: 101, name: "Casual Denim Jacket", category: "Outerwear", price: 49.99, image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=300", desc: "Classic denim look." },
  { id: 102, name: "Cotton T-Shirt", category: "Apparel", price: 19.99, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300", desc: "100% organic cotton." },
  {
        id: 1,
        name: "Classic White T-Shirt",
        category: "T-Shirt",
        price: 12.00,
        image: "https://i.pinimg.com/736x/4b/8d/ef/4b8defc6de754e732bf68493c4e8792a.jpg",
        desc: "Simple and comfortable cotton white T-shirt"
      },
{
        id: 2,
        name: "Black Oversized T-Shirt",
        category: "T-Shirt",
        price: 15.00,
        image: "https://i.pinimg.com/736x/3e/94/9d/3e949de8e9bc3287d50bd1702216751a.jpg",
        desc: "Relaxed oversized black T-shirt"
      },

      {
        id: 3,
        name: "Graphic Print T-Shirt",
        category: "T-Shirt",
        price: 18.00,
        image: "https://i.pinimg.com/736x/21/97/23/2197239d02c0f61ce8e825eae6dc28ec.jpg",
        desc: "Stylish graphic print casual T-shirt"
      },

      {
        id: 4,
        name: "Basic Blue T-Shirt",
        category: "T-Shirt",
        price: 13.00,
        image: "https://i.pinimg.com/736x/bd/a0/ca/bda0ca23a55ffd326145a2dbb8e139f4.jpg",
        desc: "Classic blue cotton everyday T-shirt"
      },

      {
        id: 5,
        name: "Pink Casual T-Shirt",
        category: "T-Shirt",
        price: 14.00,
        image: "https://i.pinimg.com/736x/d2/c6/72/d2c672913aa5f36a53e66796562f36f4.jpg",
        desc: "Soft pink casual T-shirt"
      },

      {
        id: 6,
        name: "Striped T-Shirt",
        category: "T-Shirt",
        price: 16.00,
        image: "https://i.pinimg.com/1200x/6b/a8/f4/6ba8f4d1f81b80f268f24de3228c7b84.jpg",
        desc: "Classic striped casual T-shirt"
      },

      {
        id: 7,
        name: "Green Cotton T-Shirt",
        category: "T-Shirt",
        price: 13.50,
        image: "https://i.pinimg.com/1200x/b1/4a/35/b14a35b9ed4e4d7683ac033722a3e659.jpg",
        desc: "Comfortable green cotton T-shirt"
      },

      {
        id: 8,
        name: "Oversized Beige T-Shirt",
        category: "T-Shirt",
        price: 17.00,
        image: "https://i.pinimg.com/736x/b4/22/51/b42251dc3499ebce69ad0a14ea678294.jpg",
        desc: "Trendy beige oversized T-shirt"
      },

      {
        id: 9,
        name: "Sport T-Shirt",
        category: "T-Shirt",
        price: 20.00,
        image: "https://i.pinimg.com/1200x/61/da/85/61da85d2daee15ed27fbd82b71a06782.jpg",
        desc: "Lightweight T-shirt for sports and exercise"
      },

      {
        id: 10,
        name: "Long Sleeve T-Shirt",
        category: "T-Shirt",
        price: 19.00,
        image: "https://i.pinimg.com/1200x/e5/f2/55/e5f255aa7e98a63264b61bfd0c27a2e3.jpg",
        desc: "Comfortable long sleeve casual T-shirt"
      },


      // Shirts (11 - 20)

      {
        id: 11,
        name: "White Formal Shirt",
        category: "Shirt",
        price: 25.00,
        image: "https://i.pinimg.com/736x/ac/70/a9/ac70a9c27ff95ed27216e8c942a06e62.jpg",
        desc: "Clean white shirt for formal occasions"
      },

      {
        id: 12,
        name: "Black Formal Shirt",
        category: "Shirt",
        price: 28.00,
        image: "https://i.pinimg.com/1200x/cc/01/72/cc0172550d770ffb6a5ea277c7919331.jpg",
        desc: "Elegant black formal shirt"
      },

      {
        id: 13,
        name: "Denim Shirt",
        category: "Shirt",
        price: 30.00,
        image: "https://i.pinimg.com/736x/eb/71/f5/eb71f5c1498f7a976aed00ff139811f8.jpg",
        desc: "Classic denim shirt for casual outfits"
      },

      {
        id: 14,
        name: "Blue Casual Shirt",
        category: "Shirt",
        price: 24.00,
        image: "https://i.pinimg.com/736x/2f/c9/5e/2fc95ead84db9834eeab4df3d391455e.jpg",
        desc: "Comfortable blue casual shirt"
      },

      {
        id: 15,
        name: "Flannel Check Shirt",
        category: "Shirt",
        price: 27.00,
        image: "https://i.pinimg.com/1200x/7a/24/fa/7a24fa994efee9290e6d144e3e14a01b.jpg",
        desc: "Warm checkered flannel shirt"
      },
{
        id: 16,
        name: "Linen Shirt",
        category: "Shirt",
        price: 32.00,
        image: "https://i.pinimg.com/736x/e0/05/48/e00548c39c0abf2df591b7fa22f690c0.jpg",
        desc: "Lightweight linen shirt for warm weather"
      },

      {
        id: 17,
        name: "Oversized Shirt",
        category: "Shirt",
        price: 29.00,
        image: "https://i.pinimg.com/736x/5e/8e/36/5e8e367958ad74c6619fe88c8bdf09ea.jpg",
        desc: "Modern oversized casual shirt"
      },

      {
        id: 18,
        name: "Striped Formal Shirt",
        category: "Shirt",
        price: 31.00,
        image: "https://i.pinimg.com/736x/8c/3e/ea/8c3eeafc0928598298d36ec4fdcc7dc8.jpg",
        desc: "Smart striped shirt for office wear"
      },

      {
        id: 19,
        name: "Brown Casual Shirt",
        category: "Shirt",
        price: 26.00,
        image: "https://i.pinimg.com/736x/dd/f7/56/ddf7562ff1020a1bbc826252fb92fc32.jpg",
        desc: "Stylish brown casual shirt"
      },

      {
        id: 20,
        name: "Green Oxford Shirt",
        category: "Shirt",
        price: 33.00,
        image: "https://i.pinimg.com/1200x/17/1b/bd/171bbdb502ed3901edc6556b058b9ba8.jpg",
        desc: "Classic Oxford shirt with a modern look"
      },


      // Dresses (21 - 30)

      {
        id: 21,
        name: "Floral Summer Dress",
        category: "Dress",
        price: 35.00,
        image: "https://i.pinimg.com/736x/4f/88/04/4f8804ad7e3b4da8616294d240428a8a.jpg",
        desc: "Beautiful floral dress for summer"
      },

      {
        id: 22,
        name: "Black Midi Dress",
        category: "Dress",
        price: 42.00,
        image: "https://i.pinimg.com/736x/ea/49/3f/ea493f79579af9ee09199e236414e49f.jpg",
        desc: "Elegant black midi dress"
      },

      {
        id: 23,
        name: "White Casual Dress",
        category: "Dress",
        price: 38.00,
        image: "https://i.pinimg.com/736x/46/41/52/4641526f7ce603217303f9f4a9594aa5.jpg",
        desc: "Simple white casual dress"
      },

      {
        id: 24,
        name: "Pink Party Dress",
        category: "Dress",
        price: 48.00,
        image: "https://i.pinimg.com/1200x/c6/d9/fa/c6d9fa9c7438cc1d31b79e639070fe01.jpg",
        desc: "Beautiful pink dress for special occasions"
      },

      {
        id: 25,
        name: "Blue Maxi Dress",
        category: "Dress",
        price: 45.00,
        image: "https://i.pinimg.com/736x/64/5d/37/645d3706925b4d05db2adc88b0e585f6.jpg",
        desc: "Long blue maxi dress"
      },

      {
        id: 26,
        name: "Casual Midi Dress",
        category: "Dress",
        price: 39.00,
        image: "https://i.pinimg.com/736x/e9/43/96/e9439683530e851ced41e0c0a48b5b81.jpg",
        desc: "Comfortable midi dress for everyday wear"
      },

      {
        id: 27,
        name: "Elegant Evening Dress",
        category: "Dress",
        price: 55.00,
        image: "https://i.pinimg.com/736x/ca/13/44/ca1344154bd1bfdf041407c5772d8479.jpg",
        desc: "Elegant dress for evening events"
      },

      {
        id: 28,
        name: "Green Floral Dress",
        category: "Dress",
        price: 41.00,
        image: "https://i.pinimg.com/736x/f9/b1/f2/f9b1f2ee0eea2a256d9e7772e98a1aab.jpg",
        desc: "Fresh floral green summer dress"
      },

      {
        id: 29,
        name: "Beige Wrap Dress",
        category: "Dress",
        price: 44.00,
        image: "https://i.pinimg.com/1200x/1a/46/9a/1a469a3fbc0aa6e642e6869031806003.jpg",
        desc: "Stylish beige wrap dress"
      },
{
        id: 30,
        name: "Denim Dress",
        category: "Dress",
        price: 40.00,
        image: "https://i.pinimg.com/1200x/15/9f/61/159f617248169511fb98047bdd901c60.jpg",
        desc: "Casual denim dress for everyday style"
      },


      // Pants (31 - 40)

      {
        id: 31,
        name: "Classic Blue Jeans",
        category: "Pants",
        price: 35.00,
        image: "https://i.pinimg.com/1200x/f6/08/8a/f6088a13ad24d6f4b8ff285879ebca14.jpg",
        desc: "Classic blue denim jeans"
      },

      {
        id: 32,
        name: "Black Skinny Jeans",
        category: "Pants",
        price: 38.00,
        image: "https://i.pinimg.com/1200x/d2/54/21/d254211b4d66b73cd9047e786f902a73.jpg",
        desc: "Modern black skinny jeans"
      },

      {
        id: 33,
        name: "Wide Leg Pants",
        category: "Pants",
        price: 32.00,
        image: "https://i.pinimg.com/736x/95/19/d3/9519d3174ea6cf3543c6d2d3ddaf32cc.jpg",
        desc: "Comfortable wide leg trousers"
      },

      {
        id: 34,
        name: "Beige Cargo Pants",
        category: "Pants",
        price: 36.00,
        image: "https://i.pinimg.com/736x/56/4f/2c/564f2cb8a909364b80bf4f7df16cc7d8.jpg",
        desc: "Trendy beige cargo pants"
      },

      {
        id: 35,
        name: "Black Cargo Pants",
        category: "Pants",
        price: 39.00,
        image: "https://i.pinimg.com/1200x/12/54/8a/12548ab42b4e32399cc8d9b30871c81e.jpg",
        desc: "Stylish black cargo pants"
      },

      {
        id: 36,
        name: "Casual Gray Pants",
        category: "Pants",
        price: 30.00,
        image: "https://i.pinimg.com/736x/c1/82/d8/c182d87ac7fafefb421d2dd0912b7149.jpg",
        desc: "Comfortable gray everyday pants"
      },

      {
        id: 37,
        name: "White Wide Leg Pants",
        category: "Pants",
        price: 34.00,
        image: "https://i.pinimg.com/236x/f9/65/14/f965144d44ec0f8cf28cf6b6ff6e2752.jpg",
        desc: "Clean white wide leg pants"
      },

      {
        id: 38,
        name: "Denim Straight Jeans",
        category: "Pants",
        price: 37.00,
        image: "https://i.pinimg.com/736x/27/49/dc/2749dcf7763fe518c6c0a2b2ddf299be.jpg",
        desc: "Classic straight fit denim jeans"
      },

      {
        id: 39,
        name: "Brown Trousers",
        category: "Pants",
        price: 33.00,
        image: "https://i.pinimg.com/736x/b9/d7/2a/b9d72a910f5ba060c4dc50d20694a0f3.jpg",
        desc: "Smart brown trousers"
      },

      {
        id: 40,
        name: "Relaxed Fit Jeans",
        category: "Pants",
        price: 40.00,
        image: "https://i.pinimg.com/1200x/c3/83/63/c38363fadcf9c4c2e7ebd29130f174c8.jpg",
        desc: "Relaxed fit jeans for everyday comfort"
      },


      // Skirts (41 - 50)

      {
        id: 41,
        name: "Black Mini Skirt",
        category: "Skirt",
        price: 25.00,
        image: "https://i.pinimg.com/736x/0d/8f/24/0d8f2482e8ea49d8aa2d261122f5a4e4.jpg",
        desc: "Simple black mini skirt"
      },

      {
        id: 42,
        name: "Denim Mini Skirt",
        category: "Skirt",
        price: 28.00,
        image: "https://i.pinimg.com/1200x/a2/ea/21/a2ea21b8532af9bc337c556387fc13c6.jpg",
        desc: "Casual denim mini skirt"
      },

      {
        id: 43,
        name: "Pleated Skirt",
        category: "Skirt",
        price: 30.00,
        image: "https://i.pinimg.com/736x/62/73/63/6273637d76d7c22dde5cc46847b761d6.jpg",
        desc: "Classic pleated skirt"
      },
{
        id: 44,
        name: "Long Black Skirt",
        category: "Skirt",
        price: 32.00,
        image: "https://i.pinimg.com/736x/68/ca/d1/68cad1807b5acbb030f361d2ebc99d4e.jpg",
        desc: "Elegant long black skirt"
      },
      {
        id: 45,
        name: "Floral Midi Skirt",
        category: "Skirt",
        price: 34.00,
        image: "https://i.pinimg.com/736x/ad/42/98/ad4298342506005356433cc70f62a2da.jpg",
        desc: "Beautiful floral midi skirt"
      },

      {
        id: 46,
        name: "White Tennis Skirt",
        category: "Skirt",
        price: 27.00,
        image: "https://i.pinimg.com/736x/72/3d/6a/723d6a3ca5df8af3950a8bd0d4d001d4.jpg",
        desc: "Sporty white tennis skirt"
      },

      {
        id: 47,
        name: "Brown Pleated Skirt",
        category: "Skirt",
        price: 31.00,
        image: "https://i.pinimg.com/1200x/ef/19/cc/ef19cca2de1bd846f64a1525baeaf8d1.jpg",
        desc: "Stylish brown pleated skirt"
      },

      {
        id: 48,
        name: "Beige Long Skirt",
        category: "Skirt",
        price: 33.00,
        image: "https://i.pinimg.com/736x/2e/9c/81/2e9c812f966ccf9bce946d1623cb009f.jpg",
        desc: "Simple beige long skirt"
      },

      {
        id: 49,
        name: "Satin Midi Skirt",
        category: "Skirt",
        price: 36.00,
        image: "https://i.pinimg.com/736x/2e/d3/ed/2ed3ed13d238251aa9710def1efe3182.jpg",
        desc: "Elegant satin midi skirt"
      },

      {
        id: 50,
        name: "Casual Cotton Skirt",
        category: "Skirt",
        price: 29.00,
        image: "https://i.pinimg.com/736x/2b/65/34/2b6534e4155c8030f977b820801f5b56.jpg",
        desc: "Comfortable cotton skirt for everyday wear"
      },
      { id: 50, name: "Hoodie", category: "Hoodies", price: 35.00, image: "https://img.freepik.com/premium-photo/hoodie-photography-isolated-background_981650-7167.jpg",desc: "Comfortable casual hoodie for everyday wear." },
      { id: 51, name: "Sweatshirt", category: "Sweatshirts", price: 34.00, image: "https://static.vecteezy.com/system/resources/previews/034/434/448/non_2x/blank-sweatshirt-for-mockup-ai-generated-free-photo.jpg", desc: "SSimple sweatshirt with a comfort."},
      { id: 52, name: "Cardigan", category: "Knitwear", price: 32.00, image: "https://i.pinimg.com/736x/9d/e5/6b/9de56b0f054059dae4a28be302ff35e6.jpg", desc: "Soft cardigan for comfortable layering." },
      { id: 53, name: "Sweater", category: "Knitwear", price: 38.00, image: "https://static.vecteezy.com/system/resources/thumbnails/035/302/238/small_2x/ai-generated-3d-model-of-men-s-sweater-photo.jpg", desc: "Classic knitted sweater for everyday outfits." },
      { id: 54, name: "Bomber Jacket", category: "Jackets", price: 38.00, image: "https://tse1.explicit.bing.net/th/id/OIP.KLl36_-pyb_TqvbuOdyxnQHaLo?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", desc: "Modern bomber jacket for casual outfits." },
      { id: 55, name: "Denim Jacket", category: "Jackets", price: 52.00, image: "https://tse2.mm.bing.net/th/id/OIP.WpeZTreUiJSEK2YFCptsegHaKl?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", desc: "Classic denim jacket for everyday wear." },
      { id: 56, name: "Blazer", category: "Blazers", price: 60.00, image: "https://tse3.mm.bing.net/th/id/OIP.wQAUDPMECSKwKtFYWgcruAHaJP?r=0&w=736&h=919&rs=1&pid=ImgDetMain&o=7&rm=3", desc: "Smart blazer for formal and casual outfits." },
      { id: 57, name: "Trench Coat", category: "Coats", price: 70.00, image: "https://tse3.mm.bing.net/th/id/OIP.DfE_gkkwx-54kWV0CfZjIgHaLH?r=0&w=768&h=1152&rs=1&pid=ImgDetMain&o=7&rm=3", desc: "Long modern trench coat." },
      { id: 58, name: "Puffer Jacket", category: "Jackets", price: 65.00, image: "https://tse4.mm.bing.net/th/id/OIP.X6GEwlqWcRXs5MbTpEmKTQHaKr?r=0&w=798&h=1150&rs=1&pid=ImgDetMain&o=7&rm=3", desc: "Comfortable padded jacket." },
      { id: 69, name: "Windbreaker", category: "Jackets", price: 48.00, image: "https://th.bing.com/th/id/OIP.Ex6kLBcF835LNjO3M3eEOwHaHa?w=194&h=194&c=7&r=0&o=7&pid=1.7&rm=3", desc: "Lightweight windbreaker jacket." },
      { id: 60, name: "Polo Shirt", category: "Shirts", price: 25.00, image: "https://tse3.mm.bing.net/th/id/OIP.AZrmS0uRNQx6hzWNmkFcyAHaJ4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", desc: "Classic polo shirt for casual outfits." },
      { id: 61, name: "Henley Shirt", category: "Shirts", price: 23.00, image: "https://th.bing.com/th/id/OIP.tA0s44DTte81wAcABbKQ5wHaJ4?w=184&h=245&c=7&r=0&o=7&pid=1.7&rm=3", desc: "Casual Henley shirt with button neckline." },
      { id: 62, name: "Rugby Shirt", category: "Shirts", price: 28.00, image: "https://tse3.mm.bing.net/th/id/OIP.HRM1scAAgx4l4JXto3EVBgHaJ4?r=0&pid=ImgDet&w=191&h=254&c=7&o=7&rm=3", desc: "Sporty casual rugby shirt." },
      { id: 63, name: "Flannel Shirt", category: "Shirts", price: 30.00, image: "https://tse4.mm.bing.net/th/id/OIP.2rZFvrx9-kJA-nMZz1fpygHaHa?r=0&pid=ImgDet&w=182&h=182&c=7&o=7&rm=3", desc: "Comfortable flannel shirt for casual wear." },
      { id: 64, name: "Tank Top", category: "Tops", price: 17.00, image: "https://tse1.explicit.bing.net/th/id/OIP.r5iTbOHQA_L2B7W3AcOlAAHaJ3?r=0&pid=ImgDet&w=191&h=254&c=7&o=7&rm=3", desc: "Simple sleeveless tank top." },
      { id: 65, name: "Peplum Top", category: "Tops", price: 24.00, image: "https://tse1.explicit.bing.net/th/id/OIP.qbU2ec0EOcu-hhmq_a8QogHaLH?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", desc: "Modern peplum top with a fitted waist." },
      { id: 66, name: "Wrap Top", category: "Tops", price: 26.00, image: "https://tse2.mm.bing.net/th/id/OIP.prrQ3YDxuy1_4loD1NDkSwHaJ4?r=0&pid=ImgDet&w=182&h=242&c=7&o=7&rm=3", desc: "Stylish wrap top with adjustable fitting." },
      { id: 67, name: "Knit Vest", category: "Vests", price: 29.00, image: "https://tse1.explicit.bing.net/th/id/OIP.r_O11o6yJIloe1mk_TFz6gHaJ4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", desc: "Knit vest for modern layered outfits." },
      { id: 68, name: "Denim Vest", category: "Vests", price: 35.00, image: "https://tse1.mm.bing.net/th/id/OIP.5RURixSluPC8jWsX4hhUAQHaIy?r=0&pid=ImgDet&w=191&h=225&c=7&o=7&rm=3", desc: "Casual denim vest."},
      { id: 69, name: "Cargo Pants", category: "Pants", price: 42.00, image: "https://tse1.explicit.bing.net/th/id/OIP.Tq9wfhgFfchINrEXOAeR0AHaJ2?r=0&pid=ImgDet&w=182&h=241&c=7&o=7&rm=3", desc: "Modern cargo pants with side pockets." },
{ id: 70, name: "Jogger Pants", category: "Pants", price: 35.00, image: "https://tse4.mm.bing.net/th/id/OIP.L5_8eJUsX9nuFk852oZ_OQHaKl?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", desc: "Comfortable jogger pants." },
      { id: 71, name: "Chino Pants", category: "Pants", price: 38.00, image: "https://tse2.mm.bing.net/th/id/OIP.Y0nsqe4dv7Y4nt1ViEm0DwAAAA?r=0&pid=ImgDet&w=157&h=196&c=7&o=7&rm=3", desc: "Smart casual chino pants." },
      { id: 72, name: "Palazzo Pants", category: "Pants", price: 40.00, image: "https://tse2.mm.bing.net/th/id/OIP.Lb9oZynikfMrIOPHJd6IKgHaHa?r=0&pid=ImgDet&w=157&h=157&c=7&o=7&rm=3", desc: "Wide-leg palazzo pants." },
      { id: 73, name: "Track Pants", category: "Pants", price: 32.00, image: "https://assets.adidas.com/images/w_1880,f_auto,q_auto/ca64043056f741218425b46f7c2f0dce_9366/JW1227_41_detail.jpg", desc: "Sporty track pants for everyday comfort." },
      { id: 74, name: "Leggings", category: "Pants", price: 28.00, image: "https://www.bing.com/th/id/OIP.3wb_q9y7Ktlps6jToePXtQHaJ4?w=110&h=128&c=8&rs=1&qlt=90&o=6&pid=ImgAns&rm=2", desc: "Stretch leggings for comfortable movement." },
      
      { id: 76, name: "Parachute Pants", category: "Pants", price: 45.00, image: "https://tse3.mm.bing.net/th/id/OIP.NOOfEFB213Gw3p3FZXgRGQHaJ3?r=0&pid=ImgDet&w=157&h=208&c=7&o=7&rm=3", desc: "Loose modern parachute pants." },
      { id: 77, name: "Bermuda Shorts", category: "Shorts", price: 30.00, image: "https://th.bing.com/th/id/R.5809b0ba34ab926018abbbb4584e1c73?rik=qwGZAZMohPzrBw&riu=http%3a%2f%2fdgfoutlet.com%2fcdn%2fshop%2ffiles%2f24237530_fpx.webp%3fv%3d1706773842&ehk=8iJ%2bUXFq%2bW1J0Fy8seBfYwm1EDBBE%2bqclXH7MBS5ykw%3d&risl=&pid=ImgRaw&r=0", desc: "Relaxed Bermuda shorts." },
      { id: 78, name: "Cargo Short", category: "Shorts", price:29.00, image: "https://th.bing.com/th/id/R.7cedd87dbe08c81357c1db28cb64646a?rik=wGk7J%2bVrLPV55g&riu=http%3a%2f%2fimg.ltwebstatic.com%2fimages3_pi%2f2022%2f12%2f28%2f16721983739c82f5a38cffc0bded3d5b50e351c351.jpg&ehk=o3x9WCsBOoXkZPPhUCvoLMuDj7QPbvxN2iagw8Vmjqs%3d&risl=&pid=ImgRaw&r=0",desc: "Casual cargo shorts with pockets." },
      { id: 79, name: "Denim Skort", category: "Skorts", price: 33.00, image: "https://ymijeans.com/cdn/shop/products/R14768_M36_3_a5146445-99d7-45f5-be80-3e49429c034a_1400x.jpg?v=1697645631", desc: "Denim skort combining skirt and shorts" },
      { id: 80, name: "Wrap Skirt", category: "Skirts", price: 32.00, image: "https://i.pinimg.com/736x/b3/da/0b/b3da0ba3d1eb1e364ebacbc1b0961211.jpg", desc: "Modern wrap skirt." },
      { id: 81, name: "A-Line Skirts", category: "Skirts", price: 30.00, image: "https://media.fashonation.com/wp-content/uploads/2025/03/03113625/images-13.jpeg", desc: "Classic A-line skirt" },
      { id: 82, name:"Cargo Skirt", category: "Skirts", price: 35.00, image: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/272e11e80b884aa39305f8f049c4752f~tplv-dx0w9n1ysr-resize-jpeg:800:800.jpeg?from=1826719393", desc: "Modern cargo skirt" },
      { id: 83, name: "Denim Midi Skirt", category: "Skirts", price: 37.00, image: "https://tse2.mm.bing.net/th/id/OIP.gOXUB5piLPqP3bS2zSyQMAHaKX?r=0&pid=ImgDet&w=181&h=253&c=7&dpr=1.3&o=7&rm=3", desc: "Casual denim midi skirt." },
      { id: 84, name: "Pleated Skirt", category: "Skirts", price: 34.00, image: "https://tse3.mm.bing.net/th/id/OIP.j0A89TgfGHEMtVVaMgOP9wHaJ3?r=0&pid=ImgDet&w=181&h=241&c=7&dpr=1.3&o=7&rm=3", desc: "Classic pleated skirt." },
      { id: 85, name : "Shirt Dress", category: "Dresses", price: 42.0, image: "https://n.nordstrommedia.com/it/b5fd1cdc-10a5-4750-9b53-21a0665dc004.jpeg?w=780&h=1170&crop=pad&dpr=2", desc: "Casual shirt dress" },
{ id: 86, name: "Maxi Dress", category: "Dresses", price: 48.00, image: "https://tse1.mm.bing.net/th/id/OIP.DOMIQQvhARpQr04uC7LuuwHaJn?r=0&pid=ImgDet&w=181&h=235&c=7&dpr=1.3&o=7&rm=3", desc: "Long modern maxi dress." },
      { id: 87, name: "Midi Dress", category: "Dresses", price: 45.00, image: "https://tse2.mm.bing.net/th/id/OIP.3VyzxpJI1R3_XVvTpgaY_gHaJQ?r=0&pid=ImgDet&w=181&h=226&c=7&dpr=1.3&o=7&rm=3", desc: "Elegant everyday midi dress." },
      { id: 88, name: "Denim Dress", category: "Dresses", price: 36.00, image: "https://cdn.sosandar.com/media/catalog/product/cache/0ad62aa88f50338ba969372be71afacb/w/e/web_2401_104_s24dd024in0007_104_057.jpg", desc: "Casual denim dress." },
      { id: 89, name: "Shirt Maxi Dress", category: "Dresses", price: 50.00, image: "https://i.pinimg.com/originals/22/59/22/225922ff378933486ebcfc0bb04fa924.jpg", desc: "Long shirt-style dress." },
      { id: 90, name: "Jumpsuit", category: "One-Piece", price: 52.00, image: "https://tse3.mm.bing.net/th/id/OIP.-s7x2cKJFJxDB_cjiIfhNQAAAA?r=0&pid=ImgDet&w=181&h=258&c=7&dpr=1.3&o=7&rm=3", desc: "Modern one-piece jumpsuit." },
      { id: 91, name: "Denim Jumpsuit", category: "One-Piece", price: 58.00, image: "https://tse3.mm.bing.net/th/id/OIP.cWt9vH-v8jx6k4aWANw1VQHaLH?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", desc: "Casual denim jumpsuit" },
      { id: 92, name: "Romber", category: "One-Piece", price: 38.00, image: "https://tse4.mm.bing.net/th/id/OIP.q4cwZcRNRxfAqFjMwXCudgHaLW?r=0&pid=ImgDet&w=181&h=277&c=7&dpr=1.3&o=7&rm=3", desc: "Simple casual romper." },
      { id: 93, name: "Tunic", category: "Tops", price: 30.00, image: "https://tse1.explicit.bing.net/th/id/OIP.5EE_aaLRQAl62l5UrtrawwHaLH?r=0&w=1000&h=1500&rs=1&pid=ImgDetMain&o=7&rm=3", desc: "Long comfortable tunic top." },
      { id: 94, name: "Kaftan", category: "Dresses", price: 40.00, image: "https://tse1.explicit.bing.net/th/id/OIP.BhNotoTuX5SjbOM5EooX4gHaLU?r=0&pid=ImgDet&w=181&h=276&c=7&dpr=1.3&o=7&rm=3", desc: "Loose modern kaftan dress." },
      { id: 95, name: "Sweater Vest", category: "Vests", price: 31.00, image: "https://tse3.mm.bing.net/th/id/OIP.dBolr0gqsWdCm-skIKW8JwHaJQ?r=0&pid=ImgDet&w=181&h=226&c=7&dpr=1.3&o=7&rm=3", desc: "Classic sweater vest." },
      { id: 96, name: "Formal Vest", category: "Vests", price: 42.00, image: "https://tse1.explicit.bing.net/th/id/OIP.prbYh9CmtsoVpkzmzKtL1wHaJ3?r=0&pid=ImgDet&w=181&h=240&c=7&dpr=1.3&o=7&rm=3", desc: "Tailored formal vest." },
      { id: 97, name: "Co-ord Set", category: "Sets", price: 55.00, image: "https://n.nordstrommedia.com/it/5db8d342-8d3b-420c-8d22-e112b2bff84a.jpeg?h=368&w=240&dpr=2", desc: "Matching modern clothing set." },
      { id: 98, name: "Linen Set", category: "Sets", price: 58.00, image: "https://n.nordstrommedia.com/it/49b8b665-6636-418a-814b-1d8ad52561d8.jpeg?h=368&w=240&dpr=2", desc: "Lightweight linen clothing set." },
      { id: 99, name: "Long Coat", category: "Coats", price: 68.00, image: "https://i.etsystatic.com/5609612/r/il/3ba463/3435637161/il_fullxfull.3435637161_ed8x.jpg", desc: "Minimal long coat." },
      { id: 100, name: "Leather Jacket", category: "Jackets", price: 72.00, image: "https://www.urbanfashionstudio.com/wp-content/uploads/2022/10/alice-genuine-leather-sport-women-jacket-claret-red-3.jpg", desc: "Classic leather jacket." }

];
let clothesCart = [];

function initClothingModule() {
  renderClothesItems();
  renderClothesCart();
}

function renderClothesItems() {
  const grid = document.getElementById("clothes-grid");
  const search = document.getElementById("clothes-search") ? document.getElementById("clothes-search").value.toLowerCase() : "";
  if (!grid) return;
  grid.innerHTML = "";

  clothesItems
    .filter(item => item.name.toLowerCase().includes(search) || item.category.toLowerCase().includes(search))
    .forEach(item => {
      const isInCart = clothesCart.some(c => c.id === item.id);
      const buttonHtml = isInCart
        ? `<button class="btn-store-add added" onclick="addToClothesCart(${item.id})"><i class="fa-solid fa-check"></i> Added</button>`
        : `<button class="btn-store-add" onclick="addToClothesCart(${item.id})">Add to Cart</button>`;

      grid.innerHTML += `
        <div class="store-card">
          <img src="${item.image}" alt="${item.name}">
          <div class="store-card-body">
            <h4 class="store-card-title">${item.name}</h4>
            <span class="store-card-badge">${item.category}</span>
            <p class="store-card-desc">${item.desc}</p>
            <div class="store-card-price">$${item.price.toFixed(2)}</div>
            ${buttonHtml}
          </div>
        </div>
      `;
    });
}

function addToClothesCart(id) {
  const item = clothesItems.find(c => c.id === id);
  if (!item) return;
  const existing = clothesCart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    clothesCart.push({ ...item, qty: 1 });
  }
  renderClothesCart();
  renderClothesItems(); // Refresh buttons
}

function updateClothesQty(id, delta) {
  const item = clothesCart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    clothesCart = clothesCart.filter(c => c.id !== id);
  }
  renderClothesCart();
  renderClothesItems(); // Refresh buttons
}


function renderClothesCart() {
  const cartContainer = document.getElementById("clothes-cart-items");
  const totalEl = document.getElementById("clothes-cart-total");
  if (!cartContainer || !totalEl) return;

  if (clothesCart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart-state">
        <span class="empty-icon">🛍️</span>
        <p>Your clothing cart is empty</p>
        <small>Browse items to add them to your cart!</small>
      </div>
    `;
    totalEl.innerText = "$0.00";
    return;
  }

  cartContainer.innerHTML = "";
  let total = 0;

  clothesCart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    cartContainer.innerHTML += `
      <div class="cart-item">
        <div class="cart-item-left">
          <img src="${item.image}" class="cart-thumb" alt="${item.name}">
          <div class="cart-details">
            <span class="cart-item-title">${item.name}</span>
            <span class="cart-item-unit-price">$${item.price.toFixed(2)} × ${item.qty}</span>
            <span class="cart-item-subtotal">$${subtotal.toFixed(2)}</span>
          </div>
        </div>
        <div class="cart-qty-ctrl">
          <button onclick="updateClothesQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateClothesQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `;
  });

  totalEl.innerText = `$${total.toFixed(2)}`;
}

// ================= DIGITAL BOOKSTORE MODULE LOGIC =================
let bookItems = [
 // ==================== PROGRAMMING ====================

{ id: 201, name: "Clean Code", category: "Programming", author: "Robert C. Martin", price: 29.99, image: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg", desc: "Handbook of Agile Software Craftsmanship." },

{ id: 202, name: "The Pragmatic Programmer", category: "Programming", author: "Andrew Hunt", price: 34.50, image: "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg", desc: "Your Journey To Mastery." },

{ id: 203, name: "Design Patterns", category: "Programming", author: "Erich Gamma et al.", price: 42.00, image: "https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg", desc: "Elements of Reusable Object-Oriented Software." },

{ id: 204, name: "Refactoring", category: "Programming", author: "Martin Fowler", price: 38.99, image: "https://covers.openlibrary.org/b/isbn/9780134757599-L.jpg", desc: "Improving the Design of Existing Code." },

{ id: 205, name: "You Don't Know JS Yet", category: "Programming", author: "Kyle Simpson", price: 24.95, image: "https://covers.openlibrary.org/b/isbn/9781647862206-L.jpg", desc: "Get Started & ES6 & Beyond." },

{ id: 206, name: "Introduction to Algorithms", category: "Programming", author: "Thomas H. Cormen", price: 65.00, image: "https://covers.openlibrary.org/b/isbn/9780262046305-L.jpg", desc: "Comprehensive guide to modern algorithms." },

{ id: 207, name: "Structure and Interpretation of Computer Programs", category: "Programming", author: "Harold Abelson", price: 45.00, image: "https://covers.openlibrary.org/b/isbn/9780262510875-L.jpg", desc: "Foundational computer science principles." },

{ id: 208, name: "Code Complete", category: "Programming", author: "Steve McConnell", price: 39.99, image: "https://covers.openlibrary.org/b/isbn/9780735619678-L.jpg", desc: "A Practical Handbook of Software Construction." },

{ id: 209, name: "Grokking Algorithms", category: "Programming", author: "Aditya Bhargava", price: 27.50, image: "https://covers.openlibrary.org/b/isbn/9781617292231-L.jpg", desc: "An illustrated guide for programmers." },

{ id: 210, name: "Head First Design Patterns", category: "Programming", author: "Eric Freeman", price: 31.99, image: "https://covers.openlibrary.org/b/isbn/9780596007126-L.jpg", desc: "A Brain-Friendly Guide." },

{ id: 211, name: "Effective Java", category: "Programming", author: "Joshua Bloch", price: 36.00, image: "https://covers.openlibrary.org/b/isbn/9780134685991-L.jpg", desc: "Best practices for the Java platform." },

{ id: 212, name: "Python Crash Course", category: "Programming", author: "Eric Matthes", price: 25.00, image: "https://covers.openlibrary.org/b/isbn/9781593279288-L.jpg", desc: "A Hands-On, Project-Based Introduction." },

{ id: 213, name: "Designing Data-Intensive Applications", category: "Programming", author: "Martin Kleppmann", price: 44.99, image: "https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg", desc: "The Big Ideas Behind Reliable Systems." },

{ id: 214, name: "Clean Architecture", category: "Programming", author: "Robert C. Martin", price: 32.50, image: "https://covers.openlibrary.org/b/isbn/9780134494166-L.jpg", desc: "A Craftsman's Guide to Software Structure." },

{ id: 215, name: "The Clean Coder", category: "Programming", author: "Robert C. Martin", price: 28.00, image: "https://covers.openlibrary.org/b/isbn/9780137081073-L.jpg", desc: "A Code of Conduct for Professional Programmers." },


// ==================== BUSINESS ====================

{ id: 301, name: "The Lean Startup", category: "Business", author: "Eric Ries", price: 22.00, image: "https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg", desc: "How Today's Entrepreneurs Use Continuous Innovation." },

{ id: 302, name: "Zero to One", category: "Business", author: "Peter Thiel", price: 18.50, image: "https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg", desc: "Notes on Startups, or How to Build the Future." },

{ id: 303, name: "Good to Great", category: "Business", author: "Jim Collins", price: 25.00, image: "https://covers.openlibrary.org/b/isbn/9780066620992-L.jpg", desc: "Why Some Companies Make the Leap and Others Don't." },

{ id: 304, name: "Atomic Habits", category: "Business", author: "James Clear", price: 20.00, image: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg", desc: "An Easy & Proven Way to Build Good Habits." },

{ id: 305, name: "Rich Dad Poor Dad", category: "Business", author: "Robert T. Kiyosaki", price: 16.99, image: "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg", desc: "What the Rich Teach Their Kids About Money." },

{ id: 306, name: "The Personal MBA", category: "Business", author: "Josh Kaufman", price: 24.00, image: "https://covers.openlibrary.org/b/isbn/9781591845577-L.jpg", desc: "Master the Art of Business." },

{ id: 307, name: "Thinking, Fast and Slow", category: "Business", author: "Daniel Kahneman", price: 21.00, image: "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg", desc: "Insightful exploration of human judgment." },

{ id: 308, name: "Start with Why", category: "Business", author: "Simon Sinek", price: 19.99, image: "https://covers.openlibrary.org/b/isbn/9781591846444-L.jpg", desc: "How Great Leaders Inspire Everyone to Take Action." },

{ id: 309, name: "The Hard Thing About Hard Things", category: "Business", author: "Ben Horowitz", price: 23.50, image: "https://covers.openlibrary.org/b/isbn/9780062273208-L.jpg", desc: "Building a Business When There Are No Easy Answers." },

{ id: 310, name: "Shoe Dog", category: "Business", author: "Phil Knight", price: 17.99, image: "https://covers.openlibrary.org/b/isbn/9781501135927-L.jpg", desc: "A Memoir by the Creator of Nike." },

{ id: 311, name: "Principles", category: "Business", author: "Ray Dalio", price: 28.00, image: "https://covers.openlibrary.org/b/isbn/9781501124020-L.jpg", desc: "Life and Work Principles." },

{ id: 312, name: "Deep Work", category: "Business", author: "Cal Newport", price: 18.00, image: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg", desc: "Rules for Focused Success in a Distracted World." },

{ id: 313, name: "The Intelligent Investor", category: "Business", author: "Benjamin Graham", price: 22.99, image: "https://covers.openlibrary.org/b/isbn/9780060555665-L.jpg", desc: "The Definitive Book on Value Investing." },

{ id: 314, name: "Blue Ocean Strategy", category: "Business", author: "W. Chan Kim", price: 26.00, image: "https://covers.openlibrary.org/b/isbn/9781625274496-L.jpg", desc: "How to Create Uncontested Market Space." },

{ id: 315, name: "The E-Myth Revisited", category: "Business", author: "Michael E. Gerber", price: 16.50, image: "https://covers.openlibrary.org/b/isbn/9780887307287-L.jpg", desc: "Why Most Small Businesses Don't Work." },


// ==================== SCIENCE ====================

{ id: 401, name: "A Brief History of Time", category: "Science", author: "Stephen Hawking", price: 18.00, image: "https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg", desc: "From the Big Bang to Black Holes." },

{ id: 402, name: "Sapiens", category: "Science", author: "Yuval Noah Harari", price: 22.50, image: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg", desc: "A Brief History of Humankind." },

{ id: 403, name: "Cosmos", category: "Science", author: "Carl Sagan", price: 19.99, image: "https://covers.openlibrary.org/b/isbn/9780349107035-L.jpg", desc: "Exploring the Universe and Civilization." },

{ id: 404, name: "The Selfish Gene", category: "Science", author: "Richard Dawkins", price: 17.50, image: "https://covers.openlibrary.org/b/isbn/9780198788607-L.jpg", desc: "Evolutionary Biology Perspective." },

{ id: 405, name: "Astrophysics for People in a Hurry", category: "Science", author: "Neil deGrasse Tyson", price: 15.00, image: "https://covers.openlibrary.org/b/isbn/9780393609394-L.jpg", desc: "Essential guide to the cosmos." },

{ id: 406, name: "The Gene: An Intimate History", category: "Science", author: "Siddhartha Mukherjee", price: 21.00, image: "https://covers.openlibrary.org/b/isbn/9781476733500-L.jpg", desc: "The story of genetic science." },

{ id: 407, name: "The Elegant Universe", category: "Science", author: "Brian Greene", price: 18.99, image: "https://covers.openlibrary.org/b/isbn/9780393338102-L.jpg", desc: "Superstrings, Hidden Dimensions, and Ultimate Theory." },

{ id: 408, name: "What If?", category: "Science", author: "Randall Munroe", price: 20.00, image: "https://covers.openlibrary.org/b/isbn/9780544272996-L.jpg", desc: "Serious Scientific Answers to Absurd Questions." },

{ id: 409, name: "The Order of Time", category: "Science", author: "Carlo Rovelli", price: 16.50, image: "https://covers.openlibrary.org/b/isbn/9780735216105-L.jpg", desc: "A profound look at physics and time." },

{ id: 410, name: "Guns, Germs, and Steel", category: "Science", author: "Jared Diamond", price: 19.00, image: "https://covers.openlibrary.org/b/isbn/9780393317558-L.jpg", desc: "The Fates of Human Societies." },

{ id: 411, name: "The Body", category: "Science", author: "Bill Bryson", price: 18.50, image: "https://covers.openlibrary.org/b/isbn/9780804176989-L.jpg", desc: "A Guide for Occupants." },

{ id: 412, name: "I Contain Multitudes", category: "Science", author: "Ed Yong", price: 17.00, image: "https://covers.openlibrary.org/b/isbn/9780399180989-L.jpg", desc: "The Microbes Within Us and a Grand View of Life." },

{ id: 413, name: "Silent Spring", category: "Science", author: "Rachel Carson", price: 14.99, image: "https://covers.openlibrary.org/b/isbn/9780618249060-L.jpg", desc: "The classic environmental science text." },

{ id: 414, name: "Immune", category: "Science", author: "Philipp Dettmer", price: 24.00, image: "https://covers.openlibrary.org/b/isbn/9780593241318-L.jpg", desc: "A Journey into the Mysterious System That Keeps You Alive." },

{ id: 415, name: "The Origin of Species", category: "Science", author: "Charles Darwin", price: 12.99, image: "https://covers.openlibrary.org/b/isbn/9780451529060-L.jpg", desc: "The foundational work of evolutionary biology." },


// ==================== EDUCATION ====================

{ id: 501, name: "How Children Learn", category: "Education", author: "John Holt", price: 16.00, image: "https://covers.openlibrary.org/b/isbn/9780201407282-L.jpg", desc: "Understanding the natural learning process." },

{ id: 502, name: "Pedagogy of the Oppressed", category: "Education", author: "Paulo Freire", price: 15.50, image: "https://covers.openlibrary.org/b/isbn/9780826412768-L.jpg", desc: "Critical pedagogy and social transformation." },

{ id: 503, name: "Mindset: The New Psychology of Success", category: "Education", author: "Carol S. Dweck", price: 18.00, image: "https://covers.openlibrary.org/b/isbn/9780345472328-L.jpg", desc: "Growth vs fixed mindsets in learning." },

{ id: 504, name: "Make It Stick", category: "Education", author: "Peter C. Brown", price: 21.00, image: "https://covers.openlibrary.org/b/isbn/9780674729018-L.jpg", desc: "The Science of Successful Learning." },

{ id: 505, name: "Teach Like a Champion", category: "Education", author: "Doug Lemov", price: 29.95, image: "https://covers.openlibrary.org/b/isbn/9781119716122-L.jpg", desc: "Techniques for effective teaching." },

{ id: 506, name: "The Courage to Teach", category: "Education", author: "Parker J. Palmer", price: 22.00, image: "https://covers.openlibrary.org/b/isbn/9780787901054-L.jpg", desc: "Exploring the Inner Landscape of a Teacher's Life." },

{ id: 507, name: "Democracy and Education", category: "Education", author: "John Dewey", price: 14.00, image: "https://covers.openlibrary.org/b/isbn/9780029320603-L.jpg", desc: "An Introduction to the Philosophy of Education." },

{ id: 508, name: "Why Don't Students Like School?", category: "Education", author: "Daniel T. Willingham", price: 24.50, image: "https://covers.openlibrary.org/b/isbn/9781119715668-L.jpg", desc: "A Cognitive Scientist Answers Questions." },

{ id: 509, name: "The First 100 Days of School", category: "Education", author: "Harry K. Wong", price: 26.00, image: "https://covers.openlibrary.org/b/isbn/9780962936060-L.jpg", desc: "How to Be an Effective Teacher." },

{ id: 510, name: "Creative Schools", category: "Education", author: "Ken Robinson", price: 17.50, image: "https://covers.openlibrary.org/b/isbn/9780143108061-L.jpg", desc: "The Grassroots Revolution That's Transforming Education." },

{ id: 511, name: "Emile, or On Education", category: "Education", author: "Jean-Jacques Rousseau", price: 13.99, image: "https://covers.openlibrary.org/b/isbn/9780465019312-L.jpg", desc: "A treatise on the nature of education." },

{ id: 512, name: "Visible Learning", category: "Education", author: "John Hattie", price: 35.00, image: "https://covers.openlibrary.org/b/isbn/9780415476188-L.jpg", desc: "A Synthesis of Over 800 Meta-Analyses." },

{ id: 513, name: "Differentiated Instruction", category: "Education", author: "Carol Ann Tomlinson", price: 27.00, image: "https://covers.openlibrary.org/b/isbn/9781416611868-L.jpg", desc: "Meeting the Needs of All Learners." },

{ id: 514, name: "The Montessori Method", category: "Education", author: "Maria Montessori", price: 12.50, image: "https://covers.openlibrary.org/b/isbn/9780805206357-L.jpg", desc: "Scientific pedagogy as applied to child education." },

{ id: 515, name: "Assessment for Learning", category: "Education", author: "Paul Black", price: 23.00, image: "https://covers.openlibrary.org/b/isbn/9780335212970-L.jpg", desc: "Putting It into Practice." },


// ==================== FICTION ====================

{ id: 601, name: "1984", category: "Fiction", author: "George Orwell", price: 14.99, image: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg", desc: "A dystopian social science fiction novel." },

{ id: 602, name: "To Kill a Mockingbird", category: "Fiction", author: "Harper Lee", price: 15.00, image: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg", desc: "A classic of modern American literature." },

{ id: 603, name: "The Great Gatsby", category: "Fiction", author: "F. Scott Fitzgerald", price: 12.50, image: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg", desc: "A story of ambition, obsession, and love." },

{ id: 604, name: "Pride and Prejudice", category: "Fiction", author: "Jane Austen", price: 11.99, image: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg", desc: "Classic romance novel set in rural England." },

{ id: 605, name: "The Catcher in the Rye", category: "Fiction", author: "J.D. Salinger", price: 13.50, image: "https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg", desc: "A story about teenage rebellion and angst." },

{ id: 606, name: "The Alchemist", category: "Fiction", author: "Paulo Coelho", price: 16.00, image: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg", desc: "A philosophical novel about following your dreams." },

{ id: 607, name: "Brave New World", category: "Fiction", author: "Aldous Huxley", price: 14.50, image: "https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg", desc: "A futuristic dystopian society." },

{ id: 608, name: "The Hobbit", category: "Fiction", author: "J.R.R. Tolkien", price: 17.00, image: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg", desc: "A fantasy novel about Bilbo Baggins." },

{ id: 609, name: "Fahrenheit 451", category: "Fiction", author: "Ray Bradbury", price: 13.99, image: "https://covers.openlibrary.org/b/isbn/9781451678185-L.jpg", desc: "A dystopian novel where books are banned." },

{ id: 610, name: "The Lord of the Rings", category: "Fiction", author: "J.R.R. Tolkien", price: 35.00, image: "https://covers.openlibrary.org/b/isbn/9780544003415-L.jpg", desc: "An epic high-fantasy trilogy." },

{ id: 611, name: "Dune", category: "Fiction", author: "Frank Herbert", price: 18.00, image: "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg", desc: "Science fiction epic on the desert planet Arrakis." },

{ id: 612, name: "Crime and Punishment", category: "Fiction", author: "Fyodor Dostoevsky", price: 15.99, image: "https://covers.openlibrary.org/b/isbn/9780143058144-L.jpg", desc: "Psychological masterwork exploring morality." },

{ id: 613, name: "One Hundred Years of Solitude", category: "Fiction", author: "Gabriel García Márquez", price: 16.50, image: "https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg", desc: "A landmark novel of magical realism." },

{ id: 614, name: "The Book Thief", category: "Fiction", author: "Markus Zusak", price: 14.00, image: "https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg", desc: "A story narrated by Death during WWII." },

{ id: 615, name: "Life of Pi", category: "Fiction", author: "Yann Martel", price: 15.25, image: "https://covers.openlibrary.org/b/isbn/9780156027328-L.jpg", desc: "A tale of survival at sea with a Bengal tiger." }


];

let booksCart = [];

function initBooksModule() {
  renderBookItems();
  renderBookCart();
}

function renderBookItems() {
  const grid = document.getElementById("books-grid");
  const search = document.getElementById("books-search") ? document.getElementById("books-search").value.toLowerCase() : "";
  const catFilter = document.getElementById("books-category-filter") ? document.getElementById("books-category-filter").value : "All";
  if (!grid) return;
  grid.innerHTML = "";

  bookItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search) || item.author.toLowerCase().includes(search);
      const matchesCategory = catFilter === "All" || item.category === catFilter;
      return matchesSearch && matchesCategory;
    })
    .forEach(item => {
      const isInCart = booksCart.some(c => c.id === item.id);
      const buttonHtml = isInCart
        ? `<button class="btn-store-add added" onclick="addToBooksCart(${item.id})"><i class="fa-solid fa-check"></i> Added</button>`
        : `<button class="btn-store-add" onclick="addToBooksCart(${item.id})">Add to Cart</button>`;

      grid.innerHTML += `
        <div class="store-card">
          <img src="${item.image}" alt="${item.name}">
          <div class="store-card-body">
            <h4 class="store-card-title">${item.name}</h4>
            <div class="book-card-author">By ${item.author}</div>
            <span class="store-card-badge">${item.category}</span>
            <p class="store-card-desc">${item.desc}</p>
            <div class="store-card-price">$${item.price.toFixed(2)}</div>
            ${buttonHtml}
          </div>
        </div>
      `;
    });
}

function addToBooksCart(id) {
  const item = bookItems.find(b => b.id === id);
  if (!item) return;
  const existing = booksCart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    booksCart.push({ ...item, qty: 1 });
  }
  renderBookCart();
  renderBookItems(); // Refresh buttons
}

function updateBookQty(id, delta) {
  const item = booksCart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    booksCart = booksCart.filter(c => c.id !== id);
  }
  renderBookCart();
  renderBookItems(); // Refresh buttons
}

function renderBookCart() {
  const cartContainer = document.getElementById("books-cart-items");
  const totalEl = document.getElementById("books-cart-total");
  if (!cartContainer || !totalEl) return;

  if (booksCart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart-state">
        <span class="empty-icon">📚</span>
        <p>Your bookstore cart is empty</p>
        <small>Discover books to fill up your cart!</small>
      </div>
    `;
    totalEl.innerText = "$0.00";
    return;
  }

  cartContainer.innerHTML = "";
  let total = 0;

  booksCart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    cartContainer.innerHTML += `
      <div class="cart-item">
        <div class="cart-item-left">
          <img src="${item.image}" class="cart-thumb" alt="${item.name}">
          <div class="cart-details">
            <span class="cart-item-title">${item.name}</span>
            <span class="cart-item-unit-price">$${item.price.toFixed(2)} × ${item.qty}</span>
            <span class="cart-item-subtotal">$${subtotal.toFixed(2)}</span>
          </div>
        </div>
        <div class="cart-qty-ctrl">
          <button onclick="updateBookQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateBookQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `;
  });

  totalEl.innerText = `$${total.toFixed(2)}`;
}

// ================= MULTI-STEP CHECKOUT SYSTEM LOGIC =================
let activeCheckoutCart = [];
let activeCheckoutType = "";
let currentCustomerInfo = {};

function checkoutFoodCart() {
  openCheckoutModal(foodCart, "food");
}

function checkoutClothesCart() {
  openCheckoutModal(clothesCart, "clothing");
}

function checkoutBookCart() {
  openCheckoutModal(booksCart, "books");
}

function openCheckoutModal(cartArray, type) {
  if (!cartArray || cartArray.length === 0) {
    showEmptyCartToast();
    return;
  }
  activeCheckoutCart = cartArray;
  activeCheckoutType = type;

  const modal = document.getElementById("checkoutModal");
  if (modal) {
    modal.style.display = "block";
    renderCheckoutCartStep();
    goToStep(1);
  }
}

function showEmptyCartToast() {
  let toast = document.getElementById("empty-cart-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "empty-cart-toast";
    toast.className = "empty-cart-toast";
    toast.innerHTML = `
      <span class="toast-icon">⚠️</span>
      <div class="toast-content">
        <strong>Cart is Empty</strong>
        <p>Please add at least one item before checking out.</p>
      </div>
    `;
    document.body.appendChild(toast);
  }
  
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.style.display = "none";
}



function renderCheckoutCartStep() {
  const container = document.getElementById("checkout-cart-items");
  const totalEl = document.getElementById("checkout-total-price");
  if (!container || !totalEl) return;

  container.innerHTML = "";
  let total = 0;

  activeCheckoutCart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    container.innerHTML += `
      <div class="checkout-cart-item">
        <span>${item.name} (${item.qty}x)</span>
        <strong>$${subtotal.toFixed(2)}</strong>
      </div>
    `;
  });

  totalEl.innerText = `$${total.toFixed(2)}`;
}

function proceedFromCartToPayment() {
  if (activeCheckoutCart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  goToStep(2);
}

function processCustomerInfo() {
  const name = document.getElementById("cust-name").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();
  const email = document.getElementById("cust-email").value.trim();
  const address = document.getElementById("cust-address").value.trim();
  const city = document.getElementById("cust-city").value.trim();
  const township = document.getElementById("cust-township").value.trim();
  const notes = document.getElementById("cust-notes").value.trim();

  const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked')?.value || "KBZPay";

  let fullAddress = address;
  if (township) fullAddress += `, ${township}`;
  if (city) fullAddress += `, ${city}`;

  currentCustomerInfo = { name, phone, email, address: fullAddress, paymentMethod: selectedPayment, notes };

  document.getElementById("conf-name").innerText = name;
  document.getElementById("conf-phone").innerText = phone;
  document.getElementById("conf-email").innerText = email;
  document.getElementById("conf-address").innerText = fullAddress;
  document.getElementById("conf-payment").innerText = selectedPayment;

  const confCartContainer = document.getElementById("conf-cart-summary");
  const confTotalEl = document.getElementById("conf-total-price");
  confCartContainer.innerHTML = "";
  let total = 0;

  activeCheckoutCart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    confCartContainer.innerHTML += `
      <div class="checkout-cart-item">
        <span>${item.name} (${item.qty}x)</span>
        <strong>$${subtotal.toFixed(2)}</strong>
      </div>
    `;
  });

  confTotalEl.innerText = `$${total.toFixed(2)}`;
  goToStep(4);
}

function finalizeOrder() {
  const orderId = "TT-" + Math.floor(100000 + Math.random() * 900000);
  let total = activeCheckoutCart.reduce((sum, item) => sum + item.price * item.qty, 0);

  document.getElementById("succ-order-id").innerText = orderId;
  document.getElementById("succ-name").innerText = currentCustomerInfo.name;
  document.getElementById("succ-payment").innerText = currentCustomerInfo.paymentMethod;
  document.getElementById("succ-total").innerText = `$${total.toFixed(2)}`;
  document.getElementById("succ-date").innerText = new Date().toLocaleString();

  if (activeCheckoutType === "food") {
    foodCart = [];
    renderFoodCart();
  } else if (activeCheckoutType === "clothing") {
    clothesCart = [];
    renderClothesCart();
  } else if (activeCheckoutType === "books") {
    booksCart = [];
    renderBookCart();
  }

  goToStep(5);
}

function finishCheckout() {
  closeCheckoutModal();
  
  const form = document.getElementById("customer-info-form");
  if (form) form.reset();

  // Reset modal step back to 1 for the next checkout
  goToStep(1);
}










// ================= MONEY MANAGER LOGIC =================
let transactions = [];
let monthlyBudget = 0;

function initMoneyManager() {
  const storedTx = localStorage.getItem("techTitan_transactions");
  const storedBudget = localStorage.getItem("techTitan_monthlyBudget");

  transactions = storedTx ? JSON.parse(storedTx) : [];
  monthlyBudget = storedBudget ? parseFloat(storedBudget) : 0;

  document.getElementById("mm-budget-input").value = monthlyBudget || "";
  document.getElementById("mm-date").valueAsDate = new Date();

  renderMoneyManager();
}

function saveTransactionsToStorage() {
  localStorage.setItem("techTitan_transactions", JSON.stringify(transactions));
}

function saveMonthlyBudget() {
  const inputVal = parseFloat(document.getElementById("mm-budget-input").value);
  if (isNaN(inputVal) || inputVal < 0) {
    alert("Please enter a valid budget amount.");
    return;
  }
  monthlyBudget = inputVal;
  localStorage.setItem("techTitan_monthlyBudget", monthlyBudget.toString());
  renderMoneyManager();
}

function handleTransactionSubmit(event) {
  event.preventDefault();

  const editId = document.getElementById("mm-edit-id").value;
  const type = document.getElementById("mm-type").value;
  const title = document.getElementById("mm-title").value.trim();
  const amount = parseFloat(document.getElementById("mm-amount").value);
  const category = document.getElementById("mm-category").value;
  const date = document.getElementById("mm-date").value;

  if (editId) {
    transactions = transactions.map(tx => tx.id === editId ? { id: editId, type, title, amount, category, date } : tx);
  } else {
    const newTx = {
      id: "tx_" + Date.now(),
      type,
      title,
      amount,
      category,
      date
    };
    transactions.unshift(newTx);
  }

  saveTransactionsToStorage();
  cancelEditTransaction();
  renderMoneyManager();
}

function editTransaction(id) {
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;

  document.getElementById("mm-edit-id").value = tx.id;
  document.getElementById("mm-type").value = tx.type;
  document.getElementById("mm-title").value = tx.title;
  document.getElementById("mm-amount").value = tx.amount;
  document.getElementById("mm-category").value = tx.category;
  document.getElementById("mm-date").value = tx.date;

  document.getElementById("mm-form-title").innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Transaction';
  document.getElementById("mm-submit-btn").textContent = "Update Transaction";
  document.getElementById("mm-cancel-btn").classList.remove("hidden");
}

function cancelEditTransaction() {
  document.getElementById("mm-edit-id").value = "";
  document.getElementById("mm-transaction-form").reset();
  document.getElementById("mm-date").valueAsDate = new Date();
  document.getElementById("mm-form-title").innerHTML = '<i class="fa-solid fa-plus-circle"></i> Add Transaction';
  document.getElementById("mm-submit-btn").textContent = "Save Transaction";
  document.getElementById("mm-cancel-btn").classList.add("hidden");
}

function deleteTransaction(id) {
  showCustomConfirm({
    title: "Delete Transaction?",
    message: "Are you sure you want to delete this transaction? This action cannot be undone.",
    iconType: "danger",
    confirmText: "Delete",
    confirmClass: "modal-btn-danger",
    onConfirm: () => {
      transactions = transactions.filter(t => t.id !== id);
      saveTransactionsToStorage();
      renderMoneyManager();
    }
  });
}
function renderMoneyManager() {
  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryTotals = {};

  transactions.forEach(tx => {
    if (tx.type === "Income") {
      totalIncome += tx.amount;
    } else {
      totalExpenses += tx.amount;
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    }
  });

  const totalBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0;

  document.getElementById("mm-total-balance").textContent = `$${totalBalance.toFixed(2)}`;
  document.getElementById("mm-total-income").textContent = `$${totalIncome.toFixed(2)}`;
  document.getElementById("mm-total-expenses").textContent = `$${totalExpenses.toFixed(2)}`;
  document.getElementById("mm-savings-rate").textContent = `${savingsRate}%`;

  // Budget calculations
  const remaining = monthlyBudget - totalExpenses;
  document.getElementById("mm-budget-limit").textContent = `$${monthlyBudget.toFixed(2)}`;
  document.getElementById("mm-budget-remaining").textContent = `$${remaining.toFixed(2)}`;

  const fillEl = document.getElementById("mm-budget-progress-fill");
  const warnEl = document.getElementById("mm-budget-warning");

  if (monthlyBudget > 0) {
    const pct = Math.min(100, (totalExpenses / monthlyBudget) * 100);
    fillEl.style.width = `${pct}%`;

    if (pct >= 100) {
      fillEl.className = "mm-progress-fill danger";
      warnEl.classList.remove("hidden");
      warnEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Warning: Monthly budget limit exceeded!`;
    } else if (pct >= 80) {
      fillEl.className = "mm-progress-fill warning";
      warnEl.classList.remove("hidden");
      warnEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Warning: You have reached ${pct.toFixed(0)}% of your monthly budget!`;
    } else {
      fillEl.className = "mm-progress-fill";
      warnEl.classList.add("hidden");
    }
  } else {
    fillEl.style.width = "0%";
    warnEl.classList.add("hidden");
  }

  // Render Category Breakdown Bars
  const barsContainer = document.getElementById("mm-category-bars");
  barsContainer.innerHTML = "";
  const categories = ["Food", "Transportation", "Education", "Shopping", "Bills", "Entertainment", "Health", "Other"];

  categories.forEach(cat => {
    const amt = categoryTotals[cat] || 0;
    const barPct = totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0;

    const row = document.createElement("div");
    row.className = "mm-cat-row";
    row.innerHTML = `
      <span class="mm-cat-label">${cat}</span>
      <div class="mm-cat-bar-bg">
        <div class="mm-cat-bar-fill" style="width: ${barPct}%"></div>
      </div>
      <span class="mm-cat-val">$${amt.toFixed(2)}</span>
    `;
    barsContainer.appendChild(row);
  });

  // Render Filtered Transactions
  const search = document.getElementById("mm-search-input").value.toLowerCase();
  const filterCat = document.getElementById("mm-filter-category").value;
  const filterDate = document.getElementById("mm-filter-date").value;

  const filtered = transactions.filter(tx => {
    const matchesSearch = tx.title.toLowerCase().includes(search);
    const matchesCat = filterCat === "All" || tx.category === filterCat;
    const matchesDate = !filterDate || tx.date === filterDate;
    return matchesSearch && matchesCat && matchesDate;
  });

  const listEl = document.getElementById("mm-transaction-list");
  listEl.innerHTML = "";

  if (filtered.length === 0) {
    listEl.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 20px;">No transactions found.</td></tr>`;
    return;
  }

  filtered.forEach(tx => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${tx.date}</td>
      <td><strong>${tx.title}</strong></td>
      <td><span class="store-card-badge">${tx.category}</span></td>
      <td class="${tx.type === "Income" ? "type-income" : "type-expense"}">${tx.type}</td>
      <td class="${tx.type === "Income" ? "type-income" : "type-expense"}">${tx.type === "Income" ? "+" : "-"}$${tx.amount.toFixed(2)}</td>
      <td>
        <button class="mm-action-btn mm-btn-edit" onclick="editTransaction('${tx.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button class="mm-action-btn mm-btn-delete" onclick="deleteTransaction('${tx.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    listEl.appendChild(tr);
  });
} // <-- Closing brace for renderMoneyManager()

// Standalone CSV Export Function (Global Scope)
function exportTransactionsCSV() {
  if (transactions.length === 0) {
    showCustomConfirm({
      title: "No Data to Export",
      message: "There are no transactions available to export to CSV.",
      iconType: "info",
      confirmText: "OK",
      confirmClass: "modal-btn-primary",
      onConfirm: () => {}
    });
    return;
  }

  showCustomConfirm({
    title: "Export CSV Report?",
    message: "Would you like to download a CSV(Comma-Separated Values) spreadsheet containing all current transactions?",
    iconType: "info",
    confirmText: "Download",
    confirmClass: "modal-btn-primary",
    onConfirm: () => {
      let csv = "ID,Type,Title,Amount,Category,Date\n";
      transactions.forEach(tx => {
        csv += `"${tx.id}","${tx.type}","${tx.title.replace(/"/g, '""')}",${tx.amount},"${tx.category}","${tx.date}"\n`;
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TechTitan_Transactions_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });
}

// Generic Custom Confirmation Modal Helper
function showCustomConfirm({ title, message, iconType, confirmText, confirmClass, onConfirm }) {
  const modal = document.getElementById("custom-confirm-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMsg = document.getElementById("modal-message");
  const modalIcon = document.getElementById("modal-icon");
  const btnCancel = document.getElementById("modal-btn-cancel");
  const btnConfirm = document.getElementById("modal-btn-confirm");

  modalTitle.textContent = title;
  modalMsg.textContent = message;
  
  // Icon styling
  modalIcon.className = `custom-modal-icon ${iconType || 'danger'}`;
  if (iconType === 'info') {
    modalIcon.innerHTML = '<i class="fa-solid fa-file-csv"></i>';
  } else if (iconType === 'warning') {
    modalIcon.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
  } else {
    modalIcon.innerHTML = '<i class="fa-solid fa-trash"></i>';
  }

  // Confirm button styling
  btnConfirm.textContent = confirmText || 'Confirm';
  btnConfirm.className = `modal-btn ${confirmClass || 'modal-btn-danger'}`;

  modal.classList.remove("hidden");

  // Handle Action
  const handleConfirm = () => {
    cleanup();
    onConfirm();
  };

  const handleCancel = () => {
    cleanup();
  };

  const cleanup = () => {
    modal.classList.add("hidden");
    btnConfirm.removeEventListener("click", handleConfirm);
    btnCancel.removeEventListener("click", handleCancel);
  };

  btnConfirm.addEventListener("click", handleConfirm);
  btnCancel.addEventListener("click", handleCancel);
}

// ================= AI ASSISTANT CHAT MODULE =================

// ================= GROQ AI ASSISTANT CHAT MODULE =================

// 1. API Configuration & Key Storage
const GROQ_CONFIG = {
  apiKey: localStorage.getItem("groq_api_key") || "",
  endpoint: "https://api.groq.com/openai/v1/chat/completions",
  model: "openai/gpt-oss-120b",
  storageKey: "techTitan_chat_history",
  rateLimitMs: 1500
};

// Prompt for the API key if it's not saved yet
if (!GROQ_CONFIG.apiKey) {
  const userKey = prompt("Please enter your Groq API Key to enable the AI Chat:");
  if (userKey) {
    localStorage.setItem("groq_api_key", userKey.trim());
    GROQ_CONFIG.apiKey = userKey.trim();
  }
}

let lastRequestTime = 0;
let chatHistory = [];

/**
 * Initializes the AI Chat module, loads stored messages, and scrolls to bottom.
 */
function initAIChatModule() {
  chatHistory = JSON.parse(localStorage.getItem(GROQ_CONFIG.storageKey)) || [];
  renderAIChatMessages();
}

/**
 * Formats timestamps for chat messages.
 */
function getFormattedTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Renders all stored chat history into the chat window.
 */
function renderAIChatMessages() {
  const chatBody = document.getElementById("ai-chat-body");
  if (!chatBody) return;

  if (chatHistory.length === 0) {
    chatBody.innerHTML = `
      <div class="chat-bubble ai">
        Hello! I am your TechTitan AI Assistant powered by Groq Llama 3. How can I assist you today?
        <span class="msg-timestamp">${getFormattedTimestamp()}</span>
      </div>
    `;
    return;
  }

  chatBody.innerHTML = "";
  chatHistory.forEach(msg => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${msg.sender}`;
    bubble.innerHTML = `
      ${escapeHTML(msg.text)}
      <span class="msg-timestamp">${msg.timestamp}</span>
    `;
    chatBody.appendChild(bubble);
  });

  scrollChatToBottom();
}

/**
 * Helper to escape HTML characters to prevent XSS injection.
 */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/**
 * Handles message submission from user.
 */
async function handleAIChatSubmit(event) {
  event.preventDefault();
  const inputEl = document.getElementById("ai-chat-input");
  const sendBtn = document.getElementById("ai-send-btn");
  const messageText = inputEl.value.trim();

  if (!messageText) return;

  // Rate Limit Check
  const now = Date.now();
  if (now - lastRequestTime < GROQ_CONFIG.rateLimitMs) {
    return;
  }
  lastRequestTime = now;

  // Append User Message
  const userMsg = {
    sender: "user",
    text: messageText,
    timestamp: getFormattedTimestamp()
  };
  chatHistory.push(userMsg);
  saveAIChatHistory();
  renderAIChatMessages();

  // Clear Input & Set Loading State
  inputEl.value = "";
  inputEl.disabled = true;
  sendBtn.disabled = true;

  showTypingIndicator();

  try {
    const responseText = await fetchGroqAIResponse();
    removeTypingIndicator();

    const aiMsg = {
      sender: "ai",
      text: responseText,
      timestamp: getFormattedTimestamp()
    };
    chatHistory.push(aiMsg);
    saveAIChatHistory();
    renderAIChatMessages();

  } catch (error) {
    removeTypingIndicator();
    const errorMsg = {
      sender: "error",
      text: `Error: ${error.message || "Failed to communicate with Groq AI."}`,
      timestamp: getFormattedTimestamp()
    };
    chatHistory.push(errorMsg);
    renderAIChatMessages();
  } finally {
    inputEl.disabled = false;
    sendBtn.disabled = false;
    inputEl.focus();
  }
}

/**
 * Communicates with the Groq API (OpenAI compatible format).
 */
async function fetchGroqAIResponse() {
  if (!GROQ_CONFIG.apiKey) {
    throw new Error("Groq API Key missing.");
  }

  // Format history into standard OpenAI messages array
  const recentHistory = chatHistory.slice(-6).filter(m => m.sender !== 'error');
  const messages = recentHistory.map(m => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: m.text
  }));

  const response = await fetch(GROQ_CONFIG.endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_CONFIG.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: GROQ_CONFIG.model,
      messages: messages
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Groq API error ${response.status}`);
  }

  const data = await response.json();
  const textResponse = data.choices?.[0]?.message?.content;

  if (!textResponse) {
    throw new Error("Received empty response from Groq AI engine.");
  }

  return textResponse;
}

/**
 * Displays bouncing typing indicator.
 */
function showTypingIndicator() {
  const chatBody = document.getElementById("ai-chat-body");
  if (!chatBody) return;

  const indicator = document.createElement("div");
  indicator.id = "ai-typing-indicator";
  indicator.className = "typing-indicator";
  indicator.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  chatBody.appendChild(indicator);
  scrollChatToBottom();
}

/**
 * Removes typing indicator.
 */
function removeTypingIndicator() {
  const indicator = document.getElementById("ai-typing-indicator");
  if (indicator) indicator.remove();
}

/**
 * Smoothly scrolls chat window to latest message.
 */
function scrollChatToBottom() {
  const chatBody = document.getElementById("ai-chat-body");
  if (chatBody) {
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

/**
 * Saves current conversation to localStorage.
 */
function saveAIChatHistory() {
  localStorage.setItem(GROQ_CONFIG.storageKey, JSON.stringify(chatHistory));
}

/**
 * Clears chat history.
 */
function clearAIChatHistory() {
  const modal = document.getElementById("confirm-modal");
  const cancelBtn = document.getElementById("modal-cancel-btn");
  const confirmBtn = document.getElementById("modal-confirm-btn");

  if (!modal) return;

  modal.classList.add("active");

  const hideModal = () => {
    modal.classList.remove("active");
    confirmBtn.onclick = null;
    cancelBtn.onclick = null;
  };

  cancelBtn.onclick = hideModal;

  confirmBtn.onclick = () => {
    hideModal();

    // 1. Clear DOM container
    const chatContainer = 
      document.getElementById("ai-chat-messages") || 
      document.getElementById("chat-messages") || 
      document.getElementById("ai-chat-body") ||
      document.querySelector(".chat-messages");

    if (chatContainer) {
      chatContainer.innerHTML = "";
    }

    // 2. Clear LocalStorage
    localStorage.removeItem("ai_chat_history");
    localStorage.removeItem("chat_history");

    // 3. RESET IN-MEMORY ARRAYS (This stops old messages from returning)
    if (typeof chatHistory !== "undefined") chatHistory = [];
    if (typeof aiChatHistory !== "undefined") aiChatHistory = [];
    if (typeof messages !== "undefined") messages = [];
    if (typeof conversationHistory !== "undefined") conversationHistory = [];

    // Trigger Toast Notification
    if (typeof showToast === "function") {
      showToast("AI chat history cleared successfully.");
    }
  };
}

// Professional Contact Form Handler & Toast UI
function handleContactSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const senderName = nameInput.value.trim() || 'User';

  // Check if toast element already exists, otherwise create it dynamically
  let toast = document.getElementById('contact-success-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'contact-success-toast';
    toast.className = 'contact-toast';
    toast.innerHTML = `
      <div class="contact-toast-icon">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <div class="contact-toast-details">
        <strong id="contact-toast-title">Message Sent!</strong>
        <p id="contact-toast-desc">Thank you! We've received your inquiry.</p>
      </div>
    `;
    document.body.appendChild(toast);
  }

  // Set message personalized to user
  document.getElementById('contact-toast-title').innerText = `Thank you, ${senderName}!`;
  document.getElementById('contact-toast-desc').innerText = 'Your message has been successfully transmitted to TechTitans Developer team.';

  // Display Toast Notification
  toast.classList.add('show');

  // Clear Form Fields
  document.getElementById('contact-form').reset();

  // Hide Toast after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}


// Centralized Team Data Structure
// Team Members Data Array
const teamMembers = [
  {
    id: 'hps',
    name: 'Hein Pyae Shine',
    role: 'Project Leader',
    isLeader: true,
    avatar: 'Photos Collections/images.jfif',
    telegram: 'hein_pyae_shine',
    rollNo: 'KPTM-11049',
    year: '2nd Year-A(CS)',
    university: 'University Of Computer Studies(Mandalay)',
    age: '20',
    address: 'Pyawbwe,Mandalay, Myanmar',
    about: 'Project Leader of TechTitan Portal. Passionate about software development, problem solving and creating useful digital tools. Leading the team with dedication to build a smart and accessible platform for everyone.'
  },
  {
    id: 'pmn',
    name: 'Phone Myint Naing',
    role: 'Team Member',
    isLeader: false,
    avatar: 'Photos Collections/pmn.jfif',
    telegram: 'phonenaing5321',
    rollNo: 'KPTM-11044',
    year: '2nd Year-A(CS)',
    university: 'University Of Computer Studies(Mandalay)',
    age: '20',
    address: 'Mandalay, Myanmar',
    about: 'Core developer focusing on application state management. '
  },
  {
    id: 'mhk',
    name: 'Min Hein Kyaw',
    role: 'Team Member',
    isLeader: false,
    avatar: 'Photos Collections/mhk.jfif',
    telegram: 'minhein19',
    rollNo: 'KPTM-11045',
    year: '2nd Year-A(CS)',
    university: 'University Of Computer Studies(Mandalay)',
    age: '21',
    address: 'Shwebo,Sagaing, Myanmar',
    about: 'UI/UX specialist focused on responsive layouts and modern theme styling.'
  },
  {
    id: 'hakl',
    name: 'Htet Arkar Lwin',
    role: 'Team Member',
    isLeader: false,
    avatar: 'Photos Collections/hakl.jfif',
    telegram: 'bad_boy99999',
    rollNo: 'KPTM-11133',
    year: '2nd Year-A(CS)',
    university: 'University Of Computer Studies(Mandalay)',
    age: '21',
    address: 'Mandalay, Myanmar',
    about: 'Specializes in integration testing, script optimizations, and module connectivity.'
  },
  {
    id: 'psw',
    name: 'Phyo Su Wai',
    role: 'Team Member',
    isLeader: false,
    avatar: 'Photos Collections/psw.jpg',
    telegram: 'Teza39',
    rollNo: 'KPTM-11066',
    year: '2nd Year-A(CS)',
    university: 'University Of Computer Studies(Mandalay)',
    age: '21',
    address: 'Kyaukse,Mandalay, Myanmar',
    about: 'Front-end engineer contributing to UI interaction logic and store component designs.'
  },
  {
    id: 'ahw',
    name: 'Aye Hnin Wai',
    role: 'Team Member',
    isLeader: false,
    avatar: 'Photos Collections/ahw.jpg',
    telegram: 'AppleHninX',
    rollNo: 'KPTM-11065',
    year: '2nd Year-A(CS)',
    university: 'University Of Computer Studies(Mandalay)',
    age: '20',
    address: 'Pyawbwe,Mandalay, Myanmar',
    about: 'Assisted in form validations, error handling workflows, and user feedback systems.'
  },
  {
    id: 'esdp',
    name: 'Eaint Sandy Phyo',
    role: 'Team Member',
    isLeader: false,
    avatar: 'Photos Collections/esdp.jpg',
    telegram: '@Jinnnnn128',
    rollNo: 'KPTM-11059',
    year: '2nd Year-A(CS)',
    university: 'University Of Computer Studies(Mandalay)',
    age: '20',
    address: 'Yamethin,Mandalay, Myanmar',
    about: 'In charge of technical documentation, user guides, and content structuring.'
  },
  {
    id: 'dkk',
    name: 'December Ko Ko',
    role: 'Team Member',
    isLeader: false,
    avatar: 'Photos Collections/dec.jpg',
    telegram: 'ddkoko1234',
    rollNo: 'KPTM-11136',
    year: '2nd Year-A(CS)',
    university: 'University Of Computer Studies(Mandalay)',
    age: '20',
    address: 'Mandalay, Myanmar',
    about: 'Contributed to asset design, utility calculator implementations, and styling.'
  }
];

// Render Team Grid Cards
function renderTeamGrid() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;

  grid.innerHTML = teamMembers.map(member => `
    <div class="team-card ${member.isLeader ? 'leader-card' : ''}">
      <img src="${member.avatar}" alt="${member.name}" class="avatar-circle">
      <div class="team-info">
        ${member.isLeader ? '<span class="leader-badge"><i class="fa-solid fa-crown"></i> PROJECT LEADER</span>' : ''}
        <h4>${member.name}</h4>
        <p class="role">${member.role}</p>
        <button class="btn-view-profile" onclick="openMemberModal('${member.id}')">
          <i class="fa-solid fa-user"></i> View Profile &rsaquo;
        </button>
      </div>
    </div>
  `).join('');
}

// Open Detailed Profile Modal
function openMemberModal(memberId) {
  const member = teamMembers.find(m => m.id === memberId);
  if (!member) return;

  const tgLink = `https://t.me/${member.telegram}`;

  const modalBody = document.getElementById('team-modal-body');
  modalBody.innerHTML = `
    <div class="modal-layout">
      <div class="modal-left">
        <img src="${member.avatar}" alt="${member.name}" class="modal-avatar">
        <h3>${member.name}</h3>
        <p class="modal-subrole">${member.role}</p>
        
        <div class="social-links">
          <a href="#" title="Email"><i class="fa-solid fa-envelope"></i></a>
          <a href="#" title="GitHub"><i class="fa-brands fa-github"></i></a>
          <a href="#" title="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
        </div>

        <!-- Telegram Card with Logo Box -->
        <div class="telegram-qr-card">
          <div class="telegram-logo-box">
            <i class="fa-brands fa-telegram"></i>
          </div>
          <a href="${tgLink}" target="_blank" class="tg-handle-link">
            <i class="fa-brands fa-telegram"></i> @${member.telegram}
          </a>
        </div>
      </div>

      <div class="modal-right">
        ${member.isLeader ? '<div class="modal-badge-wrapper"><span class="modal-leader-badge"><i class="fa-solid fa-crown"></i> PROJECT LEADER</span></div>' : ''}
        <div class="modal-section-title">
          <i class="fa-solid fa-user"></i> Member Information
        </div>
        <div class="info-table">
          <div class="info-row"><span class="label"><i class="fa-solid fa-graduation-cap"></i> Roll Number:</span><span class="val">${member.rollNo}</span></div>
          <div class="info-row"><span class="label"><i class="fa-solid fa-calendar-days"></i> Year:</span><span class="val">${member.year}</span></div>
          <div class="info-row"><span class="label"><i class="fa-solid fa-building-columns"></i> University:</span><span class="val">${member.university}</span></div>
          <div class="info-row"><span class="label"><i class="fa-solid fa-user-large"></i> Age:</span><span class="val">${member.age}</span></div>
          <div class="info-row"><span class="label"><i class="fa-solid fa-location-dot"></i> Address:</span><span class="val">${member.address}</span></div>
        </div>

        <div class="modal-section-title">
          <i class="fa-solid fa-user"></i> About ${member.name}
        </div>
        <p class="modal-about-text">${member.about}</p>

        <div class="modal-footer-action">
          <button class="btn-modal-close" onclick="closeMemberModal()">
            <i class="fa-solid fa-xmark"></i> Close
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('team-modal').classList.add('active');
}

// Close Modal Function
function closeMemberModal() {
  document.getElementById('team-modal').classList.remove('active');
}

// Close on Overlay Click
function handleModalOverlayClick(e) {
  if (e.target.id === 'team-modal') {
    closeMemberModal();
  }
}

// Run Initialization
document.addEventListener('DOMContentLoaded', renderTeamGrid);

// ==========================================
// CHECKOUT NAVIGATION & ANIMATION LOGIC
// ==========================================

// 1. Step 1 -> Step 2
function proceedFromCartToPayment() {
  goToStep(2);
}

// 2. Step 3 Form Submit -> Step 4 Confirmation
function processCustomerInfo() {
  // Gather Customer Info
  const name = document.getElementById("cust-name")?.value || "";
  const phone = document.getElementById("cust-phone")?.value || "";
  const email = document.getElementById("cust-email")?.value || "";
  const address = document.getElementById("cust-address")?.value || "";
  const city = document.getElementById("cust-city")?.value || "";
  const township = document.getElementById("cust-township")?.value || "";
  
  // Format full address
  let fullAddress = address;
  if (township) fullAddress += `, ${township}`;
  if (city) fullAddress += `, ${city}`;

  // Gather Selected Payment Method (checks radios or defaults)
  const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked')?.value || "KBZPay";

  // Gather Total Price from Step 1
  const total = document.getElementById("checkout-total-price")?.textContent || "$0.00";

  // Fill in Step 4 Confirmation Elements
  if (document.getElementById("conf-name")) document.getElementById("conf-name").textContent = name;
  if (document.getElementById("conf-phone")) document.getElementById("conf-phone").textContent = phone;
  if (document.getElementById("conf-email")) document.getElementById("conf-email").textContent = email;
  if (document.getElementById("conf-address")) document.getElementById("conf-address").textContent = fullAddress;
  if (document.getElementById("conf-payment")) document.getElementById("conf-payment").textContent = selectedPayment;
  if (document.getElementById("conf-total-price")) document.getElementById("conf-total-price").textContent = total;

  // Move to Step 4
  goToStep(4);
}

// 3. Step 4 Truck Button -> Step 5 Success Page
function handleOrderSubmit(button) {
  if (button.classList.contains("is-animating")) return;

  // Start Truck Animation
  button.classList.add("is-animating");

  // Transfer Step 4 details directly into Step 5
  populateStep5Success();

  // Transition to Step 5 after animation (4 seconds)
  setTimeout(() => {
    goToStep(5);
    button.classList.remove("is-animating");

    // Clear cart data array and UI display
    clearCartData();
  }, 4000);
}

function clearCartData() {
  // 1. Clear cart array references
  if (typeof cart !== "undefined" && Array.isArray(cart)) {
    cart.length = 0;
  }
  if (typeof activeCheckoutCart !== "undefined" && Array.isArray(activeCheckoutCart)) {
    activeCheckoutCart.length = 0;
  }

  // 2. Clear saved cart in LocalStorage (if used)
  localStorage.removeItem("cart");

  // 3. Re-render background cart UI and badge counts
  if (typeof renderCart === "function") renderCart();
  if (typeof updateCartCount === "function") updateCartCount();
  if (typeof renderCheckoutCartStep === "function") renderCheckoutCartStep();
}
// 4. Helper to transfer data into Step 5 spans
function populateStep5Success() {
  const name = document.getElementById("conf-name")?.textContent || "";
  const payment = document.getElementById("conf-payment")?.textContent || "";
  const total = document.getElementById("conf-total-price")?.textContent || "";
  
  const orderId = "TT-" + Math.floor(100000 + Math.random() * 900000);
  const currentDate = new Date().toLocaleString();

  const idSpan = document.getElementById("succ-order-id");
  const nameSpan = document.getElementById("succ-name");
  const paymentSpan = document.getElementById("succ-payment");
  const totalSpan = document.getElementById("succ-total");
  const dateSpan = document.getElementById("succ-date");

  if (idSpan) idSpan.textContent = orderId;
  if (nameSpan) nameSpan.textContent = name;
  if (paymentSpan) paymentSpan.textContent = payment;
  if (totalSpan) totalSpan.textContent = total;
  if (dateSpan) dateSpan.textContent = currentDate;
}

// 5. Universal Step Switcher (REPLACE your old goToStep with this)
function goToStep(stepNumber) {
  for (let i = 1; i <= 5; i++) {
    const stepEl = document.getElementById(`checkout-step-${i}`);
    const indEl = document.getElementById(`step-ind-${i}`);
    if (stepEl) stepEl.classList.remove("active");
    if (indEl) indEl.classList.remove("active");
  }

  const currentStep = document.getElementById(`checkout-step-${stepNumber}`);
  const currentInd = document.getElementById(`step-ind-${stepNumber}`);
  if (currentStep) currentStep.classList.add("active");
  if (currentInd) currentInd.classList.add("active");
}



/* =========================================================
   DISASTER ALERT SYSTEM MODULE ENGINE
   ========================================================= */

// Global Module States
let disasterAlerts = [];
let disasterFilteredAlerts = [];
let disasterInitialized = false;
let disasterUserCoords = null;
let disasterMap = null;
let disasterMarkers = [];
let disasterAutoRefreshTimer = null;

// Helper: Escape HTML string safely
function daEscapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Initialization function
function initDisasterAlertSystem() {
    initLeafletMap();

    if (!disasterInitialized) {
        disasterInitialized = true;
        loadCachedDisasterData();
        fetchDisasterData();

        // Auto-refresh interval every 5 minutes
        if (!disasterAutoRefreshTimer) {
            disasterAutoRefreshTimer = setInterval(() => {
                fetchDisasterData(false);
            }, 5 * 60 * 1000);
        }
    }
}

// Dynamically Load Leaflet JS & CSS for mapping
function initLeafletMap() {
    if (window.L || document.getElementById('leaflet-css')) return;

    const css = document.createElement('link');
    css.id = 'leaflet-css';
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
        setupMapInstance();
    };
    document.body.appendChild(script);
}

function setupMapInstance() {
    if (!window.L) return;

    if (!disasterMap) {
        try {
            // 1. Initialize Map (zoomControl: false prevents default top-left placement)
            disasterMap = L.map('da-map', {
                attributionControl: false,
                zoomControl: false, 
                minZoom: 2
            }).setView([18.5, 96.0], 3);

            // 2. Bright Tile Layer (OpenStreetMap)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19
            }).addTo(disasterMap);

            // 3. Move Zoom Control safely to Top-Right inside the map box
            L.control.zoom({
    position: 'topleft'
}).addTo(disasterMap);

            // 4. Custom Branding Attribution
            L.control.attribution({
                position: 'bottomright',
                prefix: false
            }).addAttribution('TechTitan - UCS(MDY)').addTo(disasterMap);

            if (disasterFilteredAlerts && disasterFilteredAlerts.length > 0) {
                renderDisasterMap();
            }
        } catch (e) {
            console.warn('Leaflet initialization skipped or failed:', e);
        }
    }

    // Force Leaflet to recalculate container bounds
    setTimeout(() => {
        if (disasterMap) {
            disasterMap.invalidateSize();
        }
    }, 200);
}
// Fetch APIs: GDACS & USGS Parallel Fetch
async function fetchDisasterData(isManual = false) {
    updateDisasterStatus('updating');
    renderSkeletonCards();

    if (isManual && typeof showToast === 'function') {
        showToast('Refreshing disaster data...');
    }

    try {
        const [gdacsData, usgsData] = await Promise.allSettled([
            fetchGDACSDisasters(),
            fetchUSGSEarthquakes()
        ]);

        let combined = [];

        if (gdacsData.status === 'fulfilled' && Array.isArray(gdacsData.value)) {
            combined = combined.concat(gdacsData.value);
        }
        if (usgsData.status === 'fulfilled' && Array.isArray(usgsData.value)) {
            combined = combined.concat(usgsData.value);
        }

        if (combined.length > 0) {
            disasterAlerts = deduplicateDisasters(combined);
            
            // Cache successful data
            localStorage.setItem('techTitan_disaster_cache', JSON.stringify(disasterAlerts));
            localStorage.setItem('techTitan_disaster_last_updated', new Date().toISOString());

            updateDisasterStatus('live');
            if (isManual && typeof showToast === 'function') {
                showToast('Disaster data updated');
            }
        } else {
            throw new Error('No data received from disaster endpoints.');
        }

    } catch (error) {
        console.error('Error fetching disaster data:', error);
        updateDisasterStatus('cached');
        loadCachedDisasterData();
        if (isManual && typeof showToast === 'function') {
            showToast('Unable to fetch live data. Showing cached results.');
        }
    }

    filterDisasterAlerts();
}

// Fetch GDACS GeoJSON Endpoint
async function fetchGDACSDisasters() {
    const url = 'https://www.gdacs.org/xml/rss_7d.xml'; // Fallback GDACS RSS-to-JSON or GeoJSON
    // Using GDACS public GeoJSON api endpoint
    const geoJsonUrl = 'https://www.gdacs.org/gdacsapi/api/events/geteventlist/M?alertlevel=Green;Orange;Red&eventtype=EQ;TC;FL;WF;VO;DR';
    
    const response = await fetch(geoJsonUrl, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`GDACS status ${response.status}`);
    const data = await response.json();

    const features = data.features || data.events || [];
    return features.map(item => normalizeDisasterEvent(item, 'GDACS')).filter(Boolean);
}

// Fetch USGS Earthquake GeoJSON Feed
async function fetchUSGSEarthquakes() {
    // 2.5+ magnitude earthquakes from the last 7 days
    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson';
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`USGS status ${response.status}`);
    const data = await response.json();

    return (data.features || []).map(item => normalizeDisasterEvent(item, 'USGS')).filter(Boolean);
}

// Normalize heterogeneous data models
function normalizeDisasterEvent(raw, source) {
    try {
        let id, type, title, severity, country, location, lat, lon, mag, timestamp, sourceUrl, description;

        if (source === 'USGS') {
            const p = raw.properties;
            const geom = raw.geometry;
            id = `usgs_${raw.id}`;
            type = 'Earthquake';
            title = p.title || 'Earthquake Event';
            mag = p.mag !== null ? parseFloat(p.mag) : null;
            
            // Map magnitude to severity standard
            if (mag >= 6.5) severity = 'Red';
            else if (mag >= 5.0) severity = 'Orange';
            else if (mag >= 4.0) severity = 'Yellow';
            else severity = 'Green';

            location = p.place || 'Unknown Location';
            country = parseCountryFromPlace(location);
            lon = geom && geom.coordinates ? parseFloat(geom.coordinates[0]) : null;
            lat = geom && geom.coordinates ? parseFloat(geom.coordinates[1]) : null;
            timestamp = p.time ? new Date(p.time).toISOString() : new Date().toISOString();
            sourceUrl = p.url || null;
            description = `Magnitude ${mag || 'N/A'} earthquake reported by USGS. Depth: ${geom?.coordinates[2] || 'N/A'} km.`;

        } else if (source === 'GDACS') {
            const p = raw.properties || raw;
            const geom = raw.geometry || {};
            id = `gdacs_${p.eventid || p.id || Math.random()}`;
            
            const rawType = (p.eventtype || p.type || '').toUpperCase();
            type = mapGDACType(rawType);

            const rawAlert = (p.alertlevel || p.alert || '').toLowerCase();
            if (rawAlert.includes('red')) severity = 'Red';
            else if (rawAlert.includes('orange')) severity = 'Orange';
            else if (rawAlert.includes('yellow')) severity = 'Yellow';
            else severity = 'Green';

            title = p.name || p.title || `${type} Event`;
            location = p.location || p.country || 'Global Location';
            country = p.country || parseCountryFromPlace(location);
            
            lat = p.latitude || (geom.coordinates ? geom.coordinates[1] : null);
            lon = p.longitude || (geom.coordinates ? geom.coordinates[0] : null);
            if (lat) lat = parseFloat(lat);
            if (lon) lon = parseFloat(lon);

            timestamp = p.fromdate || p.todate || p.datemodified || new Date().toISOString();
            sourceUrl = p.url?.geometry || p.link || 'https://www.gdacs.org';
            mag = p.severitydata?.severity || null;
            description = p.htmldescription || p.description || `${type} alert reported by GDACS.`;
        }

        return {
            id,
            type: type || 'Other',
            title: daEscapeHTML(title),
            severity: severity || 'Green',
            country: daEscapeHTML(country || 'Not available'),
            location: daEscapeHTML(location || 'Not available'),
            latitude: lat,
            longitude: lon,
            magnitude: mag,
            timestamp,
            source,
            sourceUrl: sourceUrl && sourceUrl.startsWith('http') ? sourceUrl : null,
            description: daEscapeHTML(description)
        };
    } catch (e) {
        return null;
    }
}

function mapGDACType(code) {
    switch (code) {
        case 'EQ': return 'Earthquake';
        case 'TC': return 'Tropical Cyclone';
        case 'FL': return 'Flood';
        case 'WF': return 'Wildfire';
        case 'VO': return 'Volcano';
        case 'DR': return 'Drought';
        default: return 'Other';
    }
}

function parseCountryFromPlace(place) {
    if (!place) return 'Worldwide';
    const parts = place.split(',');
    return parts[parts.length - 1].trim();
}

// Deduplication Logic
function deduplicateDisasters(alerts) {
    const seen = new Map();

    for (const item of alerts) {
        if (!item.latitude || !item.longitude) {
            seen.set(item.id, item);
            continue;
        }

        // Fuzzy key based on approx coords + time window + type
        const roundedLat = item.latitude.toFixed(1);
        const roundedLon = item.longitude.toFixed(1);
        const dateKey = item.timestamp ? item.timestamp.substring(0, 10) : '';
        const key = `${item.type}_${roundedLat}_${roundedLon}_${dateKey}`;

        if (!seen.has(key)) {
            seen.set(key, item);
        } else {
            // Prefer GDACS or Red severity over lower
            const existing = seen.get(key);
            if (item.source === 'GDACS' || (item.severity === 'Red' && existing.severity !== 'Red')) {
                seen.set(key, item);
            }
        }
    }

    return Array.from(seen.values());
}

// Filtering Engine
function filterDisasterAlerts() {
    const typeFilter = document.getElementById('da-filter-type').value;
    const severityFilter = document.getElementById('da-filter-severity').value;
    const regionFilter = document.getElementById('da-filter-region').value;
    const searchVal = document.getElementById('da-search-input').value.toLowerCase().trim();

    disasterFilteredAlerts = disasterAlerts.filter(alert => {
        // Type filter
        if (typeFilter !== 'All' && alert.type !== typeFilter) return false;

        // Severity filter
        if (severityFilter !== 'All' && alert.severity !== severityFilter) return false;

        // Region & Myanmar priority filter
        const textToSearch = `${alert.country} ${alert.location} ${alert.title}`.toLowerCase();
        const isMyanmar = textToSearch.includes('myanmar') || textToSearch.includes('burma');

        if (regionFilter === 'Myanmar' && !isMyanmar) return false;
        if (regionFilter === 'SEAsia') {
            const seAsia = ['myanmar', 'thailand', 'vietnam', 'laos', 'cambodia', 'indonesia', 'philippines', 'malaysia', 'singapore'];
            if (!seAsia.some(c => textToSearch.includes(c))) return false;
        }
        if (regionFilter === 'Asia') {
            const asia = ['myanmar', 'china', 'japan', 'india', 'thailand', 'vietnam', 'indonesia', 'philippines', 'pakistan', 'bangladesh'];
            if (!asia.some(c => textToSearch.includes(c))) return false;
        }

        // Search text
        if (searchVal && !textToSearch.includes(searchVal)) return false;

        return true;
    });

    // Calculate distance if coordinates available
    if (disasterUserCoords) {
        disasterFilteredAlerts.forEach(a => {
            if (a.latitude && a.longitude) {
                a.distanceKm = calculateDistance(disasterUserCoords.lat, disasterUserCoords.lng, a.latitude, a.longitude);
            } else {
                a.distanceKm = null;
            }
        });
    }

    // Sort order: Severity (Red > Orange > Yellow > Green) -> Distance (if location active) -> Recency
    const sevRank = { 'Red': 4, 'Orange': 3, 'Yellow': 2, 'Green': 1 };
    disasterFilteredAlerts.sort((a, b) => {
        if (sevRank[b.severity] !== sevRank[a.severity]) {
            return sevRank[b.severity] - sevRank[a.severity];
        }
        if (regionFilter === 'Nearby' && a.distanceKm !== null && b.distanceKm !== null) {
            return a.distanceKm - b.distanceKm;
        }
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    renderDisasterSummary();
    renderDisasterAlerts();
    renderDisasterMap();
}

// Distance Formula (Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

// Render Summary Statistics Cards
function renderDisasterSummary() {
    document.getElementById('da-stat-active').textContent = disasterFilteredAlerts.length;
    document.getElementById('da-stat-critical').textContent = disasterFilteredAlerts.filter(a => a.severity === 'Red').length;
    document.getElementById('da-stat-high').textContent = disasterFilteredAlerts.filter(a => a.severity === 'Orange').length;
    document.getElementById('da-stat-recent').textContent = disasterAlerts.length;
}

// Render Alert Cards
function renderDisasterAlerts() {
    const container = document.getElementById('da-cards-container');
    container.innerHTML = '';

    if (disasterFilteredAlerts.length === 0) {
        const lastCheck = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        container.innerHTML = `
            <div class="da-empty-state">
                <i class="fa-solid fa-circle-check da-empty-icon"></i>
                <h3>No Active Disaster Alerts</h3>
                <p>There are currently no disaster events matching your selected filters.</p>
                <small style="color: #7f8c8d;">Last checked: ${lastCheck}</small>
            </div>
        `;
        return;
    }

    disasterFilteredAlerts.forEach(alert => {
        const card = document.createElement('div');
        card.className = 'da-card';

        const isMyanmar = `${alert.country} ${alert.location}`.toLowerCase().includes('myanmar');
        const iconClass = getDisasterIcon(alert.type);
        const timeAgoStr = formatRelativeTime(alert.timestamp);
        const distStr = alert.distanceKm !== null ? `📍 ${alert.distanceKm} km away` : '';

        card.innerHTML = `
            <div>
                <div class="da-card-top">
                    <span class="da-card-type"><i class="${iconClass}"></i> ${alert.type}</span>
                    <span class="da-sev-badge da-sev-${alert.severity.toLowerCase()}">${alert.severity.toUpperCase()}</span>
                </div>
                ${isMyanmar ? '<span class="da-card-myanmar-flag">🇲🇲 MYANMAR EVENT</span>' : ''}
                <div class="da-card-title">${alert.title}</div>
                <div class="da-card-location"><i class="fa-solid fa-location-dot"></i> ${alert.location}</div>
            </div>
            <div>
                <div class="da-card-meta">
                    <span><i class="fa-regular fa-clock"></i> ${timeAgoStr}</span>
                    <span><i class="fa-solid fa-database"></i> ${alert.source}</span>
                    ${distStr ? `<span>${distStr}</span>` : ''}
                </div>
                
            </div>
        `;

        container.appendChild(card);
    });
}

// Font Awesome Icon Routing
function getDisasterIcon(type) {
    switch (type) {
        case 'Earthquake': return 'fa-solid fa-house-crack';
        case 'Tropical Cyclone': return 'fa-solid fa-hurricane';
        case 'Flood': return 'fa-solid fa-water';
        case 'Wildfire': return 'fa-solid fa-fire';
        case 'Volcano': return 'fa-solid fa-volcano';
        case 'Drought': return 'fa-solid fa-sun';
        default: return 'fa-solid fa-triangle-exclamation';
    }
}

// Relative Time Formatter
function formatRelativeTime(isoTimestamp) {
    if (!isoTimestamp) return 'Not available';
    const date = new Date(isoTimestamp);
    if (isNaN(date.getTime())) return 'Not available';

    const diffSecs = Math.floor((new Date() - date) / 1000);
    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)} minutes ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)} hours ago`;
    return `${Math.floor(diffSecs / 86400)} days ago`;
}

// Render Leaflet Map Markers
function renderDisasterMap() {
    if (!disasterMap || !window.L) return;

    // Clear existing markers
    disasterMarkers.forEach(m => disasterMap.removeLayer(m));
    disasterMarkers = [];

    const bounds = [];

    disasterFilteredAlerts.forEach(alert => {
        if (alert.latitude && alert.longitude) {
            const markerColor = getSeverityHex(alert.severity);
            
            const marker = L.circleMarker([alert.latitude, alert.longitude], {
                radius: alert.severity === 'Red' ? 10 : 7,
                fillColor: markerColor,
                color: '#ffffff',
                weight: 1.5,
                opacity: 0.9,
                fillOpacity: 0.8
            }).addTo(disasterMap);

            marker.bindPopup(`
                <div style="color: #000; font-family: sans-serif; max-width: 200px;">
                    <strong style="color: ${markerColor};">${alert.severity.toUpperCase()} ${alert.type}</strong><br/>
                    <b>${alert.title}</b><br/>
                    <small>📍 ${alert.location}</small><br/>
                    <small>🕒 ${formatRelativeTime(alert.timestamp)}</small><br/>
                    <small>Source: ${alert.source}</small>
                </div>
            `);

            disasterMarkers.push(marker);
            bounds.push([alert.latitude, alert.longitude]);
        }
    });

    if (bounds.length > 0 && disasterFilteredAlerts.length < 50) {
        try { disasterMap.fitBounds(bounds, { padding: [30, 30], maxZoom: 6 }); } catch (e) {}
    }
}

function getSeverityHex(sev) {
    switch (sev) {
        case 'Red': return '#ff4d4d';
        case 'Orange': return '#ffa500';
        case 'Yellow': return '#f1c40f';
        default: return '#2ecc71';
    }
}

// User Geolocation Support
function requestUserLocation() {
    const locBtn = document.getElementById('da-loc-btn');
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }

    locBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Locating...';

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            disasterUserCoords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };

            locBtn.innerHTML = '<i class="fa-solid fa-location-dot"></i> Location Active';
            locBtn.style.borderColor = '#2ecc71';
            document.getElementById('da-location-badge').textContent = `📍 Near ${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`;

            if (disasterMap) {
                disasterMap.setView([pos.coords.latitude, pos.coords.longitude], 6);
                L.marker([pos.coords.latitude, pos.coords.longitude])
                    .addTo(disasterMap)
                    .bindPopup('<b>Your Location</b>')
                    .openPopup();
            }

            filterDisasterAlerts();
        },
        (err) => {
            console.warn('Geolocation denied or failed:', err);
            locBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Location Unavailable';
            document.getElementById('da-location-badge').textContent = '📍 Global View (Location Permission Denied)';
            filterDisasterAlerts();
        }
    );
}

// Modal View Details Logic
function openDisasterModal(alertId) {
    const alert = disasterAlerts.find(a => a.id === alertId);
    if (!alert) return;

    document.getElementById('da-modal-title').innerHTML = `
        <i class="${getDisasterIcon(alert.type)}"></i> ${alert.title}
    `;

    const formattedTime = alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'Not available';

    document.getElementById('da-modal-body').innerHTML = `
        <div style="margin-bottom: 1rem;">
            <span class="da-sev-badge da-sev-${alert.severity.toLowerCase()}">${alert.severity.toUpperCase()} SEVERITY</span>
            <span style="margin-left: 0.5rem; font-size: 0.85rem; color: #95a5a6;">ID: ${alert.id}</span>
        </div>
        <p style="color: #ecf0f1; font-size: 0.95rem; line-height: 1.5;">${alert.description || 'No detailed description available.'}</p>
        
        <div class="da-detail-grid">
            <div class="da-detail-item"><label>Disaster Type</label><span>${alert.type}</span></div>
            <div class="da-detail-item"><label>Country / Area</label><span>${alert.country}</span></div>
            <div class="da-detail-item"><label>Exact Location</label><span>${alert.location}</span></div>
            <div class="da-detail-item"><label>Date & Time</label><span>${formattedTime}</span></div>
            <div class="da-detail-item"><label>Coordinates</label><span>${alert.latitude && alert.longitude ? `${alert.latitude}, ${alert.longitude}` : 'Not available'}</span></div>
            <div class="da-detail-item"><label>Magnitude / Scale</label><span>${alert.magnitude !== null ? alert.magnitude : 'Not available'}</span></div>
            <div class="da-detail-item"><label>Data Source</label><span>${alert.source}</span></div>
            <div class="da-detail-item"><label>Distance</label><span>${alert.distanceKm ? `${alert.distanceKm} km away` : 'Not calculated'}</span></div>
        </div>
    `;

    const linkBtn = document.getElementById('da-modal-link');
    if (alert.sourceUrl) {
        linkBtn.href = alert.sourceUrl;
        linkBtn.classList.remove('hidden');
    } else {
        linkBtn.classList.add('hidden');
    }

    document.getElementById('da-modal').classList.remove('hidden');
}

function closeDisasterModal() {
    document.getElementById('da-modal').classList.add('hidden');
}

// Skeleton State UI
function renderSkeletonCards() {
    const container = document.getElementById('da-cards-container');
    container.innerHTML = Array(6).fill('<div class="da-skeleton-card"></div>').join('');
}

// UI Live/Cached/Offline Status Update
function updateDisasterStatus(state) {
    const badge = document.getElementById('da-status-badge');
    const lastUpdated = document.getElementById('da-last-updated');
    const banner = document.getElementById('da-banner');

    const lastTimeStr = localStorage.getItem('techTitan_disaster_last_updated');
    const formattedLastTime = lastTimeStr ? new Date(lastTimeStr).toLocaleTimeString() : 'Never';

    if (state === 'live') {
        badge.className = 'da-badge da-badge-live';
        badge.textContent = '● LIVE';
        lastUpdated.textContent = `Last updated: ${formattedLastTime}`;
        banner.classList.add('hidden');
    } else if (state === 'cached') {
        badge.className = 'da-badge da-badge-cached';
        badge.textContent = '⚠ CACHED';
        lastUpdated.textContent = `Cached as of: ${formattedLastTime}`;
        banner.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Showing cached disaster information. Unable to connect to live network APIs.';
        banner.classList.remove('hidden');
    } else if (state === 'updating') {
        badge.className = 'da-badge da-badge-cached';
        badge.textContent = '↻ UPDATING...';
    } else {
        badge.className = 'da-badge da-badge-offline';
        badge.textContent = '● OFFLINE';
    }
}

// Caching Fallback Strategy
function loadCachedDisasterData() {
    const cached = localStorage.getItem('techTitan_disaster_cache');
    if (cached) {
        try {
            disasterAlerts = JSON.parse(cached);
        } catch (e) {
            disasterAlerts = [];
        }
    }
}



/* TECHTITAN PREMIUM INTRO - START */
(function () {
  'use strict';

  // CONFIGURATION SETTINGS
  const SHOW_INTRO_EVERY_SESSION = true; // Set to false to show only once per browser session
  const INTRO_DURATION_MS = 4500;        // Total cinematic target duration (~4.5s)
  const SAFETY_TIMEOUT_MS = 8000;        // Failsafe backup timeout (8s)
  const LOGIN_CONTAINER_SELECTOR = '.container, .login-wrapper, #auth-section'; // Update to match your existing login wrapper selector

  // DOM Elements
  const overlay = document.getElementById('tt-intro-overlay');
  const skipBtn = document.getElementById('tt-intro-skip');
  const speechPod = document.getElementById('tt-intro-speech');
  const progressFill = document.getElementById('tt-progress-fill');
  const progressNum = document.getElementById('tt-progress-num');
  const progressMsg = document.getElementById('tt-progress-msg');
  const loginContainer = document.querySelector(LOGIN_CONTAINER_SELECTOR);

  let animationFrameId;
  let safetyTimer;
  let isCompleted = false;

  // Accessibility check for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Prepare existing login container for seamless transition entrance
  if (loginContainer) {
    loginContainer.style.opacity = '0';
    loginContainer.style.transform = 'translateY(30px) scale(0.98)';
    loginContainer.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
  }

  function dismissIntro() {
    if (isCompleted) return;
    isCompleted = true;

    clearTimeout(safetyTimer);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    // Save session flag if configured
    if (!SHOW_INTRO_EVERY_SESSION) {
      sessionStorage.setItem('tt_premium_intro_viewed', 'true');
    }

    // Fade out overlay
    if (overlay) {
      overlay.classList.add('tt-fade-out');
    }

    // Animate existing login screen into view
    if (loginContainer) {
      loginContainer.style.opacity = '1';
      loginContainer.style.transform = 'translateY(0) scale(1)';
    }

    // Completely remove overlay node from layout flow after transition
    setTimeout(() => {
      if (overlay) overlay.style.display = 'none';
    }, 700);
  }

  // Handle Session Storage & Reduced Motion
  const alreadySeen = sessionStorage.getItem('tt_premium_intro_viewed') === 'true';
  if ((!SHOW_INTRO_EVERY_SESSION && alreadySeen) || prefersReducedMotion) {
    dismissIntro();
    return;
  }

  // Absolute safety fallback timer
  safetyTimer = setTimeout(dismissIntro, SAFETY_TIMEOUT_MS);

  // Skip button click handler
  if (skipBtn) {
    skipBtn.addEventListener('click', dismissIntro);
  }

  // Animation timeline progression loop
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(Math.round((elapsed / INTRO_DURATION_MS) * 100), 100);

    // Update progress numbers and bar
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressNum) progressNum.innerText = `${progress}%`;

    // Dynamic state updates based on progress thresholds
    if (progress >= 20 && progress < 45) {
      document.getElementById('tt-stat-1')?.classList.add('active', 'completed');
      document.getElementById('tt-stat-2')?.classList.add('active');
    } else if (progress >= 45 && progress < 75) {
      document.getElementById('tt-stat-2')?.classList.add('completed');
      document.getElementById('tt-stat-3')?.classList.add('active', 'completed');
      if (speechPod) speechPod.innerText = "Connecting platform services...";
      if (progressMsg) progressMsg.innerText = "ESTABLISHING SECURE MESH";
    } else if (progress >= 75 && progress < 100) {
      document.getElementById('tt-stat-4')?.classList.add('active', 'completed');
      if (speechPod) speechPod.innerText = "All systems operational. Welcome.";
      if (progressMsg) progressMsg.innerText = "INITIALIZATION COMPLETE";
    }

    if (progress < 100) {
      animationFrameId = requestAnimationFrame(step);
    } else {
      setTimeout(dismissIntro, 400);
    }
  }

  // Trigger animation loop
  animationFrameId = requestAnimationFrame(step);
})();
/* TECHTITAN PREMIUM INTRO - END */