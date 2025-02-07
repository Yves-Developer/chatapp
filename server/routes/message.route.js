import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getMessagesById,
  getUserToChat,
  sendMessagesById,
} from "../controllers/message.controller.js";
const router = express.Router();

router.get("/users", verifyToken, getUserToChat);
router.get("/:id", verifyToken, getMessagesById);
router.post("/send/:id", verifyToken, sendMessagesById);

export default router;
