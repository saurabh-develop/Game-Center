import React, { useEffect, useState, useRef } from "react";
import useSocket from "../../hooks/useSocket.jsx";
import GameChat from "../ChatBox/GameChat.jsx";
import Button from "../Chess/Button.jsx";

export const INIT_GAME = "init_game";
export const TIC_TAC_TOE_MOVE = "tic tac toe move";
export const GAME_OVER = "game over";
export const UPDATE_GAME = "update game";
export const GAME = "ticTacToe";

const TicTacToeGame = () => {
  const socket = useSocket();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [started, setStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState("X");
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const scrollRef = useRef(null);

  const handleMove = (index) => {
    if (!started || board[index] !== null || currentTurn !== playerSymbol)
      return;

    socket.send(
      JSON.stringify({
        type: TIC_TAC_TOE_MOVE,
        payload: { index },
      })
    );
  };

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
          setBoard(Array(9).fill(null));
          setPlayerSymbol(message.payload.symbol);
          break;

        case UPDATE_GAME:
          setBoard(message.payload.board);
          setCurrentTurn(message.payload.currentPlayer);
          break;

        case GAME_OVER:
          setStarted(false);
          if (message.payload?.reason === "Opponent disconnected") {
            alert("Your opponent has disconnected. You win by default.");
          } else {
            alert(`Game Over: ${message.payload?.reason}`);
          }
          break;
      }
    };
  }, [socket]);

  const startGame = () => {
    if (!playerId) return;

    socket.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          game: GAME,
          playerId,
        },
      })
    );
  };

  const renderCell = (index) => {
    const value = board[index];
    const isX = value === "X";
    const isO = value === "O";

    return (
      <div
        key={index}
        onClick={() => handleMove(index)}
        className={`
          w-24 h-24 md:w-28 md:h-28 
          rounded-xl 
          border-2 
          border-transparent 
          bg-black 
          flex justify-center items-center 
          cursor-pointer 
          transition-all duration-200 
          select-none 
          shadow-[0_0_10px_#00f7ff40]
          hover:shadow-[0_0_15px_#00f7ff80]
          hover:border-cyan-400
          text-5xl font-extrabold
          ${
            isX
              ? "text-pink-400 shadow-[0_0_10px_#ff00ff90]"
              : isO
              ? "text-cyan-400 shadow-[0_0_10px_#00ffff90]"
              : "text-white"
          }
        `}
      >
        {value}
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4 py-6">
      <div className="grid md:grid-cols-6 gap-6 max-w-screen-xl w-full h-full">
        <div className="md:col-span-4 flex justify-center items-center bg-[#1f2937] rounded-xl shadow-xl p-4">
          <div className="w-full max-w-[90vw] md:max-w-[600px] aspect-square flex justify-center items-center">
            {started ? (
              <div className="grid grid-cols-3 gap-3 bg-black p-4 rounded-2xl border border-white/10 shadow-[0_0_25px_#00f7ff30]">
                {Array(9)
                  .fill(null)
                  .map((_, i) => renderCell(i))}
              </div>
            ) : (
              <img
                src="/tictactoe4.png"
                className="max-w-[80%] h-auto object-contain"
                alt="Tic Tac Toe"
              />
            )}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col bg-[#111827] rounded-xl shadow-xl p-4 text-white max-h-[calc(100vh-5rem)] overflow-y-auto">
          {!started ? (
            <div className="flex justify-center items-center flex-grow">
              <Button onClick={startGame} color="blue">
                Start Mutliplayer
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-xl mb-2 font-semibold">Game Info</h2>
              <p className="mb-2">
                You are: <strong>{playerSymbol}</strong>
              </p>
              <p className="mb-4">
                Turn: <strong>{currentTurn}</strong>
              </p>
              <div className="flex-grow overflow-y-auto bg-[#1e293b] rounded-md p-3">
                <GameChat socket={socket} selfId={playerId} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicTacToeGame;
