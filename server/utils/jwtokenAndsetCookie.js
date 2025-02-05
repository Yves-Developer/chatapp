import jwt from "jsonwebtoken";
export const jwtokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("jwtoken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
};
