import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPasswordProtectroute = ({ children }) => {
  const resetEmail = localStorage.getItem("resetEmail");

  if (!resetEmail) {
    toast.error("You are not authorized to access this page.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ResetPasswordProtectroute;
