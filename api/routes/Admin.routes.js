import express from "express";
import {
  getAllUsers,
  getsingleuserinfo,
  getalllistings,
  getalldeleteuser,
  deletelisting,
  getalldeletedlistings,
} from "../controllers/Admin.controller.js";

const router = express.Router();

// Get All Users
router.post("/getalluser", getAllUsers);
router.get("/getuser/:userId", getsingleuserinfo);
router.get("/getalllistings", getalllistings);
router.get("/getalldeleteuser", getalldeleteuser);
router.post("/delete/:listingId", deletelisting);
router.get("/delete/getalldeletedlistings", getalldeletedlistings);

export default router;
