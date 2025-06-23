function checkAnswer() {
  const userAnswer = document.getElementById("answer").value.trim();
  const feedback = document.getElementById("feedback");

  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");

  if (userAnswer === "10") {
    feedback.textContent = "✅ Correct! You passed Level 1!";
    feedback.style.color = "lightgreen";
    correctSound.play();  // ✅ Play correct answer sound
    const username = getCurrentUsername();
    updateUserScore(username, 10);
    updateScoreDisplay();
    // Unlock Level 2 in localStorage
    localStorage.setItem("level1Completed", "true");

    setTimeout(() => {
      alert("Get ready for Level 2!");
      window.location.href = "level2.html";
    }, 1500);

  } else {
    feedback.textContent = "❌ Incorrect. Try again!";
    feedback.style.color = "red";
    wrongSound.play();  // ❌ Play wrong answer sound
  }
}
// Only run on Level 2
if (document.title.includes("Level 2")) {
  const pieces = document.querySelectorAll('.piece');
  const dropZone = document.getElementById('dropZone');

  pieces.forEach(piece => {
    piece.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', e.target.textContent);
    });
  });

  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
  });

  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');

    const newPiece = document.createElement('div');
    newPiece.className = 'piece';
    newPiece.textContent = data;
    newPiece.setAttribute('draggable', 'true');

    // Add dragstart so dropped pieces can be moved again
    newPiece.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', e.target.textContent);
        // Optional: remove the piece from dropZone when it's picked up
        e.target.remove();
    });

    // Optional: allow clicking to remove the piece
    newPiece.addEventListener('click', () => {
        newPiece.remove();
    });

    dropZone.appendChild(newPiece);
    });
}

function checkOrder() {
  const blocks = Array.from(document.querySelectorAll('#dropZone .piece')).map(el => el.textContent.trim());
  const feedback = document.getElementById('feedback');
  const correctSound = document.getElementById('correctSound');
  const wrongSound = document.getElementById('wrongSound');

  const correctSequence = [
    'if (num > 0) {',
    'console.log("Positive");',
    '}'
  ];

  if (JSON.stringify(blocks) === JSON.stringify(correctSequence)) {
    feedback.textContent = "✅ Correct! Well done!";
    feedback.style.color = "lightgreen";
    correctSound.play();
    const username = getCurrentUsername();
    updateUserScore(username, 10);
    updateScoreDisplay();
  } else {
    feedback.textContent = "❌ Incorrect order. Try again!";
    feedback.style.color = "red";
    wrongSound.play();
  }
}
function getCurrentUsername() {
  return localStorage.getItem("currentUser") || "guest";
}

function getScoresObject() {
  return JSON.parse(localStorage.getItem("userScores") || "{}");
}

function getUserScore(username) {
  const scores = getScoresObject();
  return scores[username] || 0;
}

function updateUserScore(username, pointsToAdd) {
  const scores = getScoresObject();
  scores[username] = (scores[username] || 0) + pointsToAdd;
  localStorage.setItem("userScores", JSON.stringify(scores));
}

function updateScoreDisplay() {
  const username = getCurrentUsername();
  const scoreDisplay = document.getElementById("scoreValue");
  scoreDisplay.textContent = getUserScore(username);
}
function updateUserScore(username, newScore) {
  const scores = getScoresObject();
  scores[username] = newScore;
  localStorage.setItem("userScores", JSON.stringify(scores));
}
