let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let playerName = "";

function startQuiz() {
  playerName = document.getElementById("playerName").value.trim();
  if (!playerName) {
    alert("Please enter your name!");
    return;
  }

  const category = document.getElementById("category").value;
  fetch(`https://opentdb.com/api.php?amount=5&category=${category}&type=multiple`)
    .then(res => res.json())
    .then(data => {
      questions = data.results;
      currentQuestionIndex = 0;
      score = 0;

      document.getElementById("start-screen").style.display = "none";
      document.getElementById("quiz-screen").style.display = "block";
      loadQuestion();
    });
}

function loadQuestion() {
  const q = questions[currentQuestionIndex];
  document.getElementById("question").innerHTML = q.question;

  let options = [...q.incorrect_answers, q.correct_answer];
  shuffle(options);

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.innerHTML = opt;
    btn.onclick = () => checkAnswer(opt, q.correct_answer);
    optionsDiv.appendChild(btn);
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function checkAnswer(selected, correct) {
  if (selected === correct) {
    score++;
  }
  nextQuestion();
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "block";

  const total = questions.length;
  document.getElementById("final-score").innerHTML = 
    `${playerName}, your Final Score is ${score} / ${total}`;

  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name: playerName, score, total });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  const leaderboardList = document.getElementById("leaderboard");
  leaderboardList.innerHTML = "";
  leaderboard.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name} - ${entry.score}/${entry.total}`;
    leaderboardList.appendChild(li);
  });

  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Correct", "Incorrect"],
      datasets: [{
        label: "Results",
        data: [score, total - score],
        backgroundColor: ["green", "red"]
      }]
    }
  });
}

function restartQuiz() {
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "block";
}
