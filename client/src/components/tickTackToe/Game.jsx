import React, { useEffect, useState } from "react";
import Board from "./Board";
import Menu from "../Menu";

function Game({ goToSudoku }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const winner = calculateWinner(squares);
  let status = winner
    ? `Winner: ${winner}`
    : `Next player: ${isXNext ? "X" : "O"}`;
  let isCompleted = true;
  for (let i = 0; i < 9; i++) {
    if (squares[i] == null) {
      isCompleted = false;
    }
  }
  if (isCompleted && !winner) {
    status = "Match Tied";
  }

  const handleClick = (i) => {
    if (squares[i] || winner) return;

    const newSquares = squares.slice();
    newSquares[i] = isXNext ? "X" : "O";
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <>
      <Menu />
      <div className="flex items-center justify-center min-h-screen">
        <div className="game p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="game-status text-center mb-4 text-lg sm:text-xl">
            {status}
          </div>
          <Board squares={squares} onSquareClick={handleClick} />
          <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 justify-center">
            <button
              className="reset-button bg-blue-500 text-white p-2 rounded-md hover:bg-blue-400 focus:outline-none mb-2 sm:mb-0"
              onClick={resetGame}
            >
              Reset Game
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
