import React, { useEffect, useState, useRef } from "react";
import useSocket from "../../hooks/useSocket.jsx";
import GameChat from "../ChatBox/GameChat.jsx";
import Button from "../Chess/Button.jsx";
import SudokuBoard from "./SudokuBoard.jsx";

export const INIT_GAME = "init_game";
export const SUDOKU_MOVE = "sudoku move";
export const GAME = "sudoku";
export const GAME_OVER = "game over";
export const TIMER_UPDATE = "timer update";

const SudokuGame = () => {
  const socket = useSocket();
  const [initialBoard, setInitialBoard] = useState([]);
  const [board, setBoard] = useState([]);
  const [started, setStarted] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const scrollRef = useRef(null);
  const [playerId, setPlayerId] = useState(null);
  const [mode, setMode] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");

  const handleMove = (row, col, value) => {
    socket.send(
      JSON.stringify({
        type: SUDOKU_MOVE,
        payload: { row, col, value },
      })
    );
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((row) => [...row]);
      newBoard[row][col] = value;
      return newBoard;
    });
  };

  useEffect(() => {
    if (!socket) return;

    const id = crypto.randomUUID();
    setPlayerId(id);

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "join", payload: { playerId: id } }));
    } else {
      socket.onopen = () => {
        socket.send(
          JSON.stringify({ type: "join", payload: { playerId: id } })
        );
      };
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          setStarted(true);
          setBoard(message.payload.board);
          setInitialBoard(message.payload.board);
          setMode(message.payload.mode);
          setMoveHistory([]);
          setElapsedTime(0);
          break;

        case GAME_OVER:
          setStarted(false);
          setElapsedTime(0);
          alert(`Game Over: ${message.payload.reason}`);
          break;

        case TIMER_UPDATE:
          setElapsedTime(message.payload.elapsed);
          break;
      }
    };
  }, [socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moveHistory]);

  const startGame = (selectedMode, selectedDifficulty) => {
    if (!playerId) return; // prevent sending prematurely

    setMode(selectedMode);
    socket.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          game: "sudoku",
          mode: selectedMode,
          difficulty: selectedDifficulty,
          playerId,
        },
      })
    );
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.max(0, Math.floor((5 * 60 * 1000 - ms) / 1000));
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex justify-center items-center px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-screen-xl w-full">
        {/* Sudoku Board Section */}
        <div className="md:col-span-4 bg-gray-800 rounded-2xl p-6 shadow-xl flex justify-center items-center min-h-[520px]">
          {started ? (
            <SudokuBoard
              board={board}
              initialBoard={initialBoard}
              onCellChange={handleMove}
            />
          ) : (
            <img
              src="/sudoku3.png"
              alt="Sudoku Board"
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-lg"
            />
          )}
        </div>

        {/* Side Panel */}
        <div className="md:col-span-2 bg-gray-900 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-center items-center min-h-[520px]">
          {!started ? (
            <div className="w-full flex flex-col items-center space-y-8">
              <h2 className="text-2xl font-bold text-center">
                Choose Difficulty
              </h2>

              {/* Difficulty Buttons */}
              <div className="flex justify-center gap-4 w-full max-w-sm">
                {["easy", "medium", "hard"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`flex-1 py-3 rounded-xl text-base font-semibold capitalize transition-all duration-200 text-white
        ${
          difficulty === level
            ? "bg-gradient-to-r from-indigo-400 to-purple-500 shadow-lg"
            : "bg-gray-800 hover:bg-gray-700 text-gray-300"
        }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col w-full max-w-xs gap-4">
                <Button
                  onClick={() => startGame("solo", difficulty)}
                  color="blue"
                  className="py-3 text-lg font-semibold"
                >
                  Play Solo
                </Button>
                <Button
                  onClick={() => startGame("multiplayer", difficulty)}
                  color="blue"
                  className="py-3 text-lg font-semibold"
                >
                  1v1 Battle
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-between w-full h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Game Info</h2>
                <p className="text-lg font-mono text-blue-400">
                  Time Left: {formatTime(elapsedTime)}
                </p>
              </div>
              <div className="w-full mt-4 flex-1 overflow-hidden">
                {mode === "multiplayer" ? (
                  <GameChat socket={socket} selfId={playerId} />
                ) : (
                  <div className="text-gray-400 text-sm text-center mt-4">
                    Chat is disabled in Solo mode
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SudokuGame;
