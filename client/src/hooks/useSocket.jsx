import { useState, useEffect } from "react";

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const url = token
      ? `ws://localhost:8080?token=${token}`
      : "ws://localhost:8080";

    const ws = new WebSocket(url);

    ws.onopen = () => setSocket(ws);
    ws.onclose = () => setSocket(null);
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setSocket(null);
    };

    return () => ws.close();
  }, []);

  return socket;
};

export default useSocket;
