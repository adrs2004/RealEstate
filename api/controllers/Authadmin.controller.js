import Admin from "../models/Admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdminOtp from "../models/Adminotp.model.js";
import crypto from "crypto";
import { adminOtpTemplate } from "../mailtemplates/Adminotpverification.js";
import { sendEmail } from "../utils/sendEmail.js";
export const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin created successfully", adminId: newAdmin._id });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const checkifemailpresentinotpdb = await AdminOtp.findOneAndDelete({
      email,
    });
    await AdminOtp.create({
      email,
      otp,
      otpExpires,
    });
    await sendEmail({
      to: email,
      subject: "Your OTP for Account Verification",
      html: adminOtpTemplate(email, otp),
    });

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const verifyAdminOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log(req.body);

  try {
    // Check if OTP exists in the database for the provided email
    const otpEntry = await AdminOtp.findOne({ email });

    if (!otpEntry) {
      return res
        .status(400)
        .json({ message: "OTP not found. Please request a new OTP." });
    }

    // Check if OTP matches
    if (otpEntry.otp !== otp) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    // Check if OTP has expired
    if (otpEntry.otpExpires < new Date()) {
      await AdminOtp.deleteOne({ email }); // Clean up expired OTP
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new OTP." });
    }

    // OTP is valid, generate a JWT token for the admin
    const adminToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Clean up OTP after successful verification
    await AdminOtp.deleteOne({ email });

    res.status(200).json({
      message: "OTP verified successfully. Login authorized.",
      token: adminToken,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};
