const symbols = [
  '☀', '☁', '☂', '☃', '★', '♥', '♣', '♦',
  '☯', '☮', '✈', '✉', '✿', '✪', '⚡', '☘',
  '❄', '♛'
];
let board = [], first = null, second = null;
let matches = 0, totalMatches = 0, timer = 0, interval;
let sessionMatches = 0, games = 0, totalTime = 0, times = [];

function showMain() {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('hidden-section');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function startGame() {
  const size = parseInt(document.getElementById("size").value);
  const boardElement = document.getElementById("game-board");
  boardElement.innerHTML = "";
  boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  const totalCells = size * size;
  const neededSymbols = totalCells / 2;
  const gameSymbols = [...symbols.slice(0, neededSymbols), ...symbols.slice(0, neededSymbols)].sort(() => 0.5 - Math.random());

  board = gameSymbols;
  matches = 0;
  sessionMatches = 0;
  totalMatches = neededSymbols;
  timer = 0;
  first = null;
  second = null;

  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    document.getElementById("timer").innerText = `დრო: ${timer}წმ`;
  }, 1000);

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.textContent = board[i];
    boardElement.appendChild(cell);
  }

  if(size == 2) setTimeout(hideSymbols, 2000);
  else if(size == 4) setTimeout(hideSymbols, 4000);
  else setTimeout(hideSymbols, 8000);
  boardElement.addEventListener("click", handleClick);
  updateProgress();
}

function hideSymbols() {
  document.querySelectorAll(".cell").forEach(cell => cell.classList.add("hidden"));
}

function handleClick(e) {
  if (!e.target.classList.contains("cell")) return;
  const index = e.target.dataset.index;
  if (!e.target.classList.contains("hidden") || second) return;

  e.target.classList.remove("hidden");
  if (!first) {
    first = e.target;
  } else {
    second = e.target;
    if (first.textContent === second.textContent) {
      first = null;
      second = null;
      matches++;
      sessionMatches++;
      updateProgress();

if (matches === totalMatches) {
  clearInterval(interval);
  updateResultsSection(timer);
  showWinModal();
}
    } else {
      setTimeout(() => {
        first.classList.add("hidden");
        second.classList.add("hidden");
        first = null;
        second = null;
      }, 1000);
    }
  }
}

function updateProgress() {
  const percent = (sessionMatches / totalMatches) * 100;
  document.getElementById('progressBar').value = sessionMatches;
  document.getElementById('progressBar').max = totalMatches;
  document.getElementById('progressValue').textContent = `${Math.floor(percent)}%`;
  document.getElementById("matchCount").textContent = sessionMatches;
}

function updateResultsSection(currentTime) {
  games++;
  totalTime += currentTime;
  times.push(currentTime);

  const min = Math.min(...times);
  const max = Math.max(...times);
  const avg = Math.floor(totalTime / games);

  document.getElementById("gamesWon").textContent = games;
  document.getElementById("totalTime").textContent = totalTime;
  document.getElementById("averageTime").textContent = avg;
  document.getElementById("minTime").textContent = min;
  document.getElementById("maxTime").textContent = max;
}

function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => section.classList.add('hidden-section'));
  document.getElementById(sectionId).classList.remove('hidden-section');
}

document.getElementById('rulesLink').addEventListener('click', e => {
  e.preventDefault();
  showSection('rules');
});

document.getElementById('resultsLink').addEventListener('click', e => {
  e.preventDefault();
  showSection('results');
});

document.getElementById('startLink').addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
});

function showWinModal() {
  document.getElementById('winModal').classList.remove('hidden-section');
  document.getElementById('finalTime').textContent = timer;
}

function closeModal() {
  document.getElementById('winModal').classList.add('hidden-section');
  startGame();
}

function showWinModal(finalTime) {
  const modal = document.getElementById("winModal");
  const timeText = document.getElementById("finalTime");

  timeText.textContent = timer;
  modal.classList.remove("hidden-section");

  setTimeout(() => {
    modal.classList.add("hidden-section");
  }, 2000);
}