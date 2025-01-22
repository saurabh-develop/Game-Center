import React, { useState } from "react";
import { generateSudoku, fillBoard } from "./SudokuGenerator";
import "./SudokuBoard.css";

const SudokuBoard = ({ goToTicTacToe }) => {
  const [difficulty, setDifficulty] = useState("easy");
  const [board, setBoard] = useState(generateSudoku(difficulty));
  const [conflicts, setConflicts] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(false))
  );

  // Function to check if the move is valid
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

  // Handle input changes in Sudoku grid
  const handleChange = (row, col, value) => {
    if (value === "" || (value >= "1" && value <= "9")) {
      const newBoard = [...board];
      newBoard[row][col] = value === "" ? "" : parseInt(value);
      setBoard(newBoard);
      updateConflicts(newBoard);
    }
  };

  // Update conflicts based on new board state
  const updateConflicts = (newBoard) => {
    const newConflicts = newBoard.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (cell === "") return false;
        return !isValidMove(rowIndex, colIndex, cell);
      })
    );
    setConflicts(newConflicts);
  };

  // Check if the solution is correct
  const checkSolution = () => {
    const isComplete = true;
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

  // Generate a new Sudoku puzzle
  const generateNewPuzzle = () => {
    const newBoard = generateSudoku(difficulty);
    setBoard(newBoard);
    setConflicts(Array.from({ length: 9 }, () => Array(9).fill(false)));
  };

  // Change the difficulty of the puzzle
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    generateNewPuzzle();
  };

  // Solve the Sudoku board automatically
  const solveBoard = () => {
    const solvedBoard = board.map((row) => [...row]);
    if (fillBoard(solvedBoard)) {
      setBoard(solvedBoard);
    } else {
      alert("The board cannot be solved.");
    }
  };

  // Provide a hint for solving the Sudoku
  const giveHint = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === "") {
          const solvedBoard = board.map((r) => [...r]);
          fillBoard(solvedBoard);
          setBoard((prevBoard) =>
            prevBoard.map((r, rowIndex) =>
              r.map((cell, colIndex) =>
                rowIndex === row && colIndex === col
                  ? solvedBoard[row][col]
                  : cell
              )
            )
          );
          return;
        }
      }
    }
    alert("No hints available!");
  };

  return (
    <div className="sudoku-board">
      <div className="difficulty-buttons">
        <button onClick={() => handleDifficultyChange("easy")}>Easy</button>
        <button onClick={() => handleDifficultyChange("medium")}>Medium</button>
        <button onClick={() => handleDifficultyChange("hard")}>Hard</button>
      </div>

      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="sudoku-row">
          {row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              maxLength={1}
              value={cell === 0 ? "" : cell.toString()}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              className={`sudoku-cell ${
                conflicts[rowIndex][colIndex] ? "conflict" : ""
              } ${
                (rowIndex + 1) % 3 === 0 && rowIndex !== 8
                  ? "bottom-border"
                  : ""
              } ${
                (colIndex + 1) % 3 === 0 && colIndex !== 8 ? "right-border" : ""
              }`}
              readOnly={cell !== ""}
            />
          ))}
        </div>
      ))}

      <div className="action-buttons">
        <button className="check-button" onClick={checkSolution}>
          Check Solution
        </button>
        <button className="new-button" onClick={generateNewPuzzle}>
          New Puzzle
        </button>
        <button className="solve-button" onClick={solveBoard}>
          Solve
        </button>
        <button className="hint-button" onClick={giveHint}>
          Hint
        </button>
      </div>

      <button className="back-to-tictactoe" onClick={goToTicTacToe}>
        Go to Tic-Tac-Toe
      </button>
    </div>
  );
};

export default SudokuBoard;
