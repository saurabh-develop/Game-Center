import { useState } from "react";
import OCRUploader from "./components/OCRUploader.jsx";
import SudokuGrid from "./components/GridInput.jsx";
import SudokuSolver from "./utils/SudokuSolver.jsx";
import parseOCRText from "./utils/parseOCRText.jsx";

function App() {
  const [sudokuGrid, setSudokuGrid] = useState(Array(9).fill(Array(9).fill(0)));
  const [isSolved, setIsSolved] = useState(false);

  const handleOCRComplete = (ocrText) => {
    const grid = parseOCRText(ocrText);
    setSudokuGrid(grid);
    setIsSolved(false); // Reset solved status
  };

  const solveSudoku = () => {
    const solvedGrid = SudokuSolver(sudokuGrid);
    if (solvedGrid) {
      setSudokuGrid(solvedGrid);
      setIsSolved(true);
    } else {
      alert("No solution found for this Sudoku puzzle.");
    }
  };

  return (
    <div style={{ color: "#fff", padding: "20px" }}>
      <h1>Sudoku Solver</h1>
      <OCRUploader onProcessComplete={handleOCRComplete} />
      <SudokuGrid grid={sudokuGrid} />

      <button
        onClick={solveSudoku}
        disabled={isSolved}
        style={{ marginTop: "10px" }}
      >
        {isSolved ? "Solved" : "Solve Sudoku"}
      </button>

      <h2>Extracted Sudoku Grid:</h2>
      <SudokuGrid grid={sudokuGrid} />

      {isSolved && (
        <>
          <h2>Solved Sudoku Grid:</h2>
          <SudokuGrid grid={sudokuGrid} />
        </>
      )}
    </div>
  );
}

export default App;
