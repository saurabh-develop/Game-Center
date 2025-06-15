import React from "react";
import { useNavigate } from "react-router-dom";

const games = [
  {
    name: "Chess",
    image: "chessBoard.png", // Add appropriate images
    route: "/chess",
  },
  {
    name: "Sudoku",
    image: "sudoku3.png",
    route: "/sudoku",
  },
  {
    name: "Tic Tac Toe",
    image: "tictactoe4.png",
    route: "/tic-tac-toe",
  },
];

export default function GameSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2d3142] text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-4xl md:text-6xl font-bold mb-10 font-arcade">
        Choose Your Game
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {games.map((game) => (
          <div
            key={game.name}
            className="bg-[#23263a] hover:bg-[#30344e] rounded-2xl shadow-lg transition transform hover:scale-105 cursor-pointer flex flex-col items-center p-6"
            onClick={() => navigate(game.route)}
          >
            <img
              src={game.image}
              alt={game.name}
              className="w-32 h-32 object-contain mb-4"
            />
            <h2 className="text-2xl font-semibold mb-2">{game.name}</h2>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full mt-2 transition">
              Play
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
