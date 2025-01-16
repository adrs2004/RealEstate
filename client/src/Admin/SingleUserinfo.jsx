import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SingleUserInfo = () => {
  const { userId } = useParams(); // Get the userId from the URL
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/admin/getuser/${userId}`);
        setUser(res.data);
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "Error fetching user info"
        );
      }
    };
    fetchUser();
  }, [userId]);
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading user details...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              {user.username}
            </h2>
            <p className="text-gray-600 text-center">{user.email}</p>
            <div className="mt-6 text-sm text-gray-500">
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(user.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(user.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUserInfo;
