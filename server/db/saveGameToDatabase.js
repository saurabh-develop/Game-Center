import Game from "../models/Game.js"; // ✅ Add this import

export async function saveGameToDatabase({
  game,
  player1Username,
  player2Username,
  winner,
  moves,
  startTime,
  endTime,
}) {
  if (!player1Username && !player2Username) return;

  const timeTaken =
    startTime && endTime
      ? (new Date(endTime) - new Date(startTime)) / 1000
      : null;

  try {
    await Game.create({
      gameType: game,
      player1: player1Username || "anonymous",
      player2: player2Username || "anonymous",
      winner,
      moves,
      startTime,
      endTime,
      timeTaken,
    });
  } catch (err) {
    console.error("Error saving game:", err);
  }
}
