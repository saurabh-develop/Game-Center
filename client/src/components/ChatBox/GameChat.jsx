// GameChat.jsx
import React, { useState, useEffect, useRef } from "react";

export const CHAT = "chat";

const GameChat = ({ socket, color }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    socket.send(
      JSON.stringify({
        type: CHAT,
        payload: { message: chatInput.trim(), from: color },
      })
    );
    setChatMessages((prev) => [
      ...prev,
      { from: color, text: chatInput.trim() },
    ]);
    setChatInput("");
  };

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === CHAT) {
        setChatMessages((prev) => [
          ...prev,
          {
            from: message.payload.from,
            text: message.payload.message,
          },
        ]);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  return (
    <div className="mt-6 w-full">
      <h2 className="text-xl mb-2 text-white">Chat</h2>
      <div className="bg-gray-800 p-3 rounded-xl h-48 overflow-y-auto mb-2 text-sm flex flex-col space-y-2">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] px-3 py-1 rounded-lg break-words ${
              msg.from === color
                ? "ml-auto bg-gray-700 text-white text-right"
                : "mr-auto bg-blue-600 text-white text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendChat()}
          className="flex-grow p-2 rounded bg-gray-700 text-white"
          placeholder="Type a message..."
        />
        <button
          onClick={sendChat}
          className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GameChat;
