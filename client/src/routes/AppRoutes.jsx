import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Rentals from "../pages/Rentals";
import Pricing from "../pages/Pricing";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import Bookings from "../pages/Bookings";
import Dashboard from "../pages/Dashboard";
import Wishlist from "../pages/Wishlist";
import Fleet from "../pages/Fleet";
import AdminBookings from "../pages/AdminBookings";
import Customers from "../pages/Customers";
import ScrollToTop from "../components/ScrollToTop";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfServicePage from "../pages/TermsOfService";
import CookiesPolicyPage from "../pages/CookiesPolicy";

const AppRoutes = () => {
  return (
    <BrowserRouter>

      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/rentals"
          element={
            <MainLayout>
              <Rentals />
            </MainLayout>
          }
        />

        <Route
          path="/pricing"
          element={
            <MainLayout>
              <Pricing />
            </MainLayout>
          }
        />

        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />

        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />

        <Route
          path="/signup"
          element={
            <MainLayout>
              <Signup />
            </MainLayout>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <MainLayout>
              <ForgotPassword />
            </MainLayout>
          }
        />

        <Route 
          path="/profile" 
          element={
            <Profile />
          } 
        />

        <Route 
          path="/bookings" 
          element={
            <Bookings />
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <Dashboard />
          } 
        />

        <Route
          path="/wishlist"
          element={
            <MainLayout>
              <Wishlist />
            </MainLayout>
          }
        />

        <Route 
          path="/fleet" 
          element={
              <Fleet />
          } 
        />

        <Route 
          path="/AdminBookings" 
          element={
            <AdminBookings />
          } 
        />

        <Route 
          path="/Customers" 
          element={
            <Customers />
          } 
        />

        <Route
          path="/privacy-policy"
          element={
            <PrivacyPolicy />
          }
        />

        <Route
          path="/terms-of-service"
          element={
            <TermsOfServicePage />
          }
        />

        <Route
          path="/cookies"
          element={
            <CookiesPolicyPage />
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;