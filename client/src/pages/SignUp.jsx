// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import OAuth from "../components/OAuth";

// export default function SignUp() {
//   const [formData, setFormData] = useState({});
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showpassword, setshowpassword] = useState(false);
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (localStorage.getItem("logintoken")) {
//       toast.error("You Are Already Logged in ");
//       return navigate("/");
//     }
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null); // Reset error
//     try {
//       setLoading(true);

//       const res = await axios.post("/api/auth/signup", formData, {
//         headers: { "Content-Type": "application/json" },
//       });

//       const data = res.data;

//       if (data.success) {
//         // Show Toastify notification
//         toast.success("Please check your email for OTP verification!");
//         setLoading(false);

//         // Navigate to OTP verification page with email as state
//         navigate("/verifyotp", {
//           state: {
//             email: formData.email,
//             username: formData.username,
//             password: formData.password,
//           },
//         });
//       } else {
//         setLoading(false);
//         setError(data.error); // Display error message from backend
//       }
//     } catch (error) {
//       setLoading(false);

//       // Display error message from backend response
//       if (error.response && error.response.data && error.response.data.error) {
//         setError(error.response.data.error);
//       } else {
//         setError("Something went wrong. Please try again.");
//       }
//     }
//   };

//   return (
//     <div className="p-3 max-w-lg mx-auto">
//       <h1 className="text-3xl text-center font-semibold my-7">
//         Create Account{" "}
//       </h1>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input
//           type="text"
//           placeholder="Username"
//           className="border p-3 rounded-lg"
//           id="username"
//           onChange={handleChange}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           className="border p-3 rounded-lg"
//           id="email"
//           onChange={handleChange}
//           required
//         />
//         <input
//           type={!showpassword ? "password" : "text"}
//           placeholder="Password"
//           className="border p-3 rounded-lg"
//           id="password"
//           onChange={handleChange}
//         />
//         <span>Show</span>
//         <input
//           className="flex flex-initial "
//           type="checkbox"
//           checked={showpassword}
//           onChange={() => {
//             setshowpassword(!showpassword);
//           }}
//         />
//         <button
//           disabled={loading}
//           className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
//         >
//           {loading ? "Loading..." : "Sign Up"}
//         </button>
//         <OAuth />
//       </form>
//       <div className="flex gap-2 mt-5">
//         <p>Have an account?</p>
//         <Link to="/sign-in">
//           <span className="text-blue-700">Sign in</span>
//         </Link>
//       </div>
//       {/* Display error message */}
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

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showpassword, setshowpassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("logintoken")) {
      toast.error("You Are Already Logged in");
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.password.trim().length === 0 ||
      formData.email.trim().length == 0 ||
      formData.username.trim().length == 0
    ) {
      return toast.error("Please Enter Your Details Correctely ...");
    }

    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.password
      )
    ) {
      return toast.error(
        "Password must be at least 8 characters long and include at least one letter, one number, and one special character."
      );
    }
    setError(null);
    try {
      setLoading(true);

      const res = await axios.post("/api/auth/signup", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const data = res.data;

      if (data.success) {
        toast.success("Please check your email for OTP verification!");
        setLoading(false);
        navigate("/verifyotp", {
          state: {
            email: formData.email,
            username: formData.username,
            password: formData.password,
          },
        });
      } else {
        setLoading(false);
        setError(data.error);
      }
    } catch (error) {
      setLoading(false);

      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500 p-5">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="text-center">
          <img
            src="https://media.giphy.com/media/j2pOGeGYKe2xCCKwfi/giphy.gif"
            alt="Sign Up"
            className="w-24 mx-auto"
          />
          <h1 className="text-2xl font-bold text-gray-700 mt-4">
            Create Your Account
          </h1>
          <p className="text-gray-500 text-sm">
            Sign up to get started with our platform.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            id="username"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            id="email"
            onChange={handleChange}
            required
          />
          <div className="relative">
            <input
              type={!showpassword ? "password" : "text"}
              placeholder="Password"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              id="password"
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setshowpassword(!showpassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showpassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg uppercase font-semibold hover:bg-blue-700 transition disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
          <OAuth />
        </form>
        {error && (
          <div className="p-4 bg-red-100 border border-red-500 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <svg
              className="w-5 h-5 text-red-500"
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
            <span>{error}</span>
          </div>
        )}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
