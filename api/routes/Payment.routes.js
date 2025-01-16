import express from "express";
import {
  createorder,
  ordervalidate,
  getPaymentsByEmail,
} from "../controllers/Payment.controller.js";
const router = express.Router();

router.post("/createorder", createorder);
router.post("/validateorder", ordervalidate);
router.post("/getallpaymentsdetailsbyemail", getPaymentsByEmail);

export default router;
