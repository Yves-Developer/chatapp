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
export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};
const userSocketMap = {};
// Corrected the event name to 'connection'
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);
  const userId = socket.handshake.query.userId;

  userSocketMap[userId] = socket.id;

  //Broadcast Online users to all Users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnect:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
