import { FaChess, FaPuzzlePiece, FaTimes } from "react-icons/fa";
import { TbGridDots } from "react-icons/tb";
import { useState } from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-black text-gray-300 p-5 w-64 shadow-lg border-r border-gray-700`}
    >
      <h2 className="font-extrabold text-xl mb-4">Select Game</h2>
      <ul className="space-y-3">
        <li>
          <Link
            to="/chess"
            className="flex items-center gap-3 font-bold text-lg p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition"
          >
            <FaChess />
            Chess
          </Link>
        </li>
        <li>
          <Link
            to="/sudoku"
            className="flex items-center gap-3 font-bold text-lg p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition"
          >
            <FaPuzzlePiece />
            Sudoku
          </Link>
        </li>
        <li>
          <Link
            to="/tic-tac-toe"
            className="flex items-center gap-3 font-bold text-lg p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition"
          >
            <TbGridDots />
            Tic Tac Toe
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Menu;
