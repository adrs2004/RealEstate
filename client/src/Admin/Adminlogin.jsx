// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const AdminLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   useEffect(() => {
//     localStorage.removeItem("adminToken");
//     if (localStorage.getItem("logintoken")) {
//       toast.error("Please First Logout");
//       return navigate("/");
//     }
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await axios.post("/api/admin/auth/login", {
//         email,
//         password,
//       });
//       console.log(response.data);

//       toast.info("Otp is Send To Registeted email");
//       navigate("/adminotpverification", {
//         state: {
//           email: email,
//         },
//       }); // Navigate to the admin dashboard
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Login failed. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md bg-white p-8 shadow-md rounded-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//         <form onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-2" htmlFor="email">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               placeholder="Enter Email"
//               className="w-full p-3 border border-gray-300 rounded"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <label
//               className="block text-sm font-medium mb-2"
//               htmlFor="password"
//             >
//               Password
//             </label>
//             <input
//               placeholder="Enter Password "
//               type="password"
//               id="password"
//               className="w-full p-3 border border-gray-300 rounded"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("adminToken");
    if (localStorage.getItem("logintoken")) {
      toast.error("Please First Logout");
      return navigate("/");
    }
  }, []);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email change and validate syntax
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (validateEmail(value)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
      //toast.error("Please enter a valid email");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/admin/auth/login", {
        email,
        password,
      });
      console.log(response.data);

      toast.info("OTP is sent to the registered email");
      navigate("/adminotpverification", {
        state: { email },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white p-8 shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                className="w-full p-3 border border-gray-300 rounded"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {email.length > 3 && !isEmailValid && (
                <p>Please Enter Valid Email</p>
              )}
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                placeholder="Enter Password"
                type="password"
                id="password"
                className="w-full p-3 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={!isEmailValid || password === ""}
              className={`w-full py-3 rounded transition ${
                !isEmailValid || password === ""
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
