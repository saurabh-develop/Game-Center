import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import Menu from "../Menu.jsx";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext); // get setUser here
  const [stats, setStats] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const API_BASE = "http://localhost:8080";

  useEffect(() => {
    if (user) {
      fetch(`${API_BASE}/api/v1/auth/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch profile");
          return res.json();
        })
        .then(setStats)
        .catch((err) => {
          console.error("Profile fetch error:", err);
          setStats({ wins: 0, gamesPlayed: 0 });
        });
    }
  }, [user]);

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      alert("Please enter a valid new username.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/update-username`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ newUsername }),
      });

      console.log("Response status:", res.status); // <--
      const data = await res.json(); // <--

      if (!res.ok) {
        console.error("Backend error:", data.error || data.message);
        alert(data.error || "Failed to update username");
        return;
      }

      localStorage.setItem("username", data.username);
      setUser((prev) => ({ ...prev, username: data.username }));

      alert("Username updated to " + data.username);
      setNewUsername("");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update username");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account?")) {
      await fetch(`${API_BASE}/api/v1/auth/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      handleLogout();
    }
  };

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f172a] text-white">
        <p className="text-lg text-red-500 font-medium">
          Please login to view your profile.
        </p>
      </div>
    );

  if (!stats)
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f172a] text-white">
        <p className="text-lg text-gray-400 font-medium">
          Loading your profile...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white flex">
      <div className="hidden md:block">
        <Menu />
      </div>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto bg-[#1e293b] p-8 rounded-2xl shadow-md">
          <h1 className="text-3xl font-bold mb-6">👤 Profile</h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Stats */}
            <div className="space-y-3 text-base">
              <p>
                <span className="text-gray-400">Username:</span>{" "}
                <span className="font-medium">{user.username}</span>
              </p>
              <p>
                <span className="text-gray-400">Matches Won:</span>{" "}
                <span className="font-medium">{stats.wins}</span>
              </p>
              <p>
                <span className="text-gray-400">Games Played:</span>{" "}
                <span className="font-medium">{stats.gamesPlayed}</span>
              </p>
              {stats.gamesPlayed > 0 && (
                <p>
                  <span className="text-gray-400">Win Rate:</span>{" "}
                  <span className="font-medium">
                    {((stats.wins / stats.gamesPlayed) * 100).toFixed(1)}%
                  </span>
                </p>
              )}
              <p>
                <span className="text-gray-400">🔥 Longest Win Streak:</span>{" "}
                <span className="font-medium">{stats.longestWinStreak}</span>
              </p>
              <p>
                <span className="text-gray-400">🎮 Favorite Game:</span>{" "}
                <span className="font-medium">{stats.favoriteGame}</span>
              </p>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-lg font-semibold mb-2">🏅 Achievements</h3>
              <div className="text-3xl space-x-2">
                {stats.badges?.includes("first_win") && <span>🥇</span>}
                {stats.badges?.includes("5_sudoku") && <span>🧠</span>}
                {stats.badges?.includes("10_chess") && <span>⚔️</span>}
                {stats.badges?.includes("fast_thinker") && <span>⏱️</span>}
              </div>
            </div>
          </div>

          {/* Per Game Breakdown */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">📊 Per Game Stats</h3>
            <ul className="list-disc list-inside text-sm text-gray-300">
              {stats.games?.map((game) => (
                <li key={game.name}>
                  {game.name}: {game.wins}W / {game.losses}L / {game.draws}D
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Match History */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">🕓 Recent Matches</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Game</th>
                    <th className="py-2 pr-4">Opponent</th>
                    <th className="py-2 pr-4">Result</th>
                    <th className="py-2">Time Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentMatches?.map((match) => (
                    <tr key={match.id} className="border-b border-gray-800">
                      <td className="py-2 pr-4">
                        {new Date(match.date).toLocaleDateString()}
                      </td>
                      <td className="py-2 pr-4">{match.game}</td>
                      <td className="py-2 pr-4">{match.opponent || "—"}</td>
                      <td className="py-2 pr-4">{match.result}</td>
                      <td className="py-2">{match.timeTaken}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Account Settings */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">⚙️ Account Settings</h3>

            <div className="flex flex-wrap gap-3 items-center mb-4">
              <input
                type="text"
                placeholder="New Username"
                className="bg-gray-700 text-white px-4 py-2 rounded-md w-64"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white cursor-pointer"
                onClick={handleUpdateUsername}
              >
                Change Username
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white cursor-pointer"
                onClick={() => alert("Coming soon!")}
              >
                Reset Password
              </button>

              <button
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white cursor-pointer"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>

              <button
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-white cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
