import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import VerifyPasswordtoDeleteAccount from "./pages/VerifyPasswordtoDeleteAccount";
import ForgottenPassword from "./pages/ForgottenPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminProtuctedRoute from "./Admin/AdminProtuctedRoute";
import ResetPasswordProtectroute from "./pages/ResetPasswordProtectroute";
import Footer from "./pages/Footer.jsx";

import Protuctedroute from "./components/Protuctedroute";
import AllUsers from "./Admin/AllUsers";
import SingleUserInfo from "./Admin/singleUserInfo";
import Admin, { adminloader } from "./Admin/Admin";
import GetAllListings from "./Admin/GetAllListings";
import AdditionalDetails from "./pages/AdditionalDetails";
import Getalldeletedusers from "./Admin/Getalldeletedusers";
import OtpVerification from "./pages/OtpVerification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./Loading/Loadingspinner";
import Error from "./pages/Error";
import AdminLogin from "./Admin/Adminlogin";
import OtpVerificationtoPasswordReset from "./pages/OtpVerificationtoPasswordReset";
import AdminotpVeriFication from "./Admin/AdminotpVeriFication";
import removeAdmintoken from "../src/hooks/useAdminToken";
import { useEffect } from "react";
import DashBoard from "./ProfileDashboard/Profiledashboard.jsx";
import Payments from "../src/Payments/Payment.jsx";
export default function App() {
  useEffect(() => {
    removeAdmintoken();
  }, []);
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/search"
          element={
            <Protuctedroute>
              <Search />
            </Protuctedroute>
          }
        />
        <Route
          path="/listing/:listingId"
          element={
            <Protuctedroute>
              <Listing />
            </Protuctedroute>
          }
        />
        {/* <Route path="/profile" element={<Profile />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/update-listing/:listingId" element={<UpdateListing />} /> */}
        <Route
          element={
            <Protuctedroute>
              <PrivateRoute />
            </Protuctedroute>
          }
        >
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
        </Route>
        <Route
          path="/veriftpasswordtodeleteaccount/:id"
          element={<VerifyPasswordtoDeleteAccount />}
        />
        <Route path="/forgottenpassword" element={<ForgottenPassword />} />
        <Route
          path="/resetpassword"
          element={
            <ResetPasswordProtectroute>
              <ResetPassword />
            </ResetPasswordProtectroute>
          }
        />
        <Route path="/getalluser/" element={<AllUsers />} />
        <Route path="/singleuserInfo/:userId" element={<SingleUserInfo />} />
        <Route path="/getalllistings" element={<GetAllListings />} />
        <Route path="/additionaldetails" element={<AdditionalDetails />} />
        <Route
          path="/admin"
          element={
            <AdminProtuctedRoute>
              <Admin />
            </AdminProtuctedRoute>
          }
          loader={adminloader}
        />
        <Route path="/alldeletedusers" element={<Getalldeletedusers />} />
        <Route path="/verifyotp" element={<OtpVerification />} />
        <Route
          path="/otpverificationtopasswordreset"
          element={
            <ResetPasswordProtectroute>
              <OtpVerificationtoPasswordReset />
            </ResetPasswordProtectroute>
          }
        />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route
          path="/adminotpverification"
          element={<AdminotpVeriFication />}
        />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/payment" element={<Payments />} />
        <Route path="*" element={<Error />} /> {/* Catch-all route */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
