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

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

// Listening to new connection
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);
  const userId = socket.handshake.query.userId;

  userSocketMap[userId] = socket.id;

  //Broadcast Online users to all Users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  //Listening to typing Event
  socket.on("typing", (receiverId) => {
    const receiverSocketId = userSocketMap[receiverId];
    io.to(receiverSocketId).emit("userTyping", userId);
  });
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
    console.log("User Disconnect:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
