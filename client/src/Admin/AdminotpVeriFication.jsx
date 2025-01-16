import React from "react";
import "./OtpVerification.css";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminotpVeriFication = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const email = location.state.email;
  const navigate = useNavigate();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        "/api/admin/auth/adminotpverification",
        {
          email,
          otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status == 200) {
        console.log(res.data);
        toast.info(res.data.message);
        setIsLoading(false);
        localStorage.setItem("adminToken", res.data.token);
        return navigate("/admin");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setIsLoading(false);
    }

    // Simulate API call
  };

  // Fake API call for demonstration

  return (
    <div className="otp-verification-container">
      <form className="otp-form" onSubmit={handleSubmit}>
        <h2>Admin OTP Verification</h2>
        <p>
          Please enter the 6-digit OTP sent to your registered email.{" "}
          <i>
            <span>{email}</span>
          </i>
        </p>
        <input
          type="number"
          className="otp-input"
          maxLength="6"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter OTP"
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="otp-submit-btn" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default AdminotpVeriFication;
