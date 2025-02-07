import express from "express";
import {
  checkAuth,
  signin,
  signout,
  signup,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.get("/check", verifyToken, checkAuth);

export default router;
