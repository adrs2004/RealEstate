import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define Admin schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
// adminSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // Method to compare passwords
// adminSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// Export Admin model
const Admin = mongoose.model("Adminmoderealestate", adminSchema);
export default Admin;
