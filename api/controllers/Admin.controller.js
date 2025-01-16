import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";
import DeleteUsers from "../models/Deleteuser.model.js";
import DeletedListing from "../models/DeletedListings.model.js";

// Controller to fetch all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    if (!users.length) {
      return res.status(404).json({ message: "No users found!" });
    }

    res.status(200).json(users);
  } catch (err) {
    next(errorHandler(500, "An error occurred while fetching users"));
  }
};

export const getalldeleteuser = async (req, res, next) => {
  try {
    const users = await DeleteUsers.find({});

    if (!users.length) {
      return res.status(404).json({ message: "No users found!" });
    }
    res.status(200).json(users);
  } catch (error) {
    next(errorHandler(500, "An error occurred while fetching users"));
  }
};

export const getsingleuserinfo = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId); // Match the parameter name
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details" });
  }
};

export const getalllistings = async (req, res, next) => {
  try {
    const listings = await Listing.find({});

    if (!listings.length) {
      return res.status(404).json({ message: "No listings found!" });
    }
    res.status(200).json(listings);
  } catch (error) {
    next(errorHandler(500, "An error occurred while fetching users"));
  }
};

export const deletelisting = async (req, res, next) => {
  try {
    const { listingId } = req.body;

    // Check if the listing exists
    const listing = await Listing.findById(listingId);
    
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Move the listing to the DeletedListing collection
    const deletedListing = new DeletedListing({
      deletedby: "Admin",
      ...listing.toObject(), // Copy all properties from the original listing
      deletedAt: new Date(), // Set the deletion time
    });
    await deletedListing.save();

    // Delete the listing from the original collections
    await Listing.findByIdAndDelete(listingId);

    res.status(200).json({
      message: "Listing deleted successfully and moved to DeletedListing",
    });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({ message: "Server error while deleting listing" });
  }
};

export const getalldeletedlistings = async (req, res, next) => {
  try {
    const deletedlistings = await DeletedListing.find({});
    if (!deletedlistings.length) {
      return res.status(404).json({ message: "No deleted listings found!" });
    }
    res.status(200).json(deletedlistings);
  } catch (error) {
    next(
      errorHandler(500, "An error occurred while fetching deleted listings")
    );
  }
};
