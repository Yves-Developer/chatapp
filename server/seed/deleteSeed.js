import { connectDB } from "../lib/connectDB.js";
import dotenv from "dotenv";
import Message from "../models/message.model.js"; // Adjust the path based on your structure

dotenv.config(); // Load environment variables

// MongoDB connection string from .env

const deleteMessages = async () => {
  try {
    connectDB();

    console.log("Connected to MongoDB...");

    // Define the delete filter
    const filter = {
      senderId: "67a28a1bb9ab87789119ec99",
      receiverId: "67a51800183e3ae2259d6fbb",
    };

    // Delete the messages
    const result = await Message.deleteMany({});

    console.log(`Deleted ${result.deletedCount} messages.`);

    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("Error deleting messages:", error);
  }
};

// Run the script
deleteMessages();
