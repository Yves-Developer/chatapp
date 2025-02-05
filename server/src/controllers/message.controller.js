import User from "../models/user.model.js";
import Message from "../models/message.model.js";
export const getUserToChat = async (req, res) => {
  try {
    const myId = req.userId.userId;
    const filteredUsers = await User.find({ _id: { $ne: myId } }).select(
      "-password"
    );
    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessagesById = async (req, res) => {
  try {
    const { id: userToChat } = req.params;
    const myId = req.userId.userId;
    console.log(myId, "---", userToChat);
    const chatMessage = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChat },
        { senderId: userToChat, receiverId: myId },
      ],
    });

    return res.status(200).json(chatMessage);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessagesById = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userId.userId;
    const sentMessage = new Message({
      senderId,
      receiverId,
      text,
    });

    await sentMessage.save();

    return res.status(200).json(sentMessage);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
