import express from "express";
import http from "http";
import dotenv from "dotenv";
import {Server} from "socket.io";

//import "dotenv/config"; 
dotenv.config();

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import routerF from "./routes/otp1.routes.js";

import routerProfile from "./routes/profile.route.js";

import routerStream from "./routes/stream.route.js";
import routerMeeting from "./routes/meetingRoutes.js";
import routerMeeting1 from "./routes/meetingRoutes1.js";

import routerS from "./routes/streamRoutes.js";
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
const frontend=process.env.frontend_url;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: frontend, // Replace with your frontend URL
  credentials: true, 
}));

app.use("/auth",authRoutes);
app.use("/otp",routerF);
app.use("/profile",routerProfile);

app.use("/stream",routerStream);
app.use("/meeting",routerMeeting);
app.use("/meeting1",routerMeeting1);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/streams", routerS);
app.use("/hls", express.static(path.join(__dirname, "hls")));


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
       origin: frontend,
       methods: ["GET", "POST"],
       credentials: true
      },
  });

const rooms = {}; // Object to track users in each room

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("join-room",(roomId,userId)=>{

    socket.join(roomId);

    socket.to(roomId).emit("user-connected",userId);

    socket.on("disconnect",()=>{
      socket.to(roomId).emit("user-disconnected",userId);
    });

  });
    socket.on("joinRoom", (room) => {
        if (!rooms[room]) {
            rooms[room] = new Set(); // Initialize the room if it doesn't exist
        }

        if (!rooms[room].has(socket.id)) {
            rooms[room].add(socket.id); // Add the user to the room
            socket.join(room); // Join the room
            console.log(`User ${socket.id} joined room: ${room}`);

            // Emit the updated user count to all clients in the room
            io.to(room).emit("userCount", rooms[room].size);
        } else {
            console.log(`User ${socket.id} is already in room: ${room}`);
        }
    });

    socket.on("sendMessage", ({ room, message }) => {
        console.log("Message to room:", room);
        io.to(room).emit("receiveMessage", message);
    });

    socket.on("liveStatusChanged", ({ room, isLive }) => {
        io.to(room).emit("updateLiveStatus", isLive);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        // Remove the user from all rooms they were part of
        for (const room in rooms) {
            if (rooms[room].has(socket.id)) {
                rooms[room].delete(socket.id);
                console.log(`User ${socket.id} removed from room: ${room}`);
                if (rooms[room].size === 0) {
                    delete rooms[room]; // Delete the room if no users are left
                } else {
                    // Emit the updated user count to all clients in the room
                    io.to(room).emit("userCount", rooms[room].size);
                }
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});