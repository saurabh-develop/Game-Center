import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager.js";

const gameManager = new GameManager();
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  gameManager.addUser(ws);
  ws.on("close", () => {
    console.log("Player disconnected");
    gameManager.removeUser(ws);
  });

  ws.send("Welcome to the game!");
});
