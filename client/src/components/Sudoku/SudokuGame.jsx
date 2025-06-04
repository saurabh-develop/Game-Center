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
          setMoveHistory([]);
          break;

        case GAME_OVER:
          setStarted(false);
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

  const startGame = () => {
    socket.send(
      JSON.stringify({ type: INIT_GAME, payload: { game: "sudoku" } })
    );
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.max(0, Math.floor((5 * 60 * 1000 - ms) / 1000));
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex justify-center items-center pt-17 max-w-screen-lg mx-auto">
      <div className="grid grid-cols-6 gap-4 w-full">
        <div className="col-span-4 flex justify-center items-center min-h-[500px]">
          {started ? (
            <SudokuBoard
              board={board}
              initialBoard={initialBoard}
              onCellChange={handleMove}
            />
          ) : (
            <img
              src="/sudoku3.png"
              className="max-w-[80%] h-auto object-contain"
              alt="Sudoku Board"
            />
          )}
        </div>

        <div className="col-span-2 bg-gray-900 rounded-xl p-4 text-white flex flex-col justify-center items-center">
          {!started ? (
            <Button onClick={startGame} color={"blue"}>
              Start Sudoku
            </Button>
          ) : (
            <>
              <h2 className="text-xl mb-2">Game Info</h2>
              <p>Time Left: {formatTime(elapsedTime)}</p>
              <GameChat socket={socket} selfId={playerId} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SudokuGame;
