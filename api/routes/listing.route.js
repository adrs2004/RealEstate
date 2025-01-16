import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
  findlistinginhomepage,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", createListing);
router.post("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);
router.post("/findlisting", findlistinginhomepage);

export default router;
