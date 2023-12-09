import { io } from "socket.io-client";


// "undefined" means the URL will be computed from the `window.location` object
const backend = import.meta.env.VITE_SERVER_URL;

export const socket = io(backend);

socket.on("connect", () => {
  console.log("connected: ");
});

socket.on("disconnect", (message) => {
    console.log("disconnected: ", message);
});