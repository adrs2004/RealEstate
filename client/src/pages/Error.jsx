import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import removeAdmintoken from "../hooks/useAdminToken";

const Error = () => {
  useEffect(() => {
    removeAdmintoken();
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl font-medium text-gray-700 mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition"
      >
        Go to Home Page
      </Link>
    </div>
  );
};

export default Error;
