import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Optional: Add an index to automatically delete expired documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("realestateforgoetnotpmodel", otpSchema);

export default Otp;
