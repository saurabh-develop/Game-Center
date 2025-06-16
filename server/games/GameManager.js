import {
  INIT_GAME,
  CHESS_MOVE,
  SUDOKU_MOVE,
  GAME_OVER,
  CHAT,
  TIC_TAC_TOE_MOVE,
} from "../message.js";
import { ChessGame } from "./chess/ChessGame.js";
import { SudokuGame } from "./sudoku/SudokuGame.js";
import { TicTacToeGame } from "./tictactoe/TickTackToeGame.js";
import { saveGameToDatabase } from "../db/saveGameToDatabase.js";

export class GameManager {
  constructor() {
    this.games = [];
    this.pendingUser = {
      chess: null,
      sudoku: {
        easy: null,
        medium: null,
        hard: null,
      },
      ticTacToe: null,
    };
    this.users = [];
  }
  addUser(socket) {
    this.users.push(socket);
    this.addHandler(socket);
    socket.on("message", (data) => {
      console.log("Received message:", data.toString());
    });
  }
  async cleanupExistingGame(socket) {
    const index = this.games.findIndex(
      (g) => g.player1 === socket || g.player2 === socket
    );
    if (index !== -1) {
      const game = this.games[index];

      // ✅ SAVE GAME DATA if possible
      if (game.getResult && typeof game.getResult === "function") {
        const result = game.getResult();
        if (result?.player1Username || result?.player2Username) {
          try {
            await saveGameToDatabase({ ...result, db });
          } catch (err) {
            console.error("Failed to save game:", err);
          }
        }
      }

      if (game.timer) clearTimeout(game.timer);
      if (game.timeInterval) clearInterval(game.timeInterval);
      this.games.splice(index, 1);
    }
  }

  removeUser(socket) {
    this.users = this.users.filter((user) => user != socket); //Stopping the game
    for (const type in this.pendingUser) {
      if (type === "sudoku") {
        for (const level in this.pendingUser.sudoku) {
          if (this.pendingUser.sudoku[level] === socket) {
            this.pendingUser.sudoku[level] = null;
          }
        }
      } else if (this.pendingUser[type] === socket) {
        this.pendingUser[type] = null;
      }
    }

    // Remove games involving the disconnected user
    this.games = this.games.filter((game) => {
      const isPlayerInGame = game.player1 === socket || game.player2 === socket;
      if (isPlayerInGame) {
        // Notify the other player that the game has ended
        const otherPlayer =
          game.player1 === socket ? game.player2 : game.player1;

        if (otherPlayer && otherPlayer.readyState === otherPlayer.OPEN) {
          otherPlayer.send(
            JSON.stringify({
              type: GAME_OVER,
              payload: { reason: "Opponent disconnected" },
            })
          );
        }
      }
      return !isPlayerInGame;
    });
  }
  addHandler(socket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === INIT_GAME) {
        const gameType = message.payload?.game; // 'chess' or 'sudoku'
        const difficulty = message.payload?.difficulty || "easy"; // for Sudoku
        const mode = message.payload?.mode || "solo"; // for Sudoku

        this.cleanupExistingGame(socket);

        if (gameType === "ticTacToe") {
          if (
            this.pendingUser.ticTacToe &&
            this.pendingUser.ticTacToe !== socket
          ) {
            const game = new TicTacToeGame(this.pendingUser.ticTacToe, socket);
            this.games.push(game);
            this.pendingUser.ticTacToe = null;
          } else {
            this.pendingUser.ticTacToe = socket;
          }
        }

        if (gameType === "sudoku" && mode === "solo") {
          this.cleanupExistingGame(socket);
          const game = new SudokuGame(socket, null, difficulty, "solo");
          this.games.push(game);
          return;
        }

        if (gameType === "chess") {
          if (this.pendingUser.chess && this.pendingUser.chess !== socket) {
            const game = new ChessGame(this.pendingUser.chess, socket);
            this.games.push(game);
            this.pendingUser.chess = null;
          } else {
            this.pendingUser.chess = socket;
          }
        } else if (gameType === "sudoku" && mode === "multiplayer") {
          const waitingPlayer = this.pendingUser.sudoku[difficulty];

          if (waitingPlayer && waitingPlayer !== socket) {
            const game = new SudokuGame(
              waitingPlayer,
              socket,
              difficulty,
              "multiplayer"
            );
            this.games.push(game);
            this.pendingUser.sudoku[difficulty] = null;
          } else {
            this.pendingUser.sudoku[difficulty] = socket;
          }
        }
      }

      if (
        message.type === CHESS_MOVE ||
        message.type === SUDOKU_MOVE ||
        message.type === TIC_TAC_TOE_MOVE
      ) {
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game && typeof game.makeMove === "function") {
          game.makeMove(socket, message.payload);
        }
      }

      if (message.type === CHAT) {
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          const opponent =
            game.player1 === socket ? game.player2 : game.player1;
          if (opponent && opponent.readyState === opponent.OPEN) {
            opponent.send(
              JSON.stringify({
                type: CHAT,
                payload: {
                  message: message.payload.message,
                },
              })
            );
          }
        }
      }
    });
  }
}
