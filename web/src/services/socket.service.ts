import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket() {
  const API_URL = (import.meta.env.VITE_API_URL as string) || "REPLACE_ME_VITE_API_URL";
  const BE_URL = API_URL.replace("/api/v1", "");
  if (!socket) {
    socket = io(BE_URL + "/chat", {
      transports: ["websocket"],
      withCredentials: true,
    });
  }

  socket.on("connect", () => {
    console.log("✅ WS connected", socket?.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ WS connect error", err.message);
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
