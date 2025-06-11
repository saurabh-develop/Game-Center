import { GAME_OVER, UPDATE_GAME, INIT_GAME } from "../../message.js";
import { saveGameToDatabase } from "../../db/saveGameToDatabase.js";

export class TicTacToeGame {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = Array(9).fill(null);
    this.currentPlayer = "X";
    this.symbols = new Map([
      [player1, "X"],
      [player2, "O"],
    ]);
    this.moves = [];
    this.startTime = new Date();
    this.endTime = null;

    player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: { symbol: "X" },
      })
    );
    player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: { symbol: "O" },
      })
    );

    this.sendGameState();
  }

  makeMove(socket, payload) {
    const index = payload.index;
    const symbol = this.symbols.get(socket);
    if (!symbol || this.board[index] !== null || symbol !== this.currentPlayer)
      return;

    this.board[index] = symbol;

    const username = socket.user?.username || "anonymous";
    this.moves.push({
      by: username,
      move: index,
      symbol,
      timestamp: Date.now(),
    });

    const winner = this.getWinner();
    const isDraw = this.board.every((cell) => cell !== null);

    if (winner) {
      this.endTime = new Date();
      this.sendToBoth({
        type: UPDATE_GAME,
        payload: {
          board: this.board,
          winner,
          isDraw: false,
          currentPlayer: null,
        },
      });
      this.sendToBoth({
        type: GAME_OVER,
        payload: { reason: `Player ${winner} wins!` },
      });
      this.cleanup(winner);
    } else if (isDraw) {
      this.endTime = new Date();
      this.sendToBoth({
        type: UPDATE_GAME,
        payload: {
          board: this.board,
          winner: null,
          isDraw: true,
          currentPlayer: null,
        },
      });
      this.sendToBoth({
        type: GAME_OVER,
        payload: { reason: "Draw!" },
      });
      this.cleanup("draw");
    } else {
      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
      this.sendGameState();
    }
  }

  sendGameState() {
    this.sendToBoth({
      type: UPDATE_GAME,
      payload: {
        board: this.board,
        currentPlayer: this.currentPlayer,
        winner: null,
        isDraw: false,
      },
    });
  }

  sendToBoth(message) {
    [this.player1, this.player2].forEach((p) => {
      if (p.readyState === p.OPEN) {
        p.send(JSON.stringify(message));
      }
    });
  }

  getWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[b] === this.board[c]
      ) {
        return this.board[a];
      }
    }
    return null;
  }

  cleanup(winner) {
    this.endTime = this.endTime || new Date();

    [this.player1, this.player2].forEach((player) => {
      if (!player || !player.isAuthenticated || !player.user?.username) return;

      const username = player.user.username;
      const userSymbol = this.symbols.get(player);

      saveGameToDatabase({
        game: "tictactoe",
        player1Username: this.player1.username,
        player2Username: this.player2.username,
        winner,
        startTime: this.startTime,
        endTime: new Date(),
      });
    });
  }
}
