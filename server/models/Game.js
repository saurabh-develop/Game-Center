import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  player1: {
    type: String,
    required: true,
  },
  player2: {
    type: String,
    required: true,
  },
  winner: {
    type: String, // username or "draw"
    required: true,
  },
  gameType: {
    type: String, // "chess", "sudoku", "tictactoe"
    required: true,
  },
  moves: {
    type: [Object], // or [String] depending on your format
    default: [],
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Game = mongoose.model("Game", gameSchema);
export default Game;
