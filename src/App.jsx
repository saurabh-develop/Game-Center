import { useState } from "react";
import OCRUploader from "./components/OCRUploader.jsx";
import SudokuGrid from "./components/GridInput.jsx";
import SudokuSolver from "./utils/SudokuSolver.jsx";
import parseOCRText from "./utils/parseOCRText.jsx";

function App() {
  const [sudokuGrid, setSudokuGrid] = useState(Array(9).fill(Array(9).fill(0)));

  const handleOCRComplete = (ocrText) => {
    const grid = parseOCRText(ocrText);
    setSudokuGrid(grid);
  };

  const solveSudoku = () => {
    const solvedGrid = SudokuSolver(sudokuGrid);
    setSudokuGrid(solvedGrid);
  };

  return (
    <>
      <div>
        <h1>Sudoku Solver</h1>
        <OCRUploader onProcessComplete={handleOCRComplete} />
        OCR extract data: {sudokuGrid}
        <SudokuGrid grid={sudokuGrid} onSolve={solveSudoku} />
      </div>
    </>
  );
}

export default App;
