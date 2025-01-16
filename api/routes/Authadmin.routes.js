import express from "express";

import {
  signup,
  login,
  verifyAdminOtp,
} from "../controllers/Authadmin.controller.js";

const router = express.Router();

router.post("/signup", signup);

// Login Route
router.post("/login", login);
router.post("/adminotpverification", verifyAdminOtp);

export default router;
