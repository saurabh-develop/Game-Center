import {
  generateSudoku,
  generateSolution,
} from "../Sudoku/SudokuBoardGenerator.js";
import {
  INIT_GAME,
  SUDOKU_MOVE,
  GAME_OVER,
  TIMER_UPDATE,
} from "../../message.js";

function deepCopy(board) {
  return board.map((row) => [...row]);
}

function countCorrectEntries(playerBoard, solutionBoard) {
  let correct = 0;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (playerBoard[i][j] === solutionBoard[i][j]) {
        correct++;
      }
    }
  }
  return correct;
}

export class SudokuGame {
  constructor(player1, player2, level, mode) {
    this.player1 = player1;
    this.player2 = player2;
    this.level = level;
    this.mode = mode;

    // Generate a board and its full solution
    const puzzle = generateSudoku(level);
    const solution = deepCopy(puzzle);
    generateSolution(solution);
    this.puzzle = puzzle;
    this.solution = solution;

    // Each player gets their own board copy
    this.playerBoards = new Map();
    this.playerBoards.set(player1, deepCopy(puzzle));
    if (mode === "multiplayer") {
      this.playerBoards.set(player2, deepCopy(puzzle));
    }

    // Start time
    this.startTime = new Date();
    this.timeLimit = 5 * 60 * 1000; // 5 minutes
    this.timer = setTimeout(() => this.endGameDueToTimeout(), this.timeLimit);

    // Timer updates to clients
    this.timeInterval = setInterval(() => {
      const elapsed = Date.now() - this.startTime.getTime();
      const message = JSON.stringify({
        type: TIMER_UPDATE,
        payload: { elapsed },
      });

      this.player1.send(message);
      if (mode === "multiplayer") {
        this.player2.send(message);
      }
    }, 1000);

    // Send INIT_GAME
    const initPayload = JSON.stringify({
      type: INIT_GAME,
      payload: {
        board: puzzle,
        level: level,
        timeLimit: this.timeLimit,
        mode: mode,
      },
    });
    this.player1.send(initPayload);
    if (mode === "multiplayer") {
      this.player2.send(initPayload);
    }

    // Listen for moves
    this.player1.on("message", (msg) => this.handleMessage(player1, msg));
    if (mode === "multiplayer") {
      this.player2.on("message", (msg) => this.handleMessage(player2, msg));
    }
  }

  handleMessage(player, msg) {
    const message = JSON.parse(msg);
    if (message.type === SUDOKU_MOVE) {
      this.makeMove(player, message.payload);
    }
  }

  makeMove(player, move) {
    const { row, col, value } = move;
    const board = this.playerBoards.get(player);

    // Do not allow editing pre-filled cells
    if (this.puzzle[row][col] !== 0) return;

    board[row][col] = value;

    // Check if player's board is correct
    if (this.isBoardCorrect(board)) {
      this.declareWinner(player);
    }
  }

  isBoardCorrect(board) {
    // Full match with solution
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== this.solution[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  declareWinner(winner) {
    clearTimeout(this.timer);
    clearInterval(this.timeInterval);

    const result = JSON.stringify({
      type: GAME_OVER,
      payload: {
        winner:
          this.mode === "multiplayer"
            ? winner === this.player1
              ? "player1"
              : "player2"
            : "solo",
        reason: "Solved correctly",
      },
    });

    this.player1.send(result);
    if (this.mode === "multiplayer") {
      this.player2.send(result);
    }
  }

  cleanup() {
    clearTimeout(this.timer);
    clearInterval(this.timeInterval);
  }

  endGameDueToTimeout() {
    clearInterval(this.timeInterval);

    if (this.mode === "multiplayer") {
      const board1 = this.playerBoards.get(this.player1);
      const board2 = this.playerBoards.get(this.player2);
      const score1 = countCorrectEntries(board1, this.solution);
      const score2 = countCorrectEntries(board2, this.solution);

      let winner = null;
      if (score1 > score2) winner = "player1";
      else if (score2 > score1) winner = "player2";
      else winner = "draw";

      const result = JSON.stringify({
        type: GAME_OVER,
        payload: {
          winner,
          reason: "Time's up",
          score: { player1: score1, player2: score2 },
        },
      });

      this.player1.send(result);
      this.player2.send(result);
    } else {
      const result = JSON.stringify({
        type: GAME_OVER,
        payload: {
          winner: "none",
          reason: "Time's up",
        },
      });
      this.player1.send(result);
    }
  }
}
