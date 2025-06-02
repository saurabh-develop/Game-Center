import React, { useState } from "react";
import { CHESS_MOVE } from "./ChessGame";

const ChessBoard = ({ board, socket, color, onLocalMove }) => {
  const [from, setFrom] = useState(null);
  if (!color || !board) return null;

  const handleDragStart = (e, squareRepresentation, square) => {
    if (!square || square.color !== color[0]) return;
    setFrom(squareRepresentation);
    e.dataTransfer.setData("text/plain", squareRepresentation);
  };

  const handleDrop = (e, toSquareRepresentation) => {
    e.preventDefault();
    const fromSquareRepresentation = e.dataTransfer.getData("text/plain");

    if (fromSquareRepresentation !== toSquareRepresentation) {
      const move = {
        from: fromSquareRepresentation,
        to: toSquareRepresentation,
      };

      socket.send(
        JSON.stringify({
          type: CHESS_MOVE,
          payload: { move },
        })
      );

      if (onLocalMove) {
        onLocalMove(move);
      }
    }

    setFrom(null);
  };

  const handleClick = (squareRepresentation, square) => {
    if (!square || square.color !== color[0]) {
      if (from && from !== squareRepresentation) {
        const move = {
          from,
          to: squareRepresentation,
        };

        socket.send(
          JSON.stringify({
            type: CHESS_MOVE,
            payload: { move },
          })
        );

        if (onLocalMove) {
          onLocalMove(move);
        }
        setFrom(null);
      }
      return;
    }

    if (!from) {
      setFrom(squareRepresentation);
    } else {
      if (from === squareRepresentation) {
        setFrom(null);
      } else {
        const move = {
          from,
          to: squareRepresentation,
        };

        socket.send(
          JSON.stringify({
            type: CHESS_MOVE,
            payload: { move },
          })
        );

        if (onLocalMove) {
          onLocalMove(move);
        }

        setFrom(null);
      }
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="text-white">
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => {
            const squareRepresentation = String.fromCharCode(97 + j) + (8 - i);

            return (
              <div
                key={j}
                onClick={() => handleClick(squareRepresentation, square)}
                onDrop={(e) => handleDrop(e, squareRepresentation)}
                onDragOver={handleDragOver}
                className={`w-20 h-20 flex items-center justify-center text-black ${
                  (i + j) % 2 !== 0 ? "bg-green-600" : "bg-green-100"
                }`}
              >
                <div className="w-full justify-center flex h-full">
                  <div
                    className="h-full justify-center flex flex-col"
                    draggable={square?.color === color[0]}
                    onDragStart={(e) =>
                      handleDragStart(e, squareRepresentation, square)
                    }
                  >
                    {square && (
                      <img
                        className="w-20"
                        src={`/${
                          square.color === "b"
                            ? square.type
                            : `${square.type.toUpperCase()} copy`
                        }.png`}
                        alt={`${square.color} ${square.type}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
