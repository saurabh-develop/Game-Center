import React, { useState } from "react";
import { generateSudoku, fillBoard } from "./SudokuGenerator";
import "./SudokuBoard.css";
import Menu from "../Menu";

const SudokuBoard = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const initialBoard = generateSudoku(difficulty);
  const [board, setBoard] = useState(initialBoard);
  const [fixedCells, setFixedCells] = useState(
    initialBoard.map((row) => row.map((cell) => cell !== ""))
  );
  const [conflicts, setConflicts] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(false))
  );

  const isValidMove = (row, col, value) => {
    for (let i = 0; i < 9; i++) {
      if (
        (board[row][i] === value && i !== col) ||
        (board[i][col] === value && i !== row)
      ) {
        return false;
      }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          board[startRow + i][startCol + j] === value &&
          (startRow + i !== row || startCol + j !== col)
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const handleChange = (row, col, value) => {
    if (value === "" || (value >= "1" && value <= "9")) {
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = value === "" ? "" : parseInt(value);
      setBoard(newBoard);
      updateConflicts(newBoard);
    }
  };

  const updateConflicts = (newBoard) => {
    const newConflicts = newBoard.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (cell === "") return false;
        return !isValidMove(rowIndex, colIndex, cell);
      })
    );
    setConflicts(newConflicts);
  };

  const checkSolution = () => {
    let isComplete = true;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === "") {
          isComplete = false;
        }
      }
    }
    const hasConflict = conflicts.some((row) => row.includes(true));
    if (!isComplete) {
      alert("The board is not complete.");
    } else if (hasConflict) {
      alert("There are conflicts in the solution.");
    } else {
      alert("Congratulations! The solution is correct.");
    }
  };

  const generateNewPuzzle = () => {
    const newBoard = generateSudoku(difficulty);
    setBoard(newBoard);
    setFixedCells(newBoard.map((row) => row.map((cell) => cell !== "")));
    setConflicts(Array.from({ length: 9 }, () => Array(9).fill(false)));
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    const newBoard = generateSudoku(newDifficulty);
    setBoard(newBoard);
    setFixedCells(newBoard.map((row) => row.map((cell) => cell !== "")));
    setConflicts(Array.from({ length: 9 }, () => Array(9).fill(false)));
  };

  const solveBoard = () => {
    const solvedBoard = board.map((row) => [...row]);
    if (fillBoard(solvedBoard)) {
      setBoard(solvedBoard);
      setFixedCells(solvedBoard.map((row) => row.map(() => true)));
    } else {
      alert("The board cannot be solved.");
    }
  };

  const giveHint = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === "") {
          const solvedBoard = board.map((r) => [...r]);
          if (fillBoard(solvedBoard)) {
            setBoard((prevBoard) =>
              prevBoard.map((r, rowIndex) =>
                r.map((cell, colIndex) =>
                  rowIndex === row && colIndex === col
                    ? solvedBoard[row][col]
                    : cell
                )
              )
            );
            const newFixed = fixedCells.map((r, rowIndex) =>
              r.map((cell, colIndex) =>
                rowIndex === row && colIndex === col ? true : cell
              )
            );
            setFixedCells(newFixed);
          }
          return;
        }
      }
    }
    alert("No hints available!");
  };

  return (
    <>
      <Menu />
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center p-6 max-w-xl rounded-lg shadow-lg w-full">
          {/* Difficulty Buttons */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => handleDifficultyChange("easy")}
              className="py-2 px-4 border border-gray-300 rounded-lg text-base"
            >
              Easy
            </button>
            <button
              onClick={() => handleDifficultyChange("medium")}
              className="py-2 px-4 border border-gray-300 rounded-lg text-base"
            >
              Medium
            </button>
            <button
              onClick={() => handleDifficultyChange("hard")}
              className="py-2 px-4 border border-gray-300 rounded-lg text-base"
            >
              Hard
            </button>
          </div>

          {/* Sudoku Grid */}
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex mb-2 justify-center">
              {row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  maxLength={1}
                  value={cell === 0 ? "" : cell.toString()}
                  onChange={(e) =>
                    handleChange(rowIndex, colIndex, e.target.value)
                  }
                  className={`w-10 h-10 text-center border border-gray-500 rounded-lg mx-1 text-lg ${
                    conflicts[rowIndex][colIndex] ? "border-red-500" : ""
                  } ${
                    (rowIndex + 1) % 3 === 0 && rowIndex !== 8
                      ? "border-b-2"
                      : ""
                  } ${
                    (colIndex + 1) % 3 === 0 && colIndex !== 8
                      ? "border-r-2"
                      : ""
                  }`}
                  readOnly={fixedCells[rowIndex][colIndex]}
                />
              ))}
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex gap-4 mb-4">
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded-lg text-base"
              onClick={checkSolution}
            >
              Check Solution
            </button>
            <button
              className="py-2 px-4 bg-gray-200 border border-gray-300 rounded-lg text-base"
              onClick={generateNewPuzzle}
            >
              New Puzzle
            </button>
            <button
              className="py-2 px-4 bg-green-500 text-white rounded-lg text-base"
              onClick={solveBoard}
            >
              Solve
            </button>
            <button
              className="py-2 px-4 bg-yellow-500 text-white rounded-lg text-base"
              onClick={giveHint}
            >
              Hint
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SudokuBoard;
