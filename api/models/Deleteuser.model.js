import mongoose from "mongoose";

const deletedUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    deletionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const DeletedUser = mongoose.model("DeletedUser", deletedUserSchema);

export default DeletedUser;
