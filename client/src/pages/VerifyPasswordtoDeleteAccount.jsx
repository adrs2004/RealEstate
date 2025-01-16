// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   deleteUserFailure,
//   deleteUserStart,
//   deleteUserSuccess,
// } from "../redux/user/userSlice";
// import axios from "axios";
// import { toast } from "react-toastify";

// const VerifyPasswordtoDeleteAccount = () => {
//   const [password, setpassword] = useState("");
//   const [loading, setloading] = useState(false);
//   const [username, setusername] = useState("");
//   const [error, seterror] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { currentUser } = useSelector((state) => state.user);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       dispatch(deleteUserStart());
//       setloading(true);

//       const res = await axios.post(
//         `/api/user/delete/${currentUser._id}`,
//         { password },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = res.data;

//       if (!data.success) {
//         dispatch(deleteUserFailure(data.message));
//         //toast.error(data.message); // Display backend error message
//         seterror(data.message);
//         setloading(false);
//         return;
//       }

//       dispatch(deleteUserSuccess(data));
//       localStorage.removeItem("logintoken");
//       toast.success("Successfully Deleted Your Account!"); // Success toast
//       setloading(false);
//       navigate("/"); // Redirect after success
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || "Something went wrong!";
//       seterror(errorMessage);
//       dispatch(deleteUserFailure(errorMessage));
//       //toast.error(errorMessage); // Show error toast with specific message
//       setloading(false);
//     }
//   };

//   return (
//     <div className="p-3 max-w-lg mx-auto">
//       <h1 className="text-3xl text-center font-semibold my-7">
//         Delete Account
//       </h1>
//       <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//         <img
//           src={currentUser.avatar}
//           alt="profile"
//           className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
//         />
//         <h1 className="font-medium">Username: {currentUser.username}</h1>

//         <input
//           type="text"
//           placeholder="Enter Username"
//           className="border p-3 rounded-lg"
//           value={username}
//           onChange={(e) => setusername(e.target.value)}
//         />
//         <p
//           className={`text-red-500 text-sm mt-1 ${
//             username !== currentUser.username ? "visible" : "invisible"
//           }`}
//         >
//           Username is incorrect. Please enter the correct username.
//         </p>

//         <input
//           type="password"
//           placeholder="Enter Password"
//           className="border p-3 rounded-lg"
//           value={password}
//           onChange={(e) => setpassword(e.target.value)}
//         />
//         <button
//           disabled={
//             loading ||
//             !(username === currentUser.username && password.length > 5)
//           }
//           className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
//         >
//           {loading ? "Deleting..." : "Delete Account"}
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
// };

// export default VerifyPasswordtoDeleteAccount;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const VerifyPasswordtoDeleteAccount = () => {
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [username, setusername] = useState("");
  const [error, seterror] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(deleteUserStart());
      setloading(true);
      const ppassword = password.trim();

      const res = await axios.post(
        `/api/user/delete/${currentUser._id}`,
        { ppassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;

      if (!data.success) {
        dispatch(deleteUserFailure(data.message));
        seterror(data.message);
        setloading(false);
        return;
      }

      dispatch(deleteUserSuccess(data));
      localStorage.removeItem("logintoken");
      toast.success("Successfully Deleted Your Account!");
      setloading(false);
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      seterror(errorMessage);
      dispatch(deleteUserFailure(errorMessage));
      setloading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-2xl text-center font-semibold my-4">
        Delete Account
      </h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <h1 className="font-medium">Username: {currentUser.username}</h1>

        <input
          type="text"
          placeholder="Enter Username"
          className="border p-3 rounded-lg"
          value={username}
          onChange={(e) => setusername(e.target.value)}
        />

        <p
          className={`text-red-500 text-sm ${
            username.length > 1 && username !== currentUser.username
              ? "visible"
              : "invisible"
          }`}
        >
          Username is incorrect. Please enter the correct username.
        </p>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className="border p-3 rounded-lg w-full"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          disabled={
            loading ||
            !(username === currentUser.username && password.length > 5)
          }
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Deleting..." : "Delete Account"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 border border-red-500 rounded-lg bg-red-100 text-red-700 flex items-center gap-3">
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
    </div>
  );
};

export default VerifyPasswordtoDeleteAccount;
