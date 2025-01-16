import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    phone: {
      type: Number,
    },
    AlternativeEmail: {
      type: String,
    },
    CurrentAddress: {
      type: String,
    },
    PermanentAddress: {
      type: String,
    },
    Country: {
      type: String,
    },
    Gender: {
      type: String,
    },
    Age: {
      type: Number,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    refreshtoken: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
