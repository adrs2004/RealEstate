import express from "express";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import Forgootenotp from "../models/forgootenpasswordotp.model.js";
import { forgotPasswordOtp } from "../mailtemplates/ForgootenPasswordtemplate.js";
import crypto from "crypto";
export const forgootenpassword = async (req, res, next) => {
  const { email } = req.body;
  console.log(email);

  try {
    const finduser = await User.findOne({ email });

    if (!finduser) {
      return res.status(404).json({ message: "Email is not registered" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP to database

    const checkifotpispresent = await Forgootenotp.findOneAndDelete({ email });
    await Forgootenotp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    }); // Expires in 10 minutes

    // Send OTP email
    await sendEmail({
      to: email,
      subject: "Password Reset OTP",
      html: forgotPasswordOtp(email, finduser.username, otp),
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    next(error);
  }
};

export const verifyOtptoresetpassword = async (req, res, next) => {
  const { email, otp } = req.body; // Extract email and OTP from the request

  try {
    // Find OTP record in the database
    const otpRecord = await Forgootenotp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP has expired
    const currentTime = new Date();
    if (otpRecord.expiresAt < currentTime) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // OTP is valid and not expired
    res.status(200).json({ message: "OTP verified successfully" });

    // Optionally, you can remove the OTP from the database after successful verification
    await Forgootenotp.findOneAndDelete({ email });

    // Proceed with resetting password or other logic as needed
  } catch (error) {
    next(error);
  }
};
