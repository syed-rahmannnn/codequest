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

function showDashboard() {
  const dashboard = document.getElementById("dashboard");
  const dashboardBody = document.getElementById("dashboardBody");
  const scores = getScoresObject();

  dashboardBody.innerHTML = "";

  for (const [user, topics] of Object.entries(scores)) {
    const html = topics.html || 0;
    const css = topics.css || 0;
    const js = topics.js || 0;
    const python = topics.python || 0;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user}</td>
      <td>${html}</td>
      <td>${css}</td>
      <td>${js}</td>
      <td>${python}</td>
    `;
    dashboardBody.appendChild(row);
  }

  dashboard.style.display = "block";
}


function hideDashboard() {
  document.getElementById("dashboard").style.display = "none";
}

function sendScoreToAdminServer() {
  const username = getCurrentUsername();
  const scores = getScoresObject()[username];
  
  fetch("https://script.google.com/macros/s/AKfycbzZ5EBZe3W_oP2_oVSRGvFZPNmN21WdVGU8SmFckD0w-G-72y97J8vJOij6LBccPW10JQ/exec", {
    method: "POST",
    body: JSON.stringify({
      name: username,
      scores: scores
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => console.log("Data sent to admin"));
}
