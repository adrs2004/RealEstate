// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// export default function OtpVerification() {
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setOtp(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await axios.post("/api/auth/verifyotp", {
//         email: location.state.email,
//         username: location.state.username,
//         password: location.state.password,
//         otp,
//       });

//       const data = res.data;

//       if (data.message === "OTP verified and user registered successfully!") {
//         toast.info("OTP verified and user registered successfully!");
//         setError(null);
//         navigate("/sign-in");
//       }
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.error) {
//         setError(error.response.data.error); // Display specific error from backend
//       } else {
//         setError("OTP verification failed.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-3 max-w-lg mx-auto">
//       <h1 className="text-3xl text-center font-semibold my-7">Verify OTP</h1>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input
//           type="text"
//           placeholder="Enter OTP"
//           className="border p-3 rounded-lg"
//           value={otp}
//           onChange={handleChange}
//           required
//         />
//         <button
//           disabled={loading}
//           className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
//         >
//           {loading ? "Verifying..." : "Verify OTP"}
//         </button>
//       </form>
//       {error && (
//         <div className="mt-5 p-4 border border-red-500 rounded-lg bg-red-100 text-red-700 flex items-center gap-3">
//           <svg
//             className="w-6 h-6 text-red-500"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M18.364 5.636a9 9 0 11-12.728 0m12.728 0L12 12m0 0l-6.364-6.364m12.728 0a9 9 0 01-12.728 0M12 12v6"
//             />
//           </svg>
//           <p className="font-medium">{error}</p>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    // Allow only numeric input and limit to 6 characters
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const res = await axios.post("/api/auth/verifyotp", {
        email: location.state.email,
        username: location.state.username,
        password: location.state.password,
        otp,
      });

      const data = res.data;

      if (data.message === "OTP verified and user registered successfully!") {
        toast.success("OTP verified and user registered successfully!");
        navigate("/sign-in");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("OTP verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "90vh",
      }}
    >
      <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-2xl text-center font-bold mb-6 text-gray-800">
          Verify Your OTP
        </h1>
        <p className="text-center text-gray-600 mb-4">
          Enter the 6-digit OTP sent to your email to verify your account.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Enter OTP"
            className="border rounded-lg p-3 text-lg text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={otp}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={otp.length !== 6 || loading}
            className={`p-3 rounded-lg text-white text-lg font-semibold ${
              otp.length === 6 && !loading
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </div>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
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
        <p className="text-center text-gray-500 mt-5">
          Didn't receive the OTP?{" "}
          <button
            onClick={() => toast.info("Resend OTP feature coming soon!")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
}
