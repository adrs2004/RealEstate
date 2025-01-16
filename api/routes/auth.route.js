import express from "express";
import jwt from "jsonwebtoken";
import {
  google,
  resetpassword,
  signOut,
  signin,
  signup,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import {
  forgootenpassword,
  verifyOtptoresetpassword,
} from "../controllers/Forgootenpassword.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signOut);

router.post("/verifyotp", verifyOtp);

router.post("/forgootenpassword", forgootenpassword);
router.post("/verifyotptoresetpassword", verifyOtptoresetpassword);
router.post("/resetpassword", resetpassword);

router.post("/checkaccestoken", async (req, res) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  // Check if access token exists
  if (!accessToken) {
    return res.status(404).json({ message: "Access token not found!" });
  }

  // Verify access token
  jwt.verify(accessToken, "adityaaditya", (err, user) => {
    if (err) {
      if (
        err.name === "TokenExpiredError" ||
        err.name === "JsonWebTokenError"
      ) {
        if (!refreshToken) {
          return res.status(404).json({ message: "Refresh token not found!" });
        }

        // Verify refresh token
        jwt.verify(refreshToken, "adityaaditya", (refreshErr, decoded) => {
          if (refreshErr) {
            return res
              .status(403)
              .json({ message: "Refresh token expired or invalid!" });
          }

          // Generate a new access token if refresh token is valid
          const newAccessToken = jwt.sign(
            { id: decoded.id, username: decoded.username },
            "adityaaditya",
            { expiresIn: "60m" } // New access token valid for 30 minutes
          );

          res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
          });

          return res.status(200).json({
            message: "New access token generated!",
            accessToken: newAccessToken,
          });
        });
      } else {
        return res
          .status(403)
          .json({ message: "Access token is invalid! Please login again." });
      }
    } else {
      // Access token is valid
      res.status(200).json({ message: "Access token is valid!", user });
    }
  });
});

export default router;
