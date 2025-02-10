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
  console.log("user connected!");
  const userId = socket.handshake.query.userId;

  userSocketMap[userId] = socket.id;

  // Broadcast Online users to all Users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for when a user selects a chat
  socket.on("activeChat", ({ userId, chatWith }) => {
    if (chatWith === null) {
      activeChats.delete(userId);
      console.log(`User ${userId} has stopped chatting`);
    } else {
      activeChats.set(userId, chatWith._id);
      console.log(`User ${userId} is chatting with ${chatWith._id}`);
    }
  });

  // Listening to typing Event
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", { senderId: userId });
    }
  });

  // Listen for stop typing
  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stoppedTyping", { senderId: userId });
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("user Disconnected");
    delete userSocketMap[userId];
    activeChats.delete(userId); // Clean up the active chat when the user disconnects
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
