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
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
        },
      })
    );
  }
  makeMove(socket, move) {
    // Validation
    // Is it this user's move
    // Is this a valid move
    // Chess.js is automatically validating the move. So, we don't need to validate it
    const currentTurn = this.board.turn(); // 'w' for white, 'b' for black
    const isWhiteTurn = currentTurn === "w";
    const isPlayer1 = socket === this.player1;
    const isPlayer2 = socket === this.player2;
    if ((isWhiteTurn && !isPlayer1) || (!isWhiteTurn && !isPlayer2)) {
      return;
    }
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
        opponent.send(
          JSON.stringify({
            type: CHESS_MOVE,
            payload: move,
          })
        );
      }

      if (this.board.isGameOver()) {
        const winner = this.board.turn() === "w" ? "black" : "white";
        const reason = `${winner} wins the game!`;

        this.player1.send(
          JSON.stringify({ type: GAME_OVER, payload: { reason } })
        );
        this.player2.send(
          JSON.stringify({ type: GAME_OVER, payload: { reason } })
        );

        this.cleanup();
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  cleanup() {
    this.endTime = new Date();
    this.storeIfAuthenticated();
  }

  storeIfAuthenticated() {
    [this.player1, this.player2].forEach((player) => {
      if (player.isAuthenticated && player.user?.username) {
        saveGameToDatabase({
          game: "chess",
          player1Username: this.player1.username,
          player2Username: this.player2.username,
          winner,
          moves: this.moves,
          startTime: this.startTime,
          endTime: new Date(),
        });
      }
    });
  }
}
