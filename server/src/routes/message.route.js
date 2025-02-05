import express from "express";
import { viewMessage } from "../controllers/message.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/message", verifyToken, viewMessage);

export default router;
