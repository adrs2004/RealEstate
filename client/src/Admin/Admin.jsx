import React, { useState, useEffect } from "react";
import AllUsers from "./AllUsers";
import GetAllListings from "./GetAllListings";
import DeletedUsers from "./Getalldeletedusers";
import DeletedListing from "./DeletedListings";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

export const adminloader = () => {
  const admintoken = localStorage.getItem("adminToken");
  if (!admintoken) {
    return toast.error("You are Not Authorized To Do This");
  }
  return null;
};

const Admin = () => {
  const [activeSection, setActiveSection] = useState("users");
  const location = useLocation();
  const navigate = useNavigate();

  // Effect to handle unauthorized navigation
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      // If no admin token is found, navigate to login or home
      toast.error("You are not authorized. Please log in.");
      navigate("/"); // Redirect to home or login page
    }
  }, [navigate]); // Depend on navigate to ensure this is triggered on mount

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      console.log("aditya vashistha");
      if (
        localStorage.getItem("adminToken") &&
        window.location.pathname === "/admin"
      ) {
        // Prompt user to logout before navigating away
        const message = "Please log out before leaving the admin page.";
        event.returnValue = message; // Standard for most browsers
        return message; // For some browsers like Chrome
      }
    };

    // Add event listener for beforeunload (when trying to refresh or navigate away)
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []); // Empty dependency array to run once on mount and cleanup on unmount

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully!");
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className="bg-gray-800 text-white w-64 p-6"
        style={{
          height: "100vh",
        }}
      >
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveSection("users")}
            className={`w-full py-2 px-4 rounded text-left ${
              activeSection === "users"
                ? "bg-gray-700"
                : "bg-gray-800 hover:bg-gray-600"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setActiveSection("listings")}
            className={`w-full py-2 px-4 rounded text-left ${
              activeSection === "listings"
                ? "bg-gray-700"
                : "bg-gray-800 hover:bg-gray-600"
            }`}
          >
            All Listings
          </button>
          <button
            onClick={() => setActiveSection("deletedusers")}
            className={`w-full py-2 px-4 rounded text-left ${
              activeSection === "deletedusers"
                ? "bg-gray-700"
                : "bg-gray-800 hover:bg-gray-600"
            }`}
          >
            All Deleted Users
          </button>
          <button
            onClick={() => setActiveSection("deletedlistings")}
            className={`w-full py-2 px-4 rounded text-left ${
              activeSection === "deletedlistings"
                ? "bg-gray-700"
                : "bg-gray-800 hover:bg-gray-600"
            }`}
          >
            All Deleted Listings
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 rounded text-left bg-red-600 hover:bg-red-500 mt-4"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {activeSection === "users"
              ? "Manage Users"
              : activeSection === "listings"
              ? "Manage Listings"
              : activeSection === "deletedusers"
              ? "Deleted Users"
              : activeSection === "deletedlistings"
              ? "Deleted Listings"
              : "Default Section"}
          </h1>
        </div>

        {/* Conditional Rendering */}
        <div>
          {
            activeSection === "users" ? (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <AllUsers />
              </div>
            ) : activeSection === "listings" ? (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <GetAllListings />
              </div>
            ) : activeSection === "deletedusers" ? (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <DeletedUsers />
              </div>
            ) : activeSection === "deletedlistings" ? (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <DeletedListing />
              </div>
            ) : null // Handle cases where no section is active
          }
        </div>
      </main>
    </div>
  );
};

export default Admin;
