import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";

const ProtectedApp = ({ children }) => {
  const aditya = useLocation();
  console.log(aditya);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      localStorage.removeItem("logintoken");
      localStorage.removeItem("adminToken");
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        const res = await axios.post("/api/auth/checkaccestoken");
        console.log("Access Token Valid:", res.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          await handleSignOut();
          console.log(
            "Access token expired or not found. Redirecting to login."
          );
          navigate("/sign-in", { state: { from: window.location.pathname } }); // Ensure route is correct
        } else {
          console.error("An unexpected error occurred:", error);
        }
      }
    };

    checkAccessToken();
  }, [navigate]);

  return <>{children}</>; // Render the rest of the app if token is valid
};

export default ProtectedApp;
