import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, CHESS_MOVE } from "../../message.js";
export class ChessGame {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moves = [];
    this.startTime = new Date();
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
      this.moves.push(actualMove);
    } catch (error) {
      console.log(error);
      return;
    }

    // Update the board. Handled by the library
    // Push the move
    // Check if the game is over
    if (this.board.isGameOver()) {
      const winner = this.board.turn() === "w" ? "black" : "white"; // Opponent wins
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: { reason: `${winner} wins the game!` },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: { reason: `${winner} wins the game!` },
        })
      );
      return;
    }

    // Notifying the other user about the move played
    const opponent = isPlayer1 ? this.player2 : this.player1;
    opponent.send(
      JSON.stringify({
        type: CHESS_MOVE,
        payload: move,
      })
    );
  }
}
