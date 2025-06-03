import React from "react";

const SudokuBoard = ({ board, initialBoard, onCellChange }) => {
  return (
    <div className="grid grid-cols-9 gap-[2px] border border-white p-2">
      {board.map((row, i) =>
        row.map((cell, j) => {
          const isInitial = initialBoard[i][j] !== 0;
          return (
            <input
              key={`${i}-${j}`}
              value={cell === 0 ? "" : cell}
              onChange={(e) => onCellChange(i, j, +e.target.value || 0)}
              className={`w-16 h-16 text-2xl text-center font-bold rounded-sm border ${
                isInitial
                  ? "bg-gray-300 text-black"
                  : "bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              }`}
              disabled={isInitial}
              maxLength={1}
            />
          );
        })
      )}
    </div>
  );
};

export default SudokuBoard;
