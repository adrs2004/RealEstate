import { console } from "inspector";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import DeletedListing from "../models/DeletedListings.model.js";
import User from "../models/user.model.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);

    return res.status(200).json({
      success: true,
      message: "Listing created successfully!",
      data: listing, // Include the created listing details
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    // Find the listing by ID
    const listing = await Listing.findById(req.params.id);
    console.log("deleted listing ", listing);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    // Ensure the user has permission to delete the listing
    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can only delete your own listings!"));
    }

    // Find the username of the user who is deleting the listing
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }

    // Add the listing to the DeletedListings database
    const deletedListing = new DeletedListing({
      name: listing.name,
      description: listing.description,
      address: listing.address,
      regularPrice: listing.regularPrice,
      discountPrice: listing.discountPrice,
      bathrooms: listing.bathrooms,
      bedrooms: listing.bedrooms,
      furnished: listing.furnished,
      parking: listing.parking,
      type: listing.type,
      offer: listing.offer,
      imageUrls: listing.imageUrls,
      deletedAt: new Date(),
      deletedBy: user.username, // Add the username
      userId: req.user.id, // Add the user ID
    });

    await deletedListing.save();

    // Delete the listing from the active listings database
    await Listing.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: "Listing has been deleted and archived successfully!" });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef.toString()) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

// export const updateListing = async (req, res, next) => {
//   try {
//     const listing = await Listing.findById(req.params.id);
//     console.log(listing);

//     if (!listing) {
//       return next(errorHandler(404, "Listing not found!"));
//     }

//     if (req.user.id !== listing.userRef.toString()) {
//       return next(errorHandler(401, "You can only update your own listings!"));
//     }

//     const updatedFields = { ...req.body }; // Ensure all fields from req.body are captured

//     const updatedListing = await Listing.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: updatedFields,
//         name: updatedFields.name,
//         imageUrls: updatedFields.imageUrls,
//       }, // Use $set to replace arrays explicitly
//       { new: true, runValidators: true } // Return updated document & enforce schema validation
//     );

//     if (!updatedListing) {
//       return next(errorHandler(500, "Failed to update the listing!"));
//     }

//     res.status(200).json(updatedListing);
//   } catch (error) {
//     console.error("Error updating listing:", error);
//     next(error);
//   }
// };

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const findlistinginhomepage = async (req, res) => {
  const { type, location, keyword } = req.body;

  try {
    const filters = {};
    if (type !== "all") filters.type = type;
    if (location) filters.address = { $regex: location, $options: "i" };
    if (keyword) filters.keyword = { $regex: keyword, $options: "i" };

    const results = await Listing.find(filters); // Replace `Property` with your actual model name
    res.json(results);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
