import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const UserallListings = () => {
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  // const handleListingDelete = async (listingId) => {
  //   try {
  //     const res = await axios.post(
  //       `/api/listing/delete/${listingId}`,
  //       {
  //         id: currentUser._id,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (!res.data.success) {
  //       toast.error(res.data.message);
  //       return;
  //     }
  //     // Update UI without reloading
  //     setUserListings((prev) =>
  //       prev.filter((listing) => listing._id !== listingId)
  //     );
  //     toast.success("Listing deleted successfully.");
  //   } catch (error) {
  //     console.error(error.message);
  //     toast.error("Failed to delete the listing.");
  //   }
  // };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await axios.post(
        `/api/listing/delete/${listingId}`,
        {
          id: currentUser._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.status === 200) {
        console.log("aditya vashistha");
        toast.info("Listing Deleted Sucessfully ...");
        // window.location.reload();
        //return navigate(0);
      }

      // if (!res.data.success) {
      //   toast.error(res.data.message);
      //   return;
      // }

      // Remove the deleted listing from the state
      setUserListings((prevListings) =>
        prevListings.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to delete the listing.");
    }
  };

  const handleShowListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/user/listings/${currentUser._id}`);
      const data = res.data;
      if (res.status === 200) {
        setUserListings(data.listings);
      } else {
        toast.error("Something went wrong while fetching listings.");
      }
    } catch (error) {
      setError("Failed to fetch listings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleShowListings();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <h1 className="text-center mt-7 text-3xl font-bold text-gray-800">
        Your Listings
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div
            className="spinner-border animate-spin inline-block w-12 h-12 border-8 rounded-full text-blue-600"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <p className="text-red-600 text-center mt-5 text-lg font-semibold">
          {error}
        </p>
      ) : userListings.length === 0 ? (
        <p className="text-center mt-10 text-gray-700 text-xl font-medium">
          No Listings Found
        </p>
      ) : (
        <div className="flex flex-col gap-6 mt-8">
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border shadow-lg rounded-lg p-5 flex justify-between items-center gap-6"
            >
              <Link to={`/listing/${listing._id}`} className="flex-shrink-0">
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-20 w-20 object-cover rounded-md border"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-slate-700 font-semibold hover:underline flex-1 text-lg truncate"
              >
                {listing.name}
              </Link>
              <div className="flex flex-col items-center space-y-3">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 uppercase text-sm"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 uppercase text-sm">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserallListings;
