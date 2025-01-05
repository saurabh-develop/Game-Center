import React, { useState } from "react";
import SudokuBoard from "./components/Sudoku/SudokuBoard.jsx";
import Game from "./components/tickTackToe/Game.jsx";

function App() {
  const [gameSelected, setGameSelected] = useState(null);

  const handleGameSelection = (game) => {
    setGameSelected(game);
  };

  return (
    <div className="app-container">
      {!gameSelected ? (
        <div className="game-selection">
          <h1>Choose a Game</h1>
          <button onClick={() => handleGameSelection("sudoku")}>
            Play Sudoku
          </button>
          <button onClick={() => handleGameSelection("tictactoe")}>
            Play Tic-Tac-Toe
          </button>
        </div>
      ) : (
        <div className="game-container">
          {gameSelected === "sudoku" && (
            <SudokuBoard goToTicTacToe={() => setGameSelected("tictactoe")} />
          )}
          {gameSelected === "tictactoe" && (
            <Game goToSudoku={() => setGameSelected("sudoku")} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
