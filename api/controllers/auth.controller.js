import User from "../models/user.model.js";
import Otp from "../models/Otp.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import { signuptemplate } from "../mailtemplates/signuptemplate.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import crypto from "crypto";
import { otpVerificationTemplate } from "../mailtemplates/OtpVerificationTemplate.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

  try {
    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Save OTP to the OTP collection
    const checkifemailpresentinotpdb = await Otp.findOneAndDelete({ email });
    await Otp.create({
      email,
      otp,
      otpExpires,
    });

    // Send OTP via email

    console.log("check if otp present of not ", checkifemailpresentinotpdb);
    await sendEmail({
      to: email,
      subject: "Your OTP for Account Verification",
      html: otpVerificationTemplate(username, otp),
    });

    res.status(201).json({
      success: true,
      message: "OTP sent to email. Please verify to complete registration.",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  const { email, otp, username, password } = req.body;

  console.log(req.body);

  try {
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res
        .status(404)
        .json({ error: "OTP not found. Please register again." });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ error: "Wrong OTP" });
    }

    if (otpRecord.otpExpires <= Date.now()) {
      return res.status(400).json({ error: "OTP is expired" });
    }

    // OTP is valid and not expired, proceed to create the user
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/5.x/initials/svg?seed=${username}`,
    });

    await newUser.save();

    // Clear OTP after verification
    await Otp.deleteOne({ email });

    return res
      .status(200)
      .json({ message: "OTP verified and user registered successfully!" });
  } catch (error) {
    return next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

    const accessToken = generateAccessToken(validUser);
    const refreshToken = generateRefreshToken(validUser);

    validUser.refreshtoken = refreshToken;
    await validUser.save();
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 30 * 60 * 1000,
      }) // 15 minutes
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 60 * 1000,
      }) // 7 days
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

export const resetpassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    // Check if email and newPassword are provided
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required." });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
