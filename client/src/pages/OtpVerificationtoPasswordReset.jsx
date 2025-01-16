import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

const OtpVerificationtoPasswordReset = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits.");
      return;
    }

    if (!email) {
      toast.error("Email not found.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/auth/verifyotptoresetpassword", {
        otp,
        email,
      });

      // localStorage.setItem("resetEmail", email);

      if (res.data.message === "OTP verified successfully") {
        toast.info("OTP verified! Redirecting to reset password...", {
          theme: "colored",
          autoClose: 3000,
        });

        setTimeout(() => {
          navigate("/resetpassword"); // Redirect after 2 seconds
        }, 2000);
      } else {
        toast.error(res.data.message || "OTP verification failed.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
      //toast.error("Something went wrong. aditya");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-gray-800 via-gray-900 to-black">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          OTP Verification
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className="w-full p-5 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-4 focus:ring-teal-400"
            maxLength="6"
            required
          />

          <button
            disabled={loading}
            className="bg-teal-500 text-white py-4 rounded-lg uppercase font-bold text-lg hover:bg-teal-600 disabled:bg-teal-300 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-700">
          Didn’t receive the OTP?{" "}
          <button
            onClick={() => toast.info("Resending OTP...")}
            className="text-teal-600 font-semibold hover:underline"
          >
            Resend OTP
          </button>
        </p>
      </div>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default OtpVerificationtoPasswordReset;
