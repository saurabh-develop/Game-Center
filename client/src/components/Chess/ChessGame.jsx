import React, { useEffect, useState, useRef } from "react";
import ChessBoard from "./ChessBoard.jsx";
import useSocket from "../../hooks/useSocket.jsx";
import Button from "./Button.jsx";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const CHESS_MOVE = "chess move";
export const GAME = "chess";
export const GAME_OVER = "game over";

const ChessGame = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const moveCount = useRef(0);
  const [color, setColor] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          setStarted(true);
          setBoard(chess.board());
          setColor(message.payload.color);
          setMoveHistory([]);
          moveCount.current = 0;
          console.log("You are playing as", message.payload.color);
          break;

        case CHESS_MOVE:
          const move = message.payload;
          try {
            chess.move(move.move);
            moveCount.current++;
            setBoard(chess.board());
            setMoveHistory((prev) => [
              ...prev,
              `${moveCount.current}. ${move.move.from}-${move.move.to}`,
            ]);
            console.log("Move received:", move);
          } catch (error) {
            console.error("Invalid move received:", move, error);
          }
          break;

        case GAME_OVER:
          alert(`Game Over! ${message.payload.reason}`);
          setStarted(false);
          break;

        default:
          console.log("Unknown message type:", message.type);
      }
    };
  }, [socket, chess]);

  const startGame = () => {
    socket.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          game: "chess",
        },
      })
    );
  };

  const handleLocalMove = (move) => {
    try {
      chess.move(move);
      moveCount.current++;
      setBoard(chess.board());
      setMoveHistory((prev) => [
        ...prev,
        `${moveCount.current}. ${move.from}-${move.to}`,
      ]);
    } catch (error) {
      console.error("Invalid local move:", move, error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-4 w-full flex justify-center">
            {started && color ? (
              <ChessBoard
                board={board}
                setBoard={setBoard}
                socket={socket}
                chess={chess}
                color={color}
                onLocalMove={handleLocalMove}
              />
            ) : (
              <ChessBoard
                setBoard={setBoard}
                board={board}
                socket={socket}
                chess={chess}
                color={"white"}
              />
            )}
          </div>

          <div className="col-span-2 w-full flex justify-center items-center bg-gray-900 rounded-xl">
            {!started ? (
              <Button onClick={startGame}>Start Game</Button>
            ) : (
              <div className="text-white">
                <h2 className="text-xl mb-4">Game Controls</h2>
                <p>Color: {color}</p>
                <div className="w-full bg-gray-800 p-4 rounded-xl shadow-inner max-h-[500px] min-h-[400px] overflow-y-auto">
                  <strong>Moves History:</strong>
                  <br />
                  {moveHistory.map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
