import { INIT_GAME, MOVE } from "./message.js";
import { Game } from "./Game.js";
import { WebSocket } from "ws";

export class GameManager {
  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }
  addUser(socket) {
    this.users.push(socket);
    this.addHandler(socket);
    socket.on("message", (data) => {
      console.log("Received message:", data.toString());
    });
    console.log("Pending user:", this.pendingUser);
  }
  removeUser(socket) {
    this.users = this.users.filter((user) => user != socket); //Stopping the game
    if (this.pendingUser === socket) {
      this.pendingUser = null;
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
            type: "GAME_ENDED",
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
      if (message.type == INIT_GAME) {
        console.log("Message Type:", message.type);
        if (this.pendingUser) {
          // Start Game
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);
          this.pendingUser = null;
        } else {
          this.pendingUser = socket;
        }
      }
      if (message.type == MOVE) {
        const game = this.games.find(
          (game) => game.player1 == socket || game.player2 == socket
        );
        if (game) {
          game.makeMove(socket, message.payload.move);
        }
      }
    });
  }
}
