import jwt from "jsonwebtoken";
export const verifyToken = async (req, res, next) => {
  const token = req.cookies.jwtoken;
  if (!token) {
    return res.status(401).json({ message: "Not Autheticated" });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
