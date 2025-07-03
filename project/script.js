// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD9R6JuDBJLxy9JjY89dZ8P_Fz7A-3mTRk",
  authDomain: "codequestcapstone.firebaseapp.com",
  projectId: "codequestcapstone",
  storageBucket: "codequestcapstone.firebasestorage.app",
  messagingSenderId: "381486714432",
  appId: "1:381486714432:web:f6fca4ad722ce782f259a5",
  databaseURL: "https://codequestcapstone-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      localStorage.setItem("currentUser", email);
      location.href = "index.html";
    })
    .catch((err) => {
      document.getElementById("authMessage").innerText = err.message;
    });
}

function register() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => {
      document.getElementById("authMessage").innerText = "Registered! Please login.";
    })
    .catch((err) => {
      document.getElementById("authMessage").innerText = err.message;
    });
}

window.login = login;
window.register = register;

function getCurrentUsername() {
  return localStorage.getItem("currentUser") || "guest";
}

function getScoresObject() {
  return JSON.parse(localStorage.getItem("userScores") || "{}");
}

function getUserScore(username, topic = "html") {
  const scores = getScoresObject();
  return (scores[username] && scores[username][topic]) || 0;
}

function updateUserScore(username, topic = "html", pointsToAdd = 0) {
  const scores = getScoresObject();
  if (!scores[username]) scores[username] = {};
  scores[username][topic] = (scores[username][topic] || 0) + pointsToAdd;
  localStorage.setItem("userScores", JSON.stringify(scores));
  localStorage.setItem("lastPlayedTopic", topic);

}

function updateScoreDisplay(topic = "html") {
  const username = getCurrentUsername();
  const score = getUserScore(username, topic);
  const nameSpan = document.getElementById("userName");
  const scoreSpan = document.getElementById("scoreValue");
  if (nameSpan && scoreSpan) {
    const displayName = localStorage.getItem("displayName") || username;
    nameSpan.textContent = displayName;
    scoreSpan.textContent = score;
  }
}

function showCorrectHTML1Answer() {
  document.getElementById("answer").value = "h1";
  document.getElementById("answerClose").value = "h1";
}

function showCorrectJsAnswer() {
  document.getElementById("answer").value = "10";
}

function showCorrectCSSAnswer() {
  document.getElementById("cssProp").value = "color";
  document.getElementById("cssValue").value = "red";
}

function showCorrectPyAnswer() {
  document.getElementById("expr").value = "x**2";
  document.getElementById("var").value = "x";
  document.getElementById("range").value = "range(10)"
}

function startGame() {
  const active = document.querySelector(".nav-item.active");
  const topic = active ? active.dataset.topic : "html";
  window.location.href = `${topic}level-1.html`;
}
function switchUser() {
  localStorage.removeItem("currentUser");
  location.reload(); // Will trigger prompt again
}

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}

function hideLeaderboard() {
  document.getElementById("leaderboard").style.display = "none";
}

import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

async function fetchLeaderboard() {
  const db = getDatabase();
  const snapshot = await get(ref(db, "users"));
  const players = [];

  if (snapshot.exists()) {
    const data = snapshot.val();
    for (const uid in data) {
      const user = data[uid];
      players.push({
        name: user.email,
        html: user.html || 0,
        css: user.css || 0,
        js: user.js || 0,
        python: user.python || 0,
        total: user.total || 0
      });
    }

    players.sort((a, b) => b.total - a.total);

    const tableBody = document.getElementById("leaderboardBody");
    tableBody.innerHTML = "";

    players.forEach((player, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${player.name}</td>
        <td>${player.html}</td>
        <td>${player.css}</td>
        <td>${player.js}</td>
        <td>${player.python}</td>
        <td><b>${player.total}</b></td>
      `;
      tableBody.appendChild(tr);
    });
  }
}


function submitFinalScores() {
  if (confirm("Submit your final scores to the admin?")) {
    sendScoreToFirebase();
    alert("Scores submitted!");

    // Show the leaderboard
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.style.display = "block";

    // Load latest leaderboard data
    fetchLeaderboard();
  }
}

async function sendScoreToFirebase() {
  const username = getCurrentUsername(); // e.g., user@example.com
  const allScores = getScoresObject();
  const scores = allScores[username] || {};

  // Fetch user's Firebase UID by matching email
  const db = getDatabase();
  const usersRef = ref(db, "users");

  try {
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const users = snapshot.val();
      for (const [uid, userData] of Object.entries(users)) {
        if (userData.email === username) {
          const userRef = ref(db, "users/" + uid);
          const total =
            (scores.html || 0) +
            (scores.css || 0) +
            (scores.js || 0) +
            (scores.python || 0);

          await update(userRef, {
            html: scores.html || 0,
            css: scores.css || 0,
            js: scores.js || 0,
            python: scores.python || 0,
            total,
          });

          console.log("✅ Score updated in Firebase");
          return;
        }
      }
    }
  } catch (err) {
    console.error("❌ Failed to update score:", err);
  }
}

window.updateScoreDisplay = updateScoreDisplay;
window.startGame = startGame;
window.switchUser = switchUser;
window.submitFinalScores = submitFinalScores;
window.fetchLeaderboard = fetchLeaderboard;
window.hideLeaderboard = hideLeaderboard;

window.showCorrectCSSAnswer = showCorrectCSSAnswer;
window.showCorrectHTML1Answer = showCorrectHTML1Answer;
window.showCorrectJsAnswer = showCorrectJsAnswer;
window.showCorrectPyAnswer = showCorrectPyAnswer;