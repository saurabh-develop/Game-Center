import { useEffect, useState } from "react";
import Menu from "../Menu";

const medalIcons = ["🥇", "🥈", "🥉"];

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch("/api/v1/leaderboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        return res.json();
      })
      .then((data) => {
        console.log("Leaderboard data:", data);
        setLeaders(data);
      })
      .catch((err) => {
        console.error("Leaderboard error:", err);
      });
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Menu />
      </div>

      {/* Leaderboard Content */}
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-yellow-400">
            🏆 Leaderboard
          </h2>
          {leaders.length === 0 ? (
            <p className="text-center text-gray-400">
              No leaderboard data available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-left">
                <thead className="bg-gray-800 text-yellow-300 uppercase text-sm tracking-wide">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Wins</th>
                  </tr>
                </thead>
                <tbody>
                  {leaders.map((player, idx) => (
                    <tr
                      key={player.username}
                      className={`transition duration-200 ${
                        idx % 2 === 0 ? "bg-gray-900" : "bg-gray-950"
                      } hover:bg-gray-800`}
                    >
                      <td className="py-3 px-4 font-semibold">
                        {medalIcons[idx] || idx + 1}
                      </td>
                      <td className="py-3 px-4">{player.username}</td>
                      <td className="py-3 px-4 text-yellow-300 font-bold">
                        {player.wins}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
