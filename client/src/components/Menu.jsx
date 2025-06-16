import {
  FaChess,
  FaPuzzlePiece,
  FaTimes,
  FaBars,
  FaUser,
} from "react-icons/fa";
import { TbGridDots } from "react-icons/tb";
import { GiPodiumWinner } from "react-icons/gi";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useContext(AuthContext);
  console.log("User in Menu:", user);

  const navItems = [
    { name: "Chess", icon: <FaChess />, to: "/chess" },
    { name: "Sudoku", icon: <FaPuzzlePiece />, to: "/sudoku" },
    { name: "Tic Tac Toe", icon: <TbGridDots />, to: "/tic-tac-toe" },
  ];

  return (
    <aside
      className={`h-screen ${
        isOpen ? "w-64" : "w-20"
      } bg-[#111827] text-white p-4 transition-all duration-300 shadow-lg border-r border-gray-700 relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-10 right-7 z-50 text-gray-400 hover:text-white transition cursor-pointer"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Title */}
      <div className="mb-8 mt-4">
        <h2
          className={`text-xl font-extrabold tracking-wide transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          🎮 Game Menu
        </h2>
      </div>

      {/* Game Navigation */}
      <nav className="space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.to}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1f2937] transition"
          >
            <span className="text-xl cursor-pointer">{item.icon}</span>
            <span
              className={`text-lg font-semibold transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <hr className="my-6 border-gray-600" />

      {/* Extra Options */}
      <nav className="space-y-4">
        <Link
          to="/leaderboard"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1f2937] transition"
        >
          <span className="text-xl cursor-pointer">
            <GiPodiumWinner />
          </span>
          <span
            className={`text-lg font-semibold transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            Leaderboard
          </span>
        </Link>

        {user && !user.guest && (
          <Link
            to="/profile"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1f2937] transition"
          >
            <span className="text-xl cursor-pointer">
              <FaUser />
            </span>
            <span
              className={`text-lg font-semibold transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              Profile
            </span>
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Menu;
