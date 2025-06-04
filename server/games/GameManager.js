import {
  INIT_GAME,
  CHESS_MOVE,
  SUDOKU_MOVE,
  GAME_OVER,
  CHAT,
} from "../message.js";
import { ChessGame } from "./chess/ChessGame.js";
import { SudokuGame } from "./sudoku/SudokuGame.js";

export class GameManager {
  constructor() {
    this.games = [];
    this.pendingUser = {
      chess: null,
      sudoku: null,
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
  removeUser(socket) {
    this.users = this.users.filter((user) => user != socket); //Stopping the game
    for (const type in this.pendingUser) {
      if (this.pendingUser[type] === socket) {
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
        otherPlayer.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: { reason: "Opponent disconnected" },
          })
        );
      }
      return !isPlayerInGame;
    });
  }
  addHandler(socket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === INIT_GAME) {
        const gameType = message.payload?.game; // 'chess' or 'sudoku'
        const level = message.payload?.level || "easy"; // for Sudoku
        const mode = message.payload?.mode || "solo"; // for Sudoku
        if (!["chess", "sudoku"].includes(gameType)) {
          console.log("Invalid game type requested");
          return;
        }

        if (gameType === "sudoku" && mode === "solo") {
          const game = new SudokuGame(socket, null, level, "solo");
          this.games.push(game);
          return;
        }

        if (this.pendingUser[gameType]) {
          // Pair players and start the appropriate game
          const player1 = this.pendingUser[gameType];
          const player2 = socket;
          let game;
          if (gameType === "chess") {
            game = new ChessGame(player1, player2);
          } else if (gameType === "sudoku") {
            game = new SudokuGame(player1, player2, level, "multiplayer");
          }
          this.games.push(game);
          this.pendingUser[gameType] = null;
        } else {
          this.pendingUser[gameType] = socket;
        }
      }

      if (message.type === CHESS_MOVE || message.type === SUDOKU_MOVE) {
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
