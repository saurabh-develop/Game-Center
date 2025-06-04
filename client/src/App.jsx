import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Game from "./components/tickTackToe/Game.jsx";
import LandingChess from "./components/Chess/LandingChess.jsx";
import "./App.css";
import ChessGame from "./components/Chess/ChessGame.jsx";
import SudokuGame from "./components/Sudoku/SudokuGame.jsx";
import LandingSudoku from "./components/Sudoku/LandingSudoku.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameSelection />} />
        <Route path="/chess" element={<LandingChess />} />
        <Route path="/chessBoard" element={<ChessGame />} />
        <Route path="/sudoku" element={<LandingSudoku />} />
        <Route path="/sudokuBoard" element={<SudokuGame />} />
        <Route path="/tic-tac-toe" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

// Extracted Game Selection as a Separate Component
const GameSelection = () => (
  <div className="game-selection flex flex-col items-center justify-center h-screen text-gray-300">
    <h1 className="text-2xl font-bold mb-6">Choose a Game</h1>
    <div className="flex flex-col gap-4">
      <Link to="/chess" className="btn">
        Play Chess
      </Link>
      <Link to="/sudoku" className="btn">
        Play Sudoku
      </Link>
      <Link to="/tic-tac-toe" className="btn">
        Play Tic-Tac-Toe
      </Link>
    </div>
  </div>
);

export default App;
