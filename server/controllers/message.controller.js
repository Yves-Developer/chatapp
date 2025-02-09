import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, getActiveChat, io } from "../lib/socket.js";
export const getUserToChat = async (req, res) => {
  try {
    const myId = req.userId.userId;
    const filteredUsers = await User.find({ _id: { $ne: myId } }).select(
      "-password"
    );
    return res.status(200).json(filteredUsers);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessagesById = async (req, res) => {
  try {
    const { id: userToChat } = req.params;

    const myId = req.userId.userId;
    const receiverSocketId = getReceiverSocketId(userToChat);
    const senderSocketId = getReceiverSocketId(myId);
    const chatMessage = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChat },
        { senderId: userToChat, receiverId: myId },
      ],
    });
    const seenMessageIds = [];
    chatMessage.forEach((message) => {
      if (
        message.status !== "seen" &&
        String(message.senderId) === String(userToChat)
      ) {
        message.status = "seen";
        seenMessageIds.push(message._id);
      }
    });
    if (seenMessageIds.length > 0) {
      await Message.updateMany(
        {
          _id: { $in: seenMessageIds },
        },
        { $set: { status: "seen" } }
      );

      const seenMessage = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChat },
          { senderId: userToChat, receiverId: myId },
        ],
      });

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageSeen", seenMessage);
      }

      if (senderSocketId) {
        io.to(senderSocketId).emit("messageSeen", seenMessage);
      }
    }
    return res.status(200).json(chatMessage);
  } catch (error) {
    console.log("Error in getting messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessagesById = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userId.userId;
    const receiverSocketId = getReceiverSocketId(receiverId);

    const sentMessage = new Message({
      senderId,
      receiverId,
      text,
      status: receiverSocketId ? "Delivered" : "sent",
    });

    await sentMessage.save();

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", sentMessage);
    }
    // ✅ Mark message as "Seen" only if both users have selected each other
    if (
      getActiveChat(senderId) === receiverId &&
      getActiveChat(receiverId) === senderId
    ) {
      sentMessage.status = "Seen";
      await sentMessage.save();

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageSeen", [sentMessage]);
      }
    }
    return res.status(200).json(sentMessage);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
