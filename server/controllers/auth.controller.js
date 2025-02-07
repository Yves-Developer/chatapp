import User from "../models/user.model.js";
import { encryptPassword } from "../utils/hashPassword.js";
import { jwtokenAndSetCookie } from "../utils/jwtokenAndsetCookie.js";
import bcrypt from "bcryptjs";

// Sign Up Controllers

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const hashPassword = await encryptPassword(password);
    const newUser = new User({ fullname, email, password: hashPassword });
    await newUser.save();
    //JWT: JWToken
    jwtokenAndSetCookie(res, newUser._id);
    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Sign In Controllers

export const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //JWT: JWToken
    jwtokenAndSetCookie(res, user._id);

    return res.status(200).json({ message: "Signin successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Sign Out Controllers

export const signout = async (req, res) => {
  res.clearCookie("jwtoken");
  return res.status(200).json({ message: "Signout successfully" });
};

// Check Auth Controllers
export const checkAuth = async (req, res) => {
  return res.status(200).json({ userId: req.userId.userId });
};
