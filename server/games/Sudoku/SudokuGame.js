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
import { saveGameToDatabase } from "../../db/saveGameToDatabase.js";

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
    this.moves = [];
    this.startTime = new Date();
    this.endTime = null;
    this.winner = null;

    const puzzle = generateSudoku(level);
    const solution = deepCopy(puzzle);
    generateSolution(solution);
    this.puzzle = puzzle;
    this.solution = solution;

    this.playerBoards = new Map();
    this.playerBoards.set(player1, deepCopy(puzzle));
    if (mode === "multiplayer") {
      this.playerBoards.set(player2, deepCopy(puzzle));
    }

    this.timeLimit = 5 * 60 * 1000;
    this.timer = setTimeout(() => this.endGameDueToTimeout(), this.timeLimit);
    this.timeInterval = setInterval(() => {
      const elapsed = Date.now() - this.startTime.getTime();
      const message = JSON.stringify({
        type: TIMER_UPDATE,
        payload: { elapsed },
      });
      player1.send(message);
      if (mode === "multiplayer") player2.send(message);
    }, 1000);

    const initPayload = JSON.stringify({
      type: INIT_GAME,
      payload: {
        board: puzzle,
        level: level,
        timeLimit: this.timeLimit,
        mode: mode,
      },
    });
    player1.send(initPayload);
    if (mode === "multiplayer") player2.send(initPayload);

    player1.on("message", (msg) => this.handleMessage(player1, msg));
    if (mode === "multiplayer") {
      player2.on("message", (msg) => this.handleMessage(player2, msg));
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
    if (this.puzzle[row][col] !== 0) return;

    board[row][col] = value;

    const username = player.user?.username || "anonymous";
    this.moves.push({
      by: username,
      move: { row, col, value },
      timestamp: Date.now(),
    });

    if (this.isBoardCorrect(board)) {
      this.winner =
        this.mode === "multiplayer"
          ? player === this.player1
            ? this.player1.user?.username
            : this.player2.user?.username
          : this.player1.user?.username;

      this.declareWinner();
    }
  }

  isBoardCorrect(board) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== this.solution[i][j]) return false;
      }
    }
    return true;
  }

  declareWinner() {
    clearTimeout(this.timer);
    clearInterval(this.timeInterval);
    this.endTime = new Date();

    const result = JSON.stringify({
      type: GAME_OVER,
      payload: {
        winner: this.mode === "multiplayer" ? this.winner : "solo",
        reason: "Solved correctly",
      },
    });

    this.player1.send(result);
    if (this.mode === "multiplayer") this.player2.send(result);

    this.cleanup();
  }

  endGameDueToTimeout() {
    clearTimeout(this.timer);
    clearInterval(this.timeInterval);
    this.endTime = new Date();

    if (this.mode === "multiplayer") {
      const board1 = this.playerBoards.get(this.player1);
      const board2 = this.playerBoards.get(this.player2);
      const score1 = countCorrectEntries(board1, this.solution);
      const score2 = countCorrectEntries(board2, this.solution);

      if (score1 > score2) this.winner = this.player1.user?.username;
      else if (score2 > score1) this.winner = this.player2.user?.username;
      else this.winner = null;

      const result = JSON.stringify({
        type: GAME_OVER,
        payload: {
          winner: this.winner
            ? this.winner === this.player1.user?.username
              ? "player1"
              : "player2"
            : "draw",
          reason: "Time's up",
          score: { player1: score1, player2: score2 },
        },
      });

      this.player1.send(result);
      this.player2.send(result);
    } else {
      this.winner = null;
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: "none",
            reason: "Time's up",
          },
        })
      );
    }

    this.cleanup();
  }

  cleanup() {
    clearTimeout(this.timer);
    clearInterval(this.timeInterval);
    this.endTime = this.endTime || new Date();

    const shouldSave =
      this.player1.user?.username || this.player2?.user?.username;

    if (shouldSave) {
      saveGameToDatabase(this.getResult());
    }
  }

  getResult() {
    return {
      game: "sudoku",
      player1Username: this.player1.user?.username,
      player2Username:
        this.mode === "multiplayer" ? this.player2.user?.username : null,
      winner: this.winner,
      moves: this.moves,
      startTime: this.startTime,
      endTime: this.endTime || new Date(),
    };
  }
}
