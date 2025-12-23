import { io } from "socket.io-client";

export const socket = io("https://server-pollingapp.onrender.com", {
  transports: ["websocket"],
});
