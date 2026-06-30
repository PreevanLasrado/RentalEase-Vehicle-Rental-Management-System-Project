import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Car, Heart } from "lucide-react";
import logo from "../assets/carlogo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  // ✅ USE CONTEXT (FIXED)
  const { user, logout } = useAuth();

  // 🔤 INITIALS
  const getInitials = (name) => {
    if (!name) return ""; 
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 👇 CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      // 🔴 if logged out → reset immediately
      if (!user?.token) {
        setWishlistCount(0);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        setWishlistCount(data.count || data.length || 0);
      } catch (err) {
        console.error(err);
        setWishlistCount(0);
      }
    };

    fetchWishlist();

    // 🔄 listen for updates (wishlist + logout)
    window.addEventListener("wishlistUpdated", fetchWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", fetchWishlist);
    };
  }, [user]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 bg-[#f5f0e6] shadow-md flex items-center px-10 h-16 
        ${scrolled
          ? "bg-white/80 backdrop-blur-md shadow-md"
          : "bg-white"
        }`}
    >

      {/* LOGO */}
      <Link to="/" className="flex items-center gap-1 cursor-pointer hover:scale-105 transition duration-300">

        {/* Icon */}
        <img
          src={logo}
          alt="RentalEase Logo"
          className="h-10 w-auto object-contain group-hover:scale-105 transition duration-300"
        />

        {/* Logo Text */}
        <h1 className="text-[32px] font-black tracking-tight">
          <span className="text-black">Rental</span>
          <span className="text-orange-500">Ease</span>
        </h1>

      </Link>

      {/* RIGHT SIDE */}
      <div className="ml-auto flex items-center gap-4">

        {/* NAV LINKS */}
        <div className="flex gap-8 text-[17px] font-medium">

          {[
            { name: "Home", path: "/" },
            { name: "Rental Deals", path: "/rentals" },
            { name: "Our Plans", path: "/pricing" },
            { name: "About Us", path: "/about" },
            { name: "Contact Us", path: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="relative group transition"
            >
              <span className="group-hover:text-orange-500 transition duration-300">
                {item.name}
              </span>

              {/* 🔥 UNDERLINE */}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/rentals")}
          className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition"
        >
          Book Now
        </button>

        {wishlistCount > 0 && (
          <div
            onClick={() => navigate("/wishlist")}
            className="w-10 h-10 flex items-center justify-center rounded-full 
                      bg-gray-200 cursor-pointer 
                      transition-all duration-300 
                      hover:bg-red-500 hover:scale-110 group"
          >
            <Heart
              size={20}
              className="text-gray-800 fill-gray-800 
                        transition-all duration-500 
                        group-hover:text-white group-hover:fill-white 
                        group-hover:rotate-[360deg]"
            />
          </div>
        )}

        {/* PROFILE */}
        <div className="relative" ref={dropdownRef}>

          {/* ICON */}
          <div
            onClick={() => setOpen(!open)}
            className="cursor-pointer hover:scale-110 transition"
          >
            {user ? (
              <div className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center font-semibold border-2 border-orange-500 shadow-sm hover:shadow-md hover:scale-105 transition">
                {getInitials(user.name)}
              </div>
            ) : (
              <FaUserCircle
                size={30} 
                className="text-gray-700 hover:text-orange-500 transition"
              />
            )}
          </div>

          {/* DROPDOWN */}
          <div
            className={`absolute top-14 right-0 translate-x-[23%] w-36 bg-white rounded-xl shadow-xl py-2 transition-all duration-300 
            ${
              open
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >
            {user ? (
              <>
                {/* PROFILE */}
                <button
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 transition"
                >
                  Profile
                </button>

                {/* ROLE BASED */}
                {user.role === "admin" ? (
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 transition"
                  >
                    Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/bookings");
                      setOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 transition"
                  >
                    My Bookings
                  </button>
                )}

                {/* LOGOUT */}
                <button
                  onClick={() => {
                    logout();
                    localStorage.removeItem("token");
                    localStorage.removeItem("user"); 
                    window.dispatchEvent(new Event("wishlistUpdated"));
                    navigate("/login");
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 transition"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    navigate("/signup");
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;