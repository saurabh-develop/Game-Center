import React, { useEffect, useState } from "react";
import ChessBoard from "./ChessBoard.jsx";
import useSocket from "../../hooks/useSocket.jsx";
import Button from "./Button.jsx";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game over";

const ChessGame = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setStarted(true);
          setBoard(chess.board()); // Ensure board updates correctly
          console.log("Game Initialized");
          break;

        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("Move made");
          break;

        case GAME_OVER:
          console.log("Game Over");
          break;
      }
    };
  }, [socket]);

  if (!socket) {
    return <div>Connecting...</div>;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-4 w-full flex justify-center">
            <ChessBoard
              setBoard={setBoard}
              board={board}
              socket={socket}
              chess={chess}
            />
          </div>
          <div className="col-span-2 w-full flex justify-center items-center bg-gray-900 rounded-xl">
            {!started && (
              <Button
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    })
                  );
                }}
              >
                Play
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
