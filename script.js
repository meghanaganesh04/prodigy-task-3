const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; 
let gameActive = true;

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== "" || !gameActive || currentPlayer !== "X") return;

  makeMove(index, "X");
  if (checkGameOver("X")) return;

  setTimeout(() => {
    const bestMove = getBestMove();
    makeMove(bestMove, "O");
    checkGameOver("O");
  }, 300);
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player === "X" ? "🐱" : "🤖";
  currentPlayer = player === "X" ? "O" : "X";

  if (gameActive) {
    statusText.textContent = currentPlayer === "X" ? "🐱 Your Turn" : "🤖 Thinking...";
  }
}

function checkGameOver(player) {
  if (checkWinner(player)) {
    statusText.textContent = player === "X" ? "🐱 You Win! 🎉" : "🤖 AI Wins!";
    gameActive = false;
    return true;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "😐uh ohh! It's a Tie";
    gameActive = false;
    return true;
  }

  return false;
}

function checkWinner(player) {
  return winPatterns.some(pattern => {
    return pattern.every(index => board[index] === player);
  });
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWinner("O")) return 10 - depth;
  if (checkWinner("X")) return depth - 10;
  if (newBoard.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "🐱 Your Turn";
  cells.forEach(cell => cell.textContent = "");
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
