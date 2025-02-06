import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Make sure this is your frontend URL
    credentials: true,
  },
});

// Corrected the event name to 'connection'
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnect:", socket.id);
  });
});

export { io, app, server };
