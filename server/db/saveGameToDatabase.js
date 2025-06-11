export async function saveGameToDatabase({
  game,
  player1Username,
  player2Username,
  winner,
  moves,
  startTime,
  endTime,
}) {
  // Save only if at least one authenticated user is present
  if (!player1Username && !player2Username) return;

  await db.collection("game_history").insertOne({
    game,
    player1: player1Username || "anonymous",
    player2: player2Username || "anonymous",
    winner,
    moves,
    startTime,
    endTime,
    createdAt: new Date(),
  });
}
