import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminProtuctedRoute = ({ children }) => {
  const admintoken = localStorage.getItem("adminToken");
  const logintoken = localStorage.getItem("logintoken");
  if (logintoken) {
    toast.error("you are Login Please first Logout");
    return <Navigate to="/" />;
  }

  if (!admintoken) {
    toast.error("You are not authorized to access this page.");
    return <Navigate to="/adminlogin" replace />; // Redirect to login
  }

  return children;
};

export default AdminProtuctedRoute;
