// ===========================================
// Section References
// ===========================================

const welcome = document.getElementById("welcome");
const onboarding = document.getElementById("onboarding");
const meetBloom = document.getElementById("meetBloom");
const dailyCheckin = document.getElementById("dailyCheckIn");
const dashboard = document.getElementById("dashboard");

// ===========================================
// Button References
// ===========================================

const getStartedBtn = document.getElementById("getStartedBtn");
const continueBtn = document.getElementById("continueBtn");
const letsBeginBtn = document.getElementById("letsBeginBtn");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");

// ===========================================
// Input References
// ===========================================

const userNameInput = document.getElementById("userName");
const companionInput = document.getElementById("companionName");

// ===========================================
// Meet Bloom References
// ===========================================

const companionGreeting = document.getElementById("companionGreeting");
const companionIntro = document.getElementById("companionIntro");
const userMeetName = document.getElementById("userMeetName");

// ===========================================
// Daily Check-in References
// ===========================================

const userGreeting = document.getElementById("userGreeting");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const progressBar = document.querySelector(".progress-bar");

// ===========================================
// Question Data
// ===========================================

const questions = [
  {
    id: "mood",
    question: "How are you feeling today?",
    type: "emoji",
    options: ["😊", "😄", "😐", "😔", "😭"],
  },

  {
    id: "water",
    question: "How much water have you had today?",
    type: "text",
    options: ["0–2 glasses", "3–5 glasses", "6–8 glasses", "8+ glasses"],
  },

  {
    id: "sleep",
    question: "How many hours did you sleep last night?",
    type: "text",
    options: ["Less than 5", "5–6", "7–8", "More than 8"],
  },

  {
    id: "exercise",
    question: "Did you exercise today?",
    type: "text",
    options: ["Yes", "A little", "Not yet"],
  },

  {
    id: "outing",
    question: "Did you get some recreational time today?",
    type: "text",
    options: [
      "Went outside",
      "Met friends",
      "Relaxed at home",
      "Mostly studied",
    ],
  },
];

// ===========================================
// Daily Check-in State
// ===========================================

let currentQuestion = 0;
let selectedAnswer = null;
let answers = {};
let isOnboarded = false;

nextQuestionBtn.disabled = true;

// ===========================================
// Helper Functions
// ===========================================

function showSection(currentSection, nextSection) {
  currentSection.classList.add("hidden");
  nextSection.classList.remove("hidden");
}

// ===========================================
// Welcome → Onboarding
// ===========================================

function showOnboarding() {
  showSection(welcome, onboarding);
}

getStartedBtn.addEventListener("click", showOnboarding);

// ===========================================
// Save User & Companion Names
// ===========================================

