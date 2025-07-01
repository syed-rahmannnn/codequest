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

function showCorrectHTMLAnswer() {
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

async function fetchLeaderboard() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhZeY_KV_35kPvDU_DOSRA_QAtygoQTCkV6GnhJJiEnCuDnbWLmeck4ZzuJJMTDgdxL352d1JgVAFr/pub?output=csv";

  try {
    const res = await fetch(url);
    const csv = await res.text();
    const rows = csv.split("\n").slice(1); // Skip header

    let players = [];

    rows.forEach(row => {
      const columns = row.split(",");
      const name = columns[1]?.trim();
      const html = parseInt(columns[2]) || 0;
      const css = parseInt(columns[3]) || 0;
      const js = parseInt(columns[4]) || 0;
      const python = parseInt(columns[5]) || 0;
      const total = html + css + js + python;

      if (name) {
        players.push({ name, html, css, js, python, total });
      }
    });

    // Sort by total descending
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
      if (index === 0) tr.style.backgroundColor = "#ffd700"; // Gold
      if (index === 1) tr.style.backgroundColor = "#c0c0c0"; // Silver
      if (index === 2) tr.style.backgroundColor = "#cd7f32"; // Bronze
      tableBody.appendChild(tr);
    });

  } catch (err) {
    console.error("⚠️ Error loading leaderboard:", err);
    document.getElementById("leaderboardBody").innerHTML =
      `<tr><td colspan="7">Failed to load leaderboard.</td></tr>`;
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


function sendScoreToAdminServer() {
  const username = getCurrentUsername();
  const allScores = getScoresObject();
  const scores = allScores[username] || {};

  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSe3WD2zhCq6HdDJhVrBFWRYXYnxXX3RA_9zyHZg_nFKG_ayDQ/formResponse";

  const formData = new FormData();
  formData.append("entry.218425263", username);           // Name field
  formData.append("entry.216952711", scores.html || 0);   // HTML Score
  formData.append("entry.143075905", scores.css || 0);    // CSS Score
  formData.append("entry.1181459127", scores.js || 0);     // JS Score
  formData.append("entry.490537559", scores.python || 0); // Python Score

  fetch(formUrl, {
    method: "POST",
    mode: "no-cors", // ✅ This is key for CORS-free POST
    body: formData
  }).then(() => {
    console.log("✅ Score sent to admin form");
  }).catch((err) => {
    console.error("❌ Error sending score:", err);
  });
}

