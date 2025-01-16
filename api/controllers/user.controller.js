import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { passwordUpdated } from "../mailtemplates/passwordUpdate.js";
import DeleteUser from "../models/Deleteuser.model.js";
import { accountDeletionConfirmation } from "../mailtemplates/Deleteaccounttemplate.js";

export const test = (req, res) => {
  res.json({
    message: "Api route is working!",
  });
};

export const updateUser = async (req, res, next) => {
  console.log(req.body.formData.firstName);
  console.log(req.body);

  try {
    // Upload avatar to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars", // Store images in a specific folder
        transformation: { width: 200, height: 200, crop: "fill" }, // Optional resizing
      });
      req.body.avatar = result.secure_url; // Use the uploaded image URL
    }

    // Hash the password if it's provided
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const allowedUpdates = {
      firstname: req.body.formData.firstName,
      lastname: req.body.formData.lastName,
      AlternativeEmail: req.body.formData.alternativeEmail,
      CurrentAddress: req.body.formData.currentAddress,
      PermanentAddress: req.body.formData.permanentAddress,
      phone: req.body.formData.phone,
      Country: req.body.formData.country,
      Age: req.body.formData.age,
      Gender: req.body.formData.gender,
      avatar: req.body.formData.avatar, // Optional
    };

    // Remove undefined fields
    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: allowedUpdates },
      { new: true } // Return the updated document
    );

    // Fetch the updated user
    const user = await User.findById(req.params.id);

    // Exclude sensitive data
    const { password, ...rest } = updatedUser._doc;

    // Send an email notification
    await sendEmail({
      to: updatedUser.email,
      subject: "Account Updated Successfully",
      html: passwordUpdated(user.email, user.username),
    });

    res.status(200).json({ message: "User  updated successfully", data: rest });
  } catch (error) {
    next(error);
  }
};

// export const deleteUser = async (req, res, next) => {
//   try {
//     const { ppassword } = req.body;

//     if (!ppassword) {
//       return next(
//         errorHandler(400, "Password is required to delete the account")
//       );
//     }

//     const finduser = await User.findById(req.params.id);
//     if (!finduser) {
//       return next(errorHandler(404, "User not found"));
//     }

//     if (req.params.id !== finduser._id.toString()) {
//       return next(errorHandler(401, "You can only delete your own account!"));
//     }

//     const validPassword = bcryptjs.compareSync(ppassword, finduser.password);
//     if (!validPassword) {
//       return next(errorHandler(401, "Invalid password"));
//     }

//     // Archive and delete user logic
//     const deletedUserData = new DeleteUser({
//       username: finduser.username,
//       email: finduser.email,
//       avatar: finduser.avatar,
//       deletionDate: new Date(),
//     });
//     await deletedUserData.save();
//     await sendEmail({
//       to: email,
//       subject: "Account Delete Conformation",
//       html: accountDeletionConfirmation(finduser.email, finduser.username),
//     });

//     await User.findByIdAndDelete(req.params.id);

//     // await sendEmail({
//     //   to: finduser.email,
//     //   subject: "Account Deleted",
//     //   html: `Hello ${finduser.username},<br><br>Your account has been successfully deleted. We hope to see you again!`,
//     // });

//     res.clearCookie("access_token");
//     res
//       .status(200)
//       .json({ success: true, message: "User has been deleted and archived!" });
//   } catch (error) {
//     console.error("Error during user deletion:", error);
//     next(error);
//   }
// };

export const deleteUser = async (req, res, next) => {
  try {
    const { ppassword: password } = req.body;

    if (!password) {
      return next(
        errorHandler(400, "Password is required to delete the account")
      );
    }

    const finduser = await User.findById(req.params.id);
    if (!finduser) {
      return next(errorHandler(404, "User not found"));
    }

    if (req.params.id !== finduser._id.toString()) {
      return next(errorHandler(401, "You can only delete your own account!"));
    }

    const validPassword = bcryptjs.compareSync(password, finduser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid password"));
    }

    // Archive and delete user logic
    const deletedUserData = new DeleteUser({
      username: finduser.username,
      email: finduser.email,
      avatar: finduser.avatar,
      deletionDate: new Date(),
    });
    await deletedUserData.save();

    await User.findByIdAndDelete(req.params.id);

    await sendEmail({
      to: finduser.email,
      subject: "Account Deleted",
      html: accountDeletionConfirmation(finduser.email, finduser.username),
    });

    res.clearCookie("access_token");
    res
      .status(200)
      .json({ success: true, message: "User has been deleted and archived!" });
  } catch (error) {
    console.error("Error during user deletion:", error);
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res
        .status(200)
        .json({ listings, message: "Fetch Successfully", status: "200" });
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found!"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getuserinfoforresetpage = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validate that email is provided
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find the user by email
    const user = await User.findOne({ email }).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send user details (excluding password)
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
