import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LandingChess from "./components/Chess/LandingChess.jsx";
import ChessGame from "./components/Chess/ChessGame.jsx";
import SudokuGame from "./components/Sudoku/SudokuGame.jsx";
import LandingSudoku from "./components/Sudoku/LandingSudoku.jsx";
import TicTacToeGame from "./components/tickTackToe/TicTacToeGame.jsx";
import LandingTicTacToe from "./components/tickTackToe/LandingTicTacToe.jsx";
import Login from "./components/Auth/Login.jsx";
import Registration from "./components/Auth/Registration.jsx";
import Landing from "./components/Landing/Landing.jsx";

import GameSelection from "./components/GameSelection/GameSelection.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/game-selection" element={<GameSelection />} />
        <Route path="/chess" element={<LandingChess />} />
        <Route path="/chessBoard" element={<ChessGame />} />
        <Route path="/sudoku" element={<LandingSudoku />} />
        <Route path="/sudokuBoard" element={<SudokuGame />} />
        <Route path="/tic-tac-toe" element={<LandingTicTacToe />} />
        <Route path="/tic-tac-toe-board" element={<TicTacToeGame />} />
      </Routes>
    </BrowserRouter>
  );
}

const LandingPage = () => (
  <div className="bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-700 flex flex-col items-center justify-center h-screen text-gray-300">
    <Landing />
  </div>
);

export default App;
