import { WebSocketServer } from "ws";
import { GameManager } from "./games/GameManager.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize the game manager and WebSocket server
const gameManager = new GameManager();
const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  gameManager.addUser(ws);
  ws.on("close", () => {
    console.log("Player disconnected");
    gameManager.removeUser(ws);
  });
});
