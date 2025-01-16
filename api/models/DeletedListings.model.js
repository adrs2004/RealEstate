import mongoose from "mongoose";

const deletedListingSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    address: String,
    regularPrice: Number,
    discountPrice: Number,
    bathrooms: Number,
    bedrooms: Number,
    furnished: Boolean,
    parking: Boolean,
    deletedby: String,
    type: {
      type: String,
      enum: ["rent", "sale"],
    },
    offer: Boolean,
    imageUrls: [String],
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deletedAt: {
      type: Date,
      default: Date.now, // Automatically set the deletion time
    },
  },
  { timestamps: true }
);

const DeletedListing = mongoose.model("DeletedListing", deletedListingSchema);

export default DeletedListing;
