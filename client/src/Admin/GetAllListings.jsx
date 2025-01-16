import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import axios from "axios";

SwiperCore.use([Navigation]);

export default function AllListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copiedListing, setCopiedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteListingId, setDeleteListingId] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await axios(`/api/admin/getalllistings`);
        const data = await res.data;
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListings(data);
        setLoading(false);
        setError(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const handleDelete = async (listingId) => {
    try {
      const res = await axios.post(
        `/api/admin/delete/${listingId}`,
        { listingId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.data;
      console.log(data);
      setShowModal(false);
      if (data.message === "Listing deleted successfully") {
        setListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
      } else {
        setError("Something Went Wrong");
      }
    } catch (err) {
      console.error("Error deleting listing:", err);
    }
  };

  const openModal = (id) => {
    setDeleteListingId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setDeleteListingId(null);
    setShowModal(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          All Listings
        </h1>
        {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
        {error && <p className="text-center my-7 text-2xl">{error}</p>}
        {/* {
         {listing.length==0}
        } */}

        {!loading && listings.length === 0 && (
          <p className="text-center my-7 text-2xl">No listings found.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white shadow-lg rounded-lg p-4"
            >
              <Swiper navigation>
                {listing.imageUrls.map((url) => (
                  <SwiperSlide key={url}>
                    <div
                      className="h-[250px] rounded-lg"
                      style={{
                        background: `url(${url}) center no-repeat`,
                        backgroundSize: "cover",
                      }}
                    ></div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-semibold">
                  {listing.name} - $
                  {listing.offer
                    ? listing.discountPrice.toLocaleString("en-US")
                    : listing.regularPrice.toLocaleString("en-US")}
                  {listing.type === "rent" && " / month"}
                </p>
              </div>
              <p className="text-gray-600 text-sm flex items-center mt-2">
                <FaMapMarkerAlt className="text-green-700 mr-2" />
                {listing.address}
              </p>
              <div className="flex gap-4 my-2">
                <p className="bg-red-900 text-white text-center p-1 rounded-md">
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </p>
                {listing.offer && (
                  <p className="bg-green-900 text-white text-center p-1 rounded-md">
                    ${+listing.regularPrice - +listing.discountPrice} OFF
                  </p>
                )}
              </div>
              <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaBed className="text-lg" />
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} beds `
                    : `${listing.bedrooms} bed `}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaBath className="text-lg" />
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} baths `
                    : `${listing.bathrooms} bath `}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaParking className="text-lg" />
                  {listing.parking ? "Parking spot" : "No Parking"}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaChair className="text-lg" />
                  {listing.furnished ? "Furnished" : "Unfurnished"}
                </li>
              </ul>
              <div className="flex items-center justify-between mt-4">
                <button
                  className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/listing/${listing._id}`
                    );
                    setCopiedListing(listing._id);
                    setTimeout(() => setCopiedListing(null), 2000);
                  }}
                >
                  <FaShare />
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded-lg"
                  onClick={() => openModal(listing._id)}
                >
                  Delete
                </button>
                {copiedListing === listing._id && (
                  <p className="text-sm text-green-600">Link copied!</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            style={{ zIndex: 1050 }} // Optional inline style for absolute control
          >
            <div
              className="bg-white p-8 rounded-lg shadow-2xl"
              style={{
                width: "90%",
                maxWidth: "500px",
                padding: "2rem",
                zIndex: 1050,
              }}
            >
              <h3 className="text-xl font-semibold mb-6 text-center">
                Are you sure you want to delete this listing?
              </h3>
              <div className="flex justify-end gap-6">
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg text-lg"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg text-lg"
                  onClick={() => handleDelete(deleteListingId)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
