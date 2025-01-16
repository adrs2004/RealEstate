import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import usePayment from "../hooks/usePayment";
import currentuserdetail from "../hooks/usecurrentuserdetail";
import LoadingSpinner from "../Loading/Loadingspinner";

export default function CreateListing() {
  const { initiatePayment, loading: isPaymentLoading } = usePayment();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const hasUserDetails = currentuserdetail();
  const [imageUploadError, setImageUploadError] = useState(false);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    setUploading(true);
    if (images.length === 0) {
      alert("Please select images to upload");
      setUploading(false);
      return;
    }
    toast.info("Please wait Images are Uploading ....");

    const uploadedUrls = [];
    for (const image of images) {
      const imageFormData = new FormData();
      imageFormData.append("file", image);
      imageFormData.append("upload_preset", "my_upload_preset");
      imageFormData.append("cloud_name", "dyq7hjo63");

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dyq7hjo63/image/upload`,
          imageFormData
        );
        uploadedUrls.push(response.data.secure_url);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        toast.error("Error uploading images.");
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      imageUrls: [...prevFormData.imageUrls, ...uploadedUrls],
    }));
    setUploading(false);
  };

  const handleRemoveImage = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      imageUrls: prevFormData.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData((prevFormData) => ({ ...prevFormData, type: id }));
    } else if (["parking", "furnished", "offer"].includes(id)) {
      setFormData((prevFormData) => ({ ...prevFormData, [id]: checked }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: type === "number" ? +value : value,
      }));
    }
  };

  const handleCreateListing = async () => {
    if (uploading == true || formData.length == 0) {
      toast.error("Please Upload Content");
      return;
    }
    try {
      const paymentSuccess = await initiatePayment({
        amount: 1000, // Amount in paise
        receiptId: "receipt_123",
        prefill: {
          listingname: formData.name,
          listingtype: formData.type,
          name: currentUser.firstname,
          email: currentUser.email,
          contact: currentUser.phone,
        },
      });

      if (paymentSuccess) {
        const response = await fetch("/api/listing/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, userRef: currentUser._id }),
        });

        if (!response.ok) {
          throw new Error(
            "Failed to create listing. Server returned an error."
          );
        }

        const data = await response.json();

        console.log(data.status);
        if (data.success === true) {
          toast.success("Listing created successfully!");
          navigate(`/listing/${data.data._id}`);
        } else {
          throw new Error(data.message || "Failed to create listing.");
        }
      } else {
        throw new Error("Payment was not completed. Listing creation aborted.");
      }
    } catch (err) {
      console.error("Error:", err.message);
      toast.error(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form
        onSubmit={handleCreateListing}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />

              <div className="flex flex-col items-center">
                <p>Regular price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />

                <div className="flex flex-col items-center">
                  <p>Discounted price</p>

                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setImages(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleUpload}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          {uploading && (
            <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md shadow-lg">
              <p className="text-sm text-gray-700 font-medium mb-3">
                Please wait, images are uploading...
              </p>
              <div className="w-8 h-8 animate-spin rounded-full border-t-2 border-blue-500 border-gray-200"></div>
            </div>
          )}

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          {/* <button
            type="button"
            onClick={handleCreateListing}
            disabled={isPaymentLoading && formData.length > 1}
            className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 ${
              isPaymentLoading
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isPaymentLoading ? "Processing..." : "Create Listing"}
          </button> */}
          <button
            type="button"
            onClick={handleCreateListing}
            disabled={
              isPaymentLoading ||
              uploading ||
              formData.imageUrls.length === 0 ||
              !formData.name.trim() ||
              !formData.description.trim().length
            }
            className={`px-6 py-3 rounded-lg bg-blue-500 text-white uppercase ${
              isPaymentLoading || uploading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {isPaymentLoading ? "Processing..." : "Create Listing"}
          </button>

          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
