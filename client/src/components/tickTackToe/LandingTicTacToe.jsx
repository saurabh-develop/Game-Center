import Button from "../Chess/Button.jsx";
import Menu from "../Menu";
import { useNavigate } from "react-router-dom";

const LandingTicTacToe = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white flex">
      {/* Sidebar Menu */}
      <div className="hidden md:block">
        <Menu />
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-center flex-1 px-6 py-12 gap-10">
        {/* Image Section */}
        <div className="w-full md:w-3/5 flex justify-center">
          <img
            src="/tictactoe2.png"
            alt="TicTacToe Board"
            className="w-full max-w-xl rounded-xl shadow-2xl border-4 border-white/10"
          />
        </div>

        {/* Text and Button Section */}
        <div className="max-w-md w-full text-center md:text-left space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Play Tic Tac Toe Online
            <span className="block text-blue-400 mt-1">
              The #1 Real-Time Game Site
            </span>
          </h1>
          <p className="text-gray-300 text-base">
            Challenge friends or match with other players across the world.
            Fast-paced, fun, and easy to play.
          </p>
          <Button
            onClick={() => navigate("/tic-tac-toe-board")}
            color="blue"
            className="text-white px-6 py-3 text-lg rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            Play Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingTicTacToe;
