import Button from "../Chess/Button.jsx";
import Menu from "../Menu";
import { useNavigate } from "react-router-dom";

const LandingChess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-6 gap-4 p-4 pt-0 overflow-hidden">
      {/* Sidebar Menu */}
      <div className="md:col-span-1 flex items-center justify-center md:justify-start">
        <Menu />
      </div>

      {/* Sudoku Board Image */}
      <div className="md:col-span-3 flex justify-center items-center">
        <img
          src="/sudoku2.png"
          className="max-h-screen w-auto h-auto object-contain"
          alt="Sudoku Board"
        />
      </div>

      {/* Right Panel */}
      <div className="md:col-span-2 p-6 text-center md:text-left flex justify-center flex-col items-center">
        <h1 className="font-bold text-xl md:text-2xl lg:text-3xl mt-4 md:mt-10 text-center">
          Play Sudoku Online on the #1 Site!
        </h1>
        <Button
          onClick={() => {
            navigate("/sudokuBoard");
          }}
          color={"blue"}
        >
          Play Online
        </Button>
      </div>
    </div>
  );
};

export default LandingChess;
