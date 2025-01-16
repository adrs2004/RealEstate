import React from "react";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { toast } from "react-toastify";

const BasicProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file); // Ensure `file` is a single file object, not an array
    formData.append("upload_preset", "my_upload_preset"); // Replace with your actual upload preset
    formData.append("cloud_name", "dyq7hjo63"); // Replace with your actual cloud name

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dyq7hjo63/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Use the correct content type for file uploads
          },
        }
      );
      const data = res.data;
      console.log("Image uploaded successfully:", data);
      setFormData((prev) => ({ ...prev, avatar: data.secure_url }));
    } catch (error) {
      setFileUploadError(true);
      console.error("Error uploading to Cloudinary:", error);
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleFileUpload(selectedFile); // Call the upload function
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      localStorage.removeItem("logintoken");
      console.log("aditya vashsitha");
      toast.info("Logout SucessFully ... ");
      localStorage.removeItem("adminToken");
      dispatch(signOutUserSuccess(data));
      return navigate("/");
    } catch (error) {
      console.log(error);
      dispatch(signOutUserFailure(error));
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile </h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleFileChange} // Handle file changes here
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar || ""}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error uploading image</span>
          ) : null}
        </p>

        {/* Username Section */}
        <div className="">
          <label
            htmlFor="username"
            className="block text-sm font-semibold text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={currentUser.username}
            readOnly
            className="mt-2 block w-full border border-gray-300 bg-gray-100 text-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Gmail Section */}
        <div className="">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700"
          >
            Gmail
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={currentUser.email}
            readOnly
            className="mt-2 block w-full border border-gray-300 bg-gray-100 text-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* First Name Section */}
        <div className="">
          <label
            htmlFor="firstName"
            className="block text-sm font-semibold text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            placeholder="First Name"
            value={currentUser.firstname}
            readOnly
            className="mt-2 block w-full border border-gray-300 bg-gray-100 text-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Phone Number Section */}
        <div className="">
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="Phone Number"
            value={currentUser.phone}
            readOnly
            className="mt-2 block w-full border border-gray-300 bg-gray-100 text-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span className="cursor-pointer">
          <button onClick={handleSignOut}>Sign out</button>
        </span>
      </div>
      <div className="w-full flex justify-center mt-6">
        <Link to={"/dashboard?tab=updateProfile"} className="w-full">
          <button className="w-full px-4 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-md hover:from-purple-600 hover:to-blue-600 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all">
            Update Profile
          </button>
        </Link>
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Link to={"/dashboard?tab=verifypasswordtodeleteaccount"}>
                <Button color="failure">Yes, I'm sure</Button>
              </Link>

              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BasicProfile;
