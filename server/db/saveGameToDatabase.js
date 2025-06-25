import Game from "../models/Game.js";
import User from "../models/User.js"; // ✅ Add this

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

    // Only update stats for real (non-guest) users
    const updateStats = async (username, isWinner) => {
      if (!username || username === "anonymous") return;

      const user = await User.findOne({ username });
      if (!user) return;

      user.gamesPlayed += 1;
      if (isWinner) {
        user.wins += 1;
        user.longestWinStreak += 1;
      } else {
        user.longestWinStreak = 0; // losing breaks streak
      }

      // Favorite game logic (optional, based on game play count)
      if (!user.favoriteGame || user.favoriteGame === game) {
        user.favoriteGame = game;
      }

      // Badges logic (basic example)
      const newBadges = new Set(user.badges);

      if (user.wins === 1) newBadges.add("first_win");
      if (game === "sudoku" && user.wins >= 5) newBadges.add("5_sudoku");
      if (game === "chess" && user.wins >= 10) newBadges.add("10_chess");
      if (timeTaken && timeTaken < 60) newBadges.add("fast_thinker");

      user.badges = Array.from(newBadges);

      await user.save();
    };

    const isDraw = winner === "draw";
    const isPlayer1Winner = winner === player1Username;
    const isPlayer2Winner = winner === player2Username;

    await Promise.all([
      updateStats(player1Username, isDraw ? false : isPlayer1Winner),
      updateStats(player2Username, isDraw ? false : isPlayer2Winner),
    ]);
  } catch (err) {
    console.error("Error saving game or updating stats:", err);
  }
}
