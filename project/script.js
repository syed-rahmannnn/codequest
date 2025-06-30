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
    const rows = csv.split("\n").slice(1); // skip header
    const tableBody = document.getElementById("leaderboardBody");
    tableBody.innerHTML = "";

    rows.forEach(row => {
      const columns = row.split(",");
      const name = columns[1];
      const html = columns[2];
      const css = columns[3];
      const js = columns[4];
      const python = columns[5];

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${name}</td>
        <td>${html || 0}</td>
        <td>${css || 0}</td>
        <td>${js || 0}</td>
        <td>${python || 0}</td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error("⚠️ Error loading leaderboard:", err);
    document.getElementById("leaderboardBody").innerHTML = `<tr><td colspan="5">Failed to load leaderboard.</td></tr>`;
  }
}

function submitFinalScores() {
  if (confirm("Submit your final scores to the admin?")) {
    sendScoreToAdminServer(); // ✅ Only call this once
    alert("Scores submitted!");
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

