import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, CHESS_MOVE } from "../../message.js";
import { saveGameToDatabase } from "../../db/saveGameToDatabase.js";

export class ChessGame {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moves = [];
    this.startTime = new Date();
    this.endTime = null;
    this.winner = null;

    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: { color: "white" },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: { color: "black" },
      })
    );
  }

  makeMove(socket, move) {
    const currentTurn = this.board.turn(); // 'w' or 'b'
    const isWhiteTurn = currentTurn === "w";
    const isPlayer1 = socket === this.player1;
    const isPlayer2 = socket === this.player2;

    if ((isWhiteTurn && !isPlayer1) || (!isWhiteTurn && !isPlayer2)) return;

    try {
      const actualMove = move.move;
      const moveRes = this.board.move(actualMove);
      if (!moveRes) return;

      const username = socket.user?.username || "anonymous";
      this.moves.push({
        move: actualMove,
        by: username,
        timestamp: Date.now(),
      });

      const opponent = isPlayer1 ? this.player2 : this.player1;
      if (opponent.readyState === opponent.OPEN) {
        opponent.send(JSON.stringify({ type: CHESS_MOVE, payload: move }));
      }

      if (this.board.isGameOver()) {
        const winnerColor = this.board.turn() === "w" ? "black" : "white";
        this.winner =
          winnerColor === "white"
            ? this.player1.user?.username
            : this.player2.user?.username;

        const reason = `${winnerColor} wins the game!`;
        this.player1.send(
          JSON.stringify({ type: GAME_OVER, payload: { reason } })
        );
        this.player2.send(
          JSON.stringify({ type: GAME_OVER, payload: { reason } })
        );

        this.cleanup();
      }
    } catch (err) {
      console.error("Error in makeMove:", err);
    }
  }

  cleanup() {
    this.endTime = new Date();
    this.storeIfAuthenticated();
  }

  storeIfAuthenticated() {
    if (this.player1.user?.username || this.player2.user?.username) {
      saveGameToDatabase({
        game: "chess",
        player1Username: this.player1.user?.username,
        player2Username: this.player2.user?.username,
        winner: this.winner,
        moves: this.moves,
        startTime: this.startTime,
        endTime: this.endTime,
        db: global.db,
      });
    }
  }

  getResult() {
    return {
      game: "chess",
      player1Username: this.player1.user?.username,
      player2Username: this.player2.user?.username,
      winner: this.winner,
      moves: this.moves,
      startTime: this.startTime,
      endTime: this.endTime || new Date(),
    };
  }
}
