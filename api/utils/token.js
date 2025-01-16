import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, "adityaaditya", {
    expiresIn: "3d",
  });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, "adityaaditya", {
    expiresIn: "3d",
  });
};
