import React from "react";
import Button from "./Button";
import Menu from "../Menu";
import { useNavigate } from "react-router-dom";

const LandingChess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white flex">
      {/* Sidebar Menu */}
      <div className="hidden md:block">
        <Menu />
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-center items-center flex-1 px-6 py-12 gap-8">
        <div className="w-full md:w-2/3 lg:w-1/2 flex justify-center">
          <img
            src="/chessBoard.png"
            alt="Chess Board"
            className="w-full max-w-2xl rounded-xl shadow-2xl border-4 border-white/10"
          />
        </div>

        {/* Right Panel */}
        <div className="text-center md:text-left space-y-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Play Chess Online
          </h1>
          <p className="text-lg text-gray-300 max-w-md">
            Challenge friends or random players and climb the leaderboard.
          </p>
          <Button onClick={() => navigate("/chessBoard")} color="green">
            Play Online
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingChess;
