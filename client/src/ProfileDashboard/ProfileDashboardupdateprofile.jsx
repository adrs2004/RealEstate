import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileDashboardupdateprofile = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false); // For loading spinner
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: currentUser?.firstname || "",
    lastName: currentUser?.lastname || "",
    alternativeEmail: currentUser?.AlternativeEmail || "",
    currentAddress: currentUser?.CurrentAddress || "",
    permanentAddress: currentUser?.PermanentAddress || "",
    phone: currentUser?.phone || "",
    country: currentUser?.Country || "",
    age: currentUser?.Age || "",
    gender: currentUser?.Gender || "",
  });

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo (Congo-Brazzaville)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia (Czech Republic)",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini ",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Holy See",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (formerly Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia (formerly Macedonia)",
    "Norway",
    "Oman",
    "Pakistan",
  ];

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.firstName.trim().length === 0 ||
      formData.lastName.trim().length === 0 ||
      formData.alternativeEmail.trim().length === 0 ||
      formData.currentAddress.trim().length === 0 ||
      formData.permanentAddress.trim().length === 0 ||
      !formData.age || // Check if age is empty, null, or 0
      isNaN(formData.age) || // Check if age is not a number
      Number(formData.age) <= 0 || // Check if age is not positive
      Number(formData.age) > 100 // Check if age exceeds 100
    ) {
      console.log(formData);
      return toast.error("Please enter all fields correctly.");
    }
    if (
      !formData.age ||
      isNaN(formData.age) ||
      Number(formData.age) <= 18 ||
      Number(formData.age) > 100
    ) {
      return toast.error("Please enter a valid age between 18 and 100.");
    }
    if (/[^A-Za-z\s]/.test(formData.firstName)) {
      return toast.error(
        "First name should not contain numbers or special characters."
      );
    }

    if (/[^A-Za-z\s]/.test(formData.lastName)) {
      return toast.error(
        "Last name should not contain numbers or special characters."
      );
    }

    setIsLoading(true);
    try {
      for (const key in formData) {
        if (typeof formData[key] === "string") {
          formData[key] = formData[key].trim();
        }
      }
      dispatch(updateUserStart());
      const res = await axios.post(
        `/api/user/update/${currentUser._id}`,
        { formData },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.data;
      if (data.success === false) {
        toast.error("SomeThing went wrong while updating profile ..");
        dispatch(updateUserFailure(data.message));
        setIsLoading(false);
        return;
      }
      if (data.message === "User  updated successfully") {
        navigate("?tab=profile");
        toast.info("user profile updated sucessfully ..");
        console.log(data.data);
        dispatch(updateUserSuccess(data.data));
      }

      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[90%] mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-lg max-w-4xl">
      <h2 className="text-center text-2xl font-semibold text-gray-700 mb-6">
        Update Your Profile
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
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
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Alternative Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Alternative Email
          </label>
          <input
            type="email"
            name="alternativeEmail"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Enter an alternative email"
            value={formData.alternativeEmail}
            onChange={handleChange}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Current Address */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Current Address
          </label>
          <textarea
            name="currentAddress"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            rows="2"
            placeholder="Enter your current address"
            value={formData.currentAddress}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Permanent Address */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Permanent Address
          </label>
          <textarea
            name="permanentAddress"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            rows="2"
            placeholder="Enter your permanent address"
            value={formData.permanentAddress}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Country Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <select
            name="country"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="">Select your country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            name="gender"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="col-span-2 text-center">
          <button
            disabled={isLoading}
            type="submit"
            className="w-full md:w-1/2 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
          >
            {isLoading ? "Updating ..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileDashboardupdateprofile;
