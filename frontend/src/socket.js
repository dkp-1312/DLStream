import { io } from "socket.io-client";
const URL = import.meta.env.backend_url || "http://localhost:3000"; // Fallback to localhost if env variable is not set
export const socket = io(URL, {
    autoConnect: false, // Prevent auto-connection
});
