import Button from "../Chess/Button.jsx";
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
      <div className="flex flex-col md:flex-row justify-center items-center flex-1 px-6 py-12 gap-8 overflow-hidden">
        <div className="w-full md:w-2/3 lg:w-1/2 flex justify-center">
          <img
            src="/sudoku2.png"
            alt="Sudoku Board"
            className="w-full max-w-2xl max-h-[80vh] object-contain rounded-xl shadow-2xl border-4 border-white/10"
          />
        </div>

        {/* Text Panel */}
        <div className="max-w-md w-full text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Play Sudoku Online
            <span className="block text-blue-400">
              on the #1 Multiplayer Game Site
            </span>
          </h1>
          <p className="mb-6 text-gray-300 text-base">
            Challenge your friends or match with others online in real-time
            Sudoku battles. Simple. Clean. Fun.
          </p>
          <Button
            onClick={() => navigate("/sudokuBoard")}
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

export default LandingChess;
