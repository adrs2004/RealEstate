import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import axios from "axios";
import { toast } from "react-toastify";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [showpassword, setshowpassword] = useState(false);
  const from = location.state?.from || "/";
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("logintoken")) {
      toast.error("You Are Already Logged In");
      navigate(from, { replace: true });
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
      formData.email.trim().length === 0
    ) {
      return toast.error("Please Enter Your Crenditils Correctely");
    }
    try {
      dispatch(signInStart());
      const res = await axios.post("/api/auth/signin", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = res.data;
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      localStorage.setItem("logintoken", data.refreshtoken);
      dispatch(signInSuccess(data));
      navigate(from);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        dispatch(signInFailure(error.response.data.message));
      } else {
        dispatch(signInFailure("Something went wrong. Please try again."));
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-white-500 to-indigo-600">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex items-center justify-center">
          <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

      <div
        className={`p-8 max-w-lg w-full bg-white shadow-2xl rounded-xl z-0 transition-opacity duration-300 ${
          loading ? "opacity-20" : "opacity-100"
        }`}
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Sign in to continue accessing your account
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="Email Address"
            className="border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            id="email"
            onChange={handleChange}
          />
          <div className="relative">
            <input
              type={!showpassword ? "password" : "text"}
              placeholder="Password"
              className="border border-gray-300 p-4 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              id="password"
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setshowpassword(!showpassword)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
            >
              {!showpassword ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 01-6 0 3 3 0 016 0zm-3 6a9 9 0 100-12 9 9 0 000 12z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.045.162-2.053.464-3.002m8.646 8.647a3 3 0 014.244-4.244m1.718-3.032a9.977 9.977 0 012.306 2.306m-.707 6.536a10.048 10.048 0 01-1.5 1.193"
                  />
                </svg>
              )}
            </button>
          </div>
          <button
            disabled={loading}
            className="bg-blue-600 text-white py-4 rounded-lg uppercase font-medium hover:bg-blue-700 disabled:opacity-80 transition-colors"
          >
            Sign In
          </button>
          <OAuth />
        </form>

        <div className="flex justify-between items-center mt-6">
          <Link to="/sign-up" className="text-blue-500 hover:underline">
            Don’t have an account? Sign up
          </Link>
          <Link
            to="/forgottenpassword"
            className="text-blue-500 hover:underline"
          >
            Forgotten Password
          </Link>
        </div>

        {error && (
          <div className="mt-5 p-4 border border-red-500 rounded-lg bg-red-50 text-red-700 flex items-center gap-3">
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
    </div>
  );
}
