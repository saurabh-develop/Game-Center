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
    this.winner = null;

    player1.send(JSON.stringify({ type: INIT_GAME, payload: { symbol: "X" } }));
    player2.send(JSON.stringify({ type: INIT_GAME, payload: { symbol: "O" } }));
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

    const winnerSymbol = this.getWinner();
    const isDraw = this.board.every((cell) => cell !== null);

    if (winnerSymbol) {
      this.endTime = new Date();
      this.winner =
        [...this.symbols.entries()].find(([, s]) => s === winnerSymbol)?.[0]
          .user?.username || null;

      this.sendToBoth({
        type: UPDATE_GAME,
        payload: {
          board: this.board,
          winner: winnerSymbol,
          isDraw: false,
          currentPlayer: null,
        },
      });

      this.sendToBoth({
        type: GAME_OVER,
        payload: { reason: `Player ${winnerSymbol} wins!` },
      });

      this.cleanup();
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

      this.cleanup();
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
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // cols
      [0, 4, 8],
      [2, 4, 6], // diags
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

  cleanup() {
    this.endTime = this.endTime || new Date();

    const shouldSave =
      this.player1.user?.username || this.player2.user?.username;

    if (shouldSave) {
      saveGameToDatabase(this.getResult());
    }
  }

  getResult() {
    return {
      game: "tictactoe",
      player1Username: this.player1.user?.username,
      player2Username: this.player2.user?.username,
      winner: this.winner, // username or null
      moves: this.moves,
      startTime: this.startTime,
      endTime: this.endTime || new Date(),
    };
  }
}
