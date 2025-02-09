import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});
const userSocketMap = {};
const activeChats = new Map(); // Store which users are chatting
export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};
export const getActiveChat = (userId) => {
  return activeChats.get(userId) || null;
};
// Listening to new connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  userSocketMap[userId] = socket.id;

  //Broadcast Online users to all Users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  // Listen for when a user selects a chat
  socket.on("activeChat", ({ userId, chatWith }) => {
    activeChats.set(userId, chatWith);
    console.log(`User ${userId} is chatting with ${chatWith}`);
  });
  //Listening to typing Event
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", { senderId: userId });
    }
  });
  //listen for stop typing
  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      // Send stop typing event to the receiver
      io.to(receiverSocketId).emit("stoppedTyping", { senderId: userId });
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
