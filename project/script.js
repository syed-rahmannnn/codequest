// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
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
    nameSpan.textContent = username;
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

import { get, ref, getDatabase } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

async function fetchLeaderboard() {
  const db = getDatabase();
  const dbRef = ref(db, 'users');

  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const players = Object.entries(snapshot.val()).map(([name, data]) => ({
        name, ...data
      }));

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
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  }
}


function submitFinalScores() {
  if (confirm("Submit your final scores to the admin?")) {
    sendScoreToAdminServer();
    alert("Scores submitted!");

    // Show the leaderboard
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.style.display = "block";

    // Load latest leaderboard data
    fetchLeaderboard();
  }
}


import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const db = getDatabase();

function sendScoreToAdminServer() {
  const username = getCurrentUsername();
  const scores = getScoresObject()[username] || {};

  set(ref(db, 'users/' + username.replace('.', '_')), {
    html: scores.html || 0,
    css: scores.css || 0,
    js: scores.js || 0,
    python: scores.python || 0,
    total: (scores.html || 0) + (scores.css || 0) + (scores.js || 0) + (scores.python || 0)
  }).then(() => {
    console.log("✅ Scores updated in Firebase");
  }).catch((err) => {
    console.error("❌ Firebase Error:", err);
  });
}

