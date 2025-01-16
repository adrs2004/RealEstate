import React, { useEffect, useState } from "react";
import axios from "axios";

const DeletedListings = () => {
  const [deletedListings, setDeletedListings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeletedListings = async () => {
      try {
        const response = await axios.get(
          "/api/admin/delete/getalldeletedlistings",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Deleted Listings Response:", response.data);
        setDeletedListings(response.data);
      } catch (err) {
        console.error("Error fetching deleted listings:", err);
        setError("Failed to fetch deleted listings. Please try again later.");
      }
    };

    fetchDeletedListings();
  }, []);

  return (
    <div
      className="p-4 bg-gray-100"
      style={{
        height: "90vh",
        overflowY: "auto", // Add vertical scroll if content exceeds height
      }}
    >
      <h1 className="text-2xl font-bold text-center mb-4">Deleted Listings</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {deletedListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deletedListings.map((listing, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={listing.imageUrls[0]}
                alt={listing.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{listing.name}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Description:</strong> {listing.description}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Address:</strong> {listing.address}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Price:</strong> ₹{listing.regularPrice}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Deleted By:</strong> {listing.deletedby || "Unknown"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Deleted At:</strong>{" "}
                  {new Date(listing.deletedAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No deleted listings found.</p>
      )}
    </div>
  );
};

export default DeletedListings;
