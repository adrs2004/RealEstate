import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Getalldeletedusers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/getalldeleteuser");
        setUsers(res.data);
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "Error fetching users"
        );
      }
    };
    fetchUsers();
  }, []);

  return (
    <div
      className="bg-gray-100"
      style={{
        height: "100vh", // Set the height to 100% of the viewport
        overflowY: "auto", // Enable vertical scrolling if content overflows
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Deleted Users
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Link
                to={`/singleuserInfo/${user._id}`}
                key={user._id}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow"
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h2 className="text-lg font-semibold text-gray-800">
                  {user.username}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="text-sm text-gray-500 mt-4">
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Updated At:</strong>{" "}
                    {new Date(user.updatedAt).toLocaleString()}
                  </p>
                </div>
                <button styles={{
                  "backgroundColor  ": "back",
                  padding:"1rem 2rem"
                }}>
                  Restore User
                </button>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No users found.</p>
        )}
      </div>
    </div>
  );
}

export default Getalldeletedusers;