function saveNames() {
  let userName = userNameInput.value.trim();

  if (userName === "") {
    userName = "Friend";
  }

  localStorage.setItem("userName", userName);

  let companionName = companionInput.value.trim();

  if (companionName === "") {
    companionName = "Bloom";
  }
  localStorage.setItem("isOnboarded", "true");

  localStorage.setItem("companionName", companionName);
}
initializeApp();
function initializeApp() {
  const isOnboarded = localStorage.getItem("isOnboarded");

  if (isOnboarded !== "true") {
    welcome.classList.remove("hidden");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  const checkins = JSON.parse(localStorage.getItem("checkins")) || [];

  const todayCheckin = checkins.find((checkin) => checkin.date === today);

  if (todayCheckin) {
    dashboard.classList.remove("hidden");
    loadDashboard();
  } else {
    dailyCheckin.classList.remove("hidden");
    loadDailyGreeting();

    currentQuestion = 0;
    selectedAnswer = null;

    renderQuestion();
  }
}

// ===========================================
// Meet Bloom Personalization
// ===========================================

function loadMeetBloom() {
  const userName = localStorage.getItem("userName") || "Friend";

  const companionName = localStorage.getItem("companionName") || "Bloom";

  document.getElementById("companionBrand").textContent = companionName;

  document.getElementById("companionGreeting").textContent = companionName;

  document.getElementById("companionIntro").textContent = companionName;

  document.getElementById("userIntro").textContent = userName;
}

// ===========================================
// Onboarding → Meet Bloom
// ===========================================

function continueOnboarding() {
  saveNames();

  loadMeetBloom();

  showSection(onboarding, meetBloom);
}

continueBtn.addEventListener("click", continueOnboarding);

// ===========================================
// Daily Greeting
// ===========================================

function loadDailyGreeting() {
  const userName = localStorage.getItem("userName") || "Friend";

  const hour = new Date().getHours();

  let greeting = "Hello";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  userGreeting.textContent = `${greeting}, ${userName}! 👋`;
}

function renderQuestion() {
  const question = questions[currentQuestion];

  questionText.textContent = question.question;

  optionsContainer.innerHTML = "";

  selectedAnswer = null;

  nextQuestionBtn.disabled = true;

  // Progress Bar
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

  question.options.forEach((option) => {
    const button = document.createElement("button");

    button.classList.add("option-btn");

    button.textContent = option;

    button.addEventListener("click", () => {
      document
        .querySelectorAll(".option-btn")
        .forEach((btn) => btn.classList.remove("selected"));

      button.classList.add("selected");

      selectedAnswer = option;

      nextQuestionBtn.disabled = false;
    });

    optionsContainer.appendChild(button);
  });
}
function nextQuestion() {
  // Don't continue if nothing is selected
  if (selectedAnswer === null) {
    alert("Please select an option.");
    return;
  }

  // Save answer
  answers[questions[currentQuestion].id] = selectedAnswer;

  // Move to next question
  currentQuestion++;

  // Finished all questions?
  if (currentQuestion >= questions.length) {
    // Save everything to localStorage
    const today = new Date().toISOString().split("T")[0];

    let checkins = JSON.parse(localStorage.getItem("checkins")) || [];

    const todayEntry = {
      date: today,
      answers: answers,
    };

    const existingIndex = checkins.findIndex(
      (checkin) => checkin.date === today,
    );

    if (existingIndex !== -1) {
      checkins[existingIndex] = todayEntry;
    } else {
      checkins.push(todayEntry);
    }

    localStorage.setItem("checkins", JSON.stringify(checkins));

    loadDashboard();

    showSection(dailyCheckin, dashboard);

    return;
  }

  // Reset selection
  selectedAnswer = null;

  // Show next question
  renderQuestion();
}
nextQuestionBtn.addEventListener("click", nextQuestion);

// ===========================================
// Meet Bloom → Daily Check-in
// ===========================================
function startJourney() {
  loadDailyGreeting();

  renderQuestion();

  showSection(meetBloom, dailyCheckin);
}
letsBeginBtn.addEventListener("click", startJourney);

function loadDashboard() {
  const userName = localStorage.getItem("userName") || "Friend";
  const companionName = localStorage.getItem("companionName") || "Bloom";

  const today = new Date().toISOString().split("T")[0];

  const checkins = JSON.parse(localStorage.getItem("checkins")) || [];

  const todayCheckin = checkins.find((checkin) => checkin.date === today);

  const data = todayCheckin ? todayCheckin.answers : {};
  document.getElementById("dashboardCompanionName").textContent = companionName;

  const hour = new Date().getHours();

  let greeting = "Good Morning";

  if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17) {
    greeting = "Good Evening";
  }

  document.getElementById("dashboardGreeting").textContent =
    `${greeting}, ${userName} 👋`;

  document.getElementById("summaryMood").textContent = data.mood;
  document.getElementById("summaryWater").textContent = data.water;
  document.getElementById("summarySleep").textContent = data.sleep;
  document.getElementById("summaryExercise").textContent = data.exercise;
  document.getElementById("summaryOuting").textContent = data.outing;

  document.getElementById("dashboardMessage").innerHTML =
    generateBloomMessage(data);

  const historyContainer = document.getElementById("historyContainer");

  historyContainer.innerHTML = "";

  const previousCheckins = checkins
    .filter((checkin) => checkin.date !== today)
    .slice(-3)
    .reverse();

  if (previousCheckins.length === 0) {
    historyContainer.innerHTML = "<p>No previous check-ins yet.</p>";
  } else {
    previousCheckins.forEach((checkin) => {
      const formattedDate = new Date(checkin.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      historyContainer.innerHTML += `
<div class="history-card">

    <h3>📅 ${formattedDate}</h3>

    <div class="history-details">

        <div class="history-row">
            <span>😊 Mood</span>
            <strong>${checkin.answers.mood}</strong>
        </div>

        <div class="history-row">
            <span>💧 Water</span>
            <strong>${checkin.answers.water}</strong>
        </div>

        <div class="history-row">
            <span>😴 Sleep</span>
            <strong>${checkin.answers.sleep}</strong>
        </div>

        <div class="history-row">
            <span>🏃 Exercise</span>
            <strong>${checkin.answers.exercise}</strong>
        </div>

        <div class="history-row">
            <span>🌿 Recreation</span>
            <strong>${checkin.answers.outing}</strong>
        </div>

    </div>

</div>
`;
    });
  }
}

function generateBloomMessage(data) {
  const companionName = localStorage.getItem("companionName") || "Bloom";

  const mood = data.mood;
  const sleep = data.sleep;
  const water = data.water;
  const exercise = data.exercise;
  const outing = data.outing;

  // Mood based opening
  let message = "";

  switch (mood) {
    case "😁":
      message =
        "You seem to be in a wonderful mood today. I hope that positive energy stays with you.";
      break;

    case "😊":
      message =
        "You look like you're feeling pretty good today. I'm happy to see that.";
      break;

    case "😐":
      message = "Today seems calm and steady. Quiet days are important too.";
      break;

    case "😔":
      message =
        "Thanks for checking in today. Tough days happen, and I'm glad you're here.";
      break;

    case "😭":
      message =
        "I'm really glad you checked in today. Remember to be kind to yourself.";
      break;

    default:
      message = "Thank you for checking in today.";
  }

  // Notice one healthy habit
  let observation = "";

  if (sleep === "More than 8") {
    observation =
      " You also got plenty of sleep—that's fantastic for your wellbeing.";
  } else if (sleep === "7–8") {
    observation = " Getting a good amount of sleep will help you recharge.";
  } else if (water === "8+ glasses") {
    observation = " I noticed you've been staying hydrated today. Great job!";
  } else if (water === "6–8 glasses") {
    observation = " You're doing well staying hydrated today.";
  } else if (exercise === "Yes") {
    observation = " It's great that you made time to exercise today.";
  } else if (exercise === "A little") {
    observation = " Even a little movement is something to be proud of.";
  } else if (outing === "Met friends" || outing === "Went outside") {
    observation = " Spending some time outside can really lift your mood.";
  }

  // Encouraging ending
  const endings = [
    "Let's keep growing together. 🌱",
    "Little habits become big changes. 💚",
    "Tomorrow is another opportunity to grow.",
    "Keep taking things one step at a time.",
    "I'm always happy when you check in.",
  ];

  const ending = endings[Math.floor(Math.random() * endings.length)];

  return `
        <strong>🌱 ${companionName} says</strong><br><br>
        ${message}${observation}<br><br>
        ${ending}
    `;
}
initializeApp();
