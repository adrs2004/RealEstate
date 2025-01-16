import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  firstname: {
    type: String,
  },
  phone: {
    type: Number,
  },
  email: {
    type: String,
  },
  listingname: {
    type: String,
  },
  listingtype: {
    type: String,
  },
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const paymentmodel = mongoose.model("realestatepaymentmodel", paymentSchema);
export default paymentmodel;
