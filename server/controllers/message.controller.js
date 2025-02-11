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

    // Only mark messages as seen if markSeen=true is provided in the query string.
    const markSeen = req.query.markSeen === "true";

    const receiverSocketId = getReceiverSocketId(userToChat);
    const senderSocketId = getReceiverSocketId(myId);

    const chatMessages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChat },
        { senderId: userToChat, receiverId: myId },
      ],
    });

    if (markSeen) {
      const seenMessageIds = [];
      chatMessages.forEach((message) => {
        // Only mark incoming messages that are not already seen.
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
          { _id: { $in: seenMessageIds } },
          { $set: { status: "seen" } }
        );

        const seenMessages = await Message.find({
          $or: [
            { senderId: myId, receiverId: userToChat },
            { senderId: userToChat, receiverId: myId },
          ],
        });

        // Emit the seen message event to both users.
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("messageSeen", seenMessages);
        }
        if (senderSocketId) {
          io.to(senderSocketId).emit("messageSeen", seenMessages);
        }
      }
    }
    return res.status(200).json(chatMessages);
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

    // Default message status is "Sent"
    let status = "sent";

    // If the receiver is online, mark as "Delivered"
    if (receiverSocketId) {
      status = "Delivered";
    }

    // Create and save the message
    let sentMessage = await new Message({
      senderId,
      receiverId,
      text,
      status,
    }).save();

    // Emit "newMessage" event to receiver if they are online
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", sentMessage);
    }

    // ✅ Update message status to "Seen" only if both users have selected each other for active chat
    if (
      getActiveChat(senderId) === receiverId &&
      getActiveChat(receiverId) === senderId
    ) {
      sentMessage.status = "seen";
      await sentMessage.save(); // Save only when status changes to "Seen"

      // Emit "messageSeen" event to both sender and receiver if they are online
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageSeen", [sentMessage]);
      }

      const senderSocketId = getReceiverSocketId(senderId); // Get sender socket ID
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageSeen", [sentMessage]);
      }
    }

    return res.status(200).json(sentMessage);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
