import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { paymentSuccessTemplate } from "../mailtemplates/paymentSuccessTemplate.js";
// Function to validate the Razorpay payment signature
const validatePayment = (orderId, paymentId, signature) => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
};

export const createorder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("order create", req.body);
    const options = req.body;
    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).send("Error creating Razorpay order");
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
};

export const ordervalidate = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    console.log("validate order", req.body);
    const paymentdes = req.body.paymentResponse;
    const userdes = req.body.prefill;
    console.log(paymentdes);
    console.log(userdes);

    // Validate payment using the custom `validatePayment` function
    const isValid = validatePayment(
      req.body.paymentResponse.razorpay_order_id,
      req.body.paymentResponse.razorpay_payment_id,
      req.body.paymentResponse.razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment validation failed",
      });
    }

    // Save payment details to the database
    const paymentDetails = new Payment({
      razorpay_order_id: req.body.paymentResponse.razorpay_order_id,
      razorpay_payment_id: req.body.paymentResponse.razorpay_payment_id,
      razorpay_signature: req.body.paymentResponse.razorpay_signature,
      firstname: req.body.prefill.name,
      email: req.body.prefill.email,
      phone: req.body.prefill.phone,
      listingname: req.body.prefill.listingname,
      listingtype: req.body.prefill.listingtype,
    });
    await sendEmail({
      to: req.body.prefill.email,
      subject: "Payment details",
      html: paymentSuccessTemplate(
        req.body.prefill.name,
        req.body.prefill.email,
        req.body.paymentResponse.razorpay_order_id,
        req.body.paymentResponse.razorpay_payment_id
      ),
    });

    await paymentDetails.save();

    res.json({
      success: true,
      message: "Payment validated successfully",
    });
  } catch (err) {
    console.error("Error validating payment:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPaymentsByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find all payments associated with the given email
    const payments = await Payment.find({ email });

    // If no payments found, send a message
    if (!payments.length) {
      return res
        .status(404)
        .json({ message: "No payments found for this email" });
    }

    // Send the payments as a response
    res.status(200).json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
