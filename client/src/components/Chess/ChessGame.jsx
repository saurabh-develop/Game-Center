import React, { useEffect, useState, useRef } from "react";
import ChessBoard from "./ChessBoard.jsx";
import useSocket from "../../hooks/useSocket.jsx";
import Button from "./Button.jsx";
import { Chess } from "chess.js";
import GameChat from "../ChatBox/GameChat.jsx";

export const INIT_GAME = "init_game";
export const CHESS_MOVE = "chess move";
export const GAME = "sudoku";
export const GAME_OVER = "game over";

const ChessGame = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const moveCount = useRef(0);
  const [color, setColor] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const moveHistoryBottomRef = useRef(null);
  const [playerId, setPlayerId] = useState(null);

  useEffect(() => {
    moveHistoryBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [moveHistory]);

  useEffect(() => {
    if (!socket) return;

    const id = crypto.randomUUID();
    setPlayerId(id);

    const sendJoin = () =>
      socket.send(JSON.stringify({ type: "join", payload: { playerId: id } }));

    if (socket.readyState === WebSocket.OPEN) {
      sendJoin();
    } else {
      socket.onopen = sendJoin;
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          setStarted(true);
          setBoard(chess.board());
          setColor(message.payload.color);
          setMoveHistory([]);
          moveCount.current = 0;
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
      JSON.stringify({ type: INIT_GAME, payload: { game: "chess" } })
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
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-4">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl items-center justify-center">
        {/* Chess Board */}
        <div className="bg-[#1f2937] p-4 rounded-xl shadow-xl flex items-center justify-center">
          <div className="w-[300px] md:w-[500px] aspect-square">
            <ChessBoard
              board={board}
              setBoard={setBoard}
              socket={socket}
              chess={chess}
              color={started && color ? color : "white"}
              onLocalMove={started ? handleLocalMove : undefined}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-[#111827] text-white rounded-xl shadow-xl p-4 w-full md:w-[300px] flex flex-col h-[500px] justify-between">
          {started ? (
            <>
              {/* Game Info */}
              <div className="mb-2">
                <h2 className="text-2xl font-semibold mb-2">Game Info</h2>
                <p className="text-gray-300">
                  You are: <span className="font-bold">{color}</span>
                </p>
                <p className="text-gray-300">
                  Turn: <span className="font-bold">X</span>
                </p>
              </div>

              {/* Move History */}
              <div className="mb-2">
                <h3 className="font-semibold text-lg mb-1">Move History</h3>
                <div className="bg-[#1e293b] rounded-md h-24 overflow-y-auto p-2 text-sm shadow-inner space-y-1">
                  {moveHistory.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                  <div ref={moveHistoryBottomRef} />
                </div>
              </div>

              {/* Game Chat */}
              <div className="flex-grow bg-[#1e293b] rounded-md p-2 overflow-y-auto">
                <GameChat socket={socket} selfId={playerId} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Button onClick={startGame} color="green">
                Start Game
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
