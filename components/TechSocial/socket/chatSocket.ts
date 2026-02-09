"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectChatSocket = (onConnect?: () => void) => {
  // console.log("🔥 connectChatSocket invoked");
  // console.log("🌍 SOCKET URL =", process.env.NEXT_PUBLIC_SOCKET_URL);

  if (typeof window === "undefined") return null;
  if (socket) return socket;

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    // console.log("✅ Chat socket connected:", socket?.id);
    console.log("✅ Chat socket connected");
    onConnect?.();
  });

  socket.on("disconnect", (reason) => {
    console.warn("⚠️ Chat socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ socket error:", err.message);
  });

  return socket;
};

export const getChatSocket = () => socket;

export const disconnectChatSocket = () => {
  socket?.disconnect();
  socket = null;
};
