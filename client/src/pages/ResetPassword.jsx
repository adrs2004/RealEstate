import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const email = localStorage.getItem("resetEmail");
  const navigate = useNavigate();

  const [userinfo, setuserinfo] = useState({});
  const [loading, setloading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, seterror] = useState("");
  const [showpassword, setshowpassword] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(
          "/api/user/getuserinfoforresetpage",
          { email },
          { headers: { "Content-Type": "application/json" } }
        );
        setuserinfo(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (email) {
      fetchUserDetails();
    }
  }, [email]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   seterror(""); // Clear previous error
  //   newPassword = newPassword.trim();
  //   confirmPassword = confirmPassword.trim();

  //   const passwordRegex =
  //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  //   if (!passwordRegex.test(newPassword)) {
  //     toast.error(
  //       "Password must be at least 8 characters long, contain at least one letter, one number, and one special character."
  //     );
  //     return;
  //   }

  //   if (newPassword !== confirmPassword) {
  //     seterror("Passwords do not match.");
  //     return;
  //   }

  //   try {
  //     setloading(true);
  //     const res = await axios.post(
  //       "/api/auth/resetpassword",
  //       { email, newPassword },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (res.data.message === "Password reset successfully.") {
  //       localStorage.removeItem("resetEmail");
  //     }
  //     toast.success(
  //       "Password reset successfully! Redirecting to login page..."
  //     );
  //     setTimeout(() => {
  //       navigate("/sign-in"); // Redirect after 2 seconds
  //     }, 2000);
  //   } catch (error) {
  //     console.error("Error resetting password:", error);
  //     seterror("Failed to reset password. Please try again.");
  //   } finally {
  //     setloading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    seterror(""); // Clear previous error

    // Trim inputs to remove extra spaces
    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Password validation regex
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Check if password meets criteria
    if (!passwordRegex.test(trimmedNewPassword)) {
      toast.error(
        "Password must be at least 8 characters long, contain at least one letter, one number, and one special character."
      );
      return;
    }

    // Check if passwords match
    if (trimmedNewPassword !== trimmedConfirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setloading(true);
      const res = await axios.post(
        "/api/auth/resetpassword",
        { email, newPassword: trimmedNewPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.message === "Password reset successfully.") {
        localStorage.removeItem("resetEmail");
        toast.success(
          "Password reset successfully! Redirecting to login page..."
        );
        setTimeout(() => {
          navigate("/sign-in"); // Redirect after 2 seconds
        }, 2000);
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      seterror("Failed to reset password. Please try again.");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer /> {/* Toast container for notifications */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex items-center justify-center">
          <div className="loader border-t-4 border-blue-500 rounded-full w-24 h-24 animate-spin"></div>
        </div>
      )}
      <div
        className={`p-8 max-w-xl w-full bg-white shadow-md rounded-lg z-0 ${
          loading ? "opacity-20" : "opacity-100"
        }`}
      >
        <h1 className="text-4xl text-center font-semibold my-7">
          Reset Password
        </h1>
        <div className="flex flex-col items-center p-6 rounded-lg shadow-lg mb-4">
          <img
            src={userinfo.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-purple-500 mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Welcome Back, {userinfo.username}
          </h2>
          <h2 className="text-sm text-gray-500">{userinfo.email}</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type={showpassword ? "text" : "password"}
            placeholder="Enter New Password"
            className="border p-4 rounded-lg"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value.trim())}
          />
          <input
            type={showpassword ? "text" : "password"}
            s
            placeholder="Re-enter New Password"
            className="border p-4 rounded-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value.trim())}
          />
          <div>
            <span>show </span>{" "}
            <input
              type="checkbox"
              checked={showpassword}
              onChange={() => {
                setshowpassword(!showpassword);
              }}
            />
          </div>

          {newPassword !== confirmPassword &&
            newPassword.length > 1 &&
            confirmPassword.length > 1 && <p>Password Not Match</p>}
          <button
            disabled={
              loading || newPassword !== confirmPassword || !newPassword
            }
            className={`bg-slate-700 text-white p-4 rounded-lg uppercase hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              loading || newPassword !== confirmPassword
                ? ""
                : "hover:bg-green-600"
            }`}
          >
            Reset Password
          </button>
          {error && (
            <div className="mt-5 p-4 border border-red-500 rounded-lg bg-red-100 text-red-700 flex items-center gap-3">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 5.636a9 9 0 11-12.728 0m12.728 0L12 12m0 0l-6.364-6.364m12.728 0a9 9 0 01-12.728 0M12 12v6"
                />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
