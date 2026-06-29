import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiCheckCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import carImage from "../assets/login_image1.png";
import bikeImage from "../assets/login_image2.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // ✅ REMOVE ERROR WHEN USER TYPES
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  // 🔥 VALIDATION
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (!/^[a-zA-Z0-9]{6,}$/.test(form.password)) {
      newErrors.password =
        "Password must be at least 6 characters and alphanumeric";
    }

    return newErrors;
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/auth/login", form);

      login(data);

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data));

      toast.success("Login successful", {
        duration: 4000,
        icon: <FiCheckCircle color="white" size={20} />,
        style: {
          background: "#22c55e",
          color: "#fff",
          fontWeight: "700",
          padding: "14px 18px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          textAlign: "center",
          minWidth: "260px",
        },
      });

      // 🔥 CHECK IF LOGIN FROM BOOKING
      const fromBooking = localStorage.getItem("loginFromBooking");
      const redirectPath = localStorage.getItem("redirectAfterLogin");

      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath); // 🔥 GO BACK TO PRICING
      } else if (fromBooking === "true") {
        localStorage.removeItem("loginFromBooking");
        navigate("/rentals");
      } else {
        navigate("/");
      }

    } catch (error) {

      const message =
        error.response?.data?.message;

      // ACCOUNT SUSPENDED
      if (
        message ===
        "Your account has been suspended by admin"
      ) {

        toast.dismiss();
        toast.error(
          "Your account has been suspended by admin",
          {
            duration: 5000,
            icon: <FiAlertTriangle color="white" size={20} />,
            style: {
              background: "#ef4444",
              color: "#fff",
              fontWeight: "700",
              padding: "16px 24px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              textAlign: "center",
              minWidth: "450px",
              whiteSpace: "nowrap",
              boxShadow: "0 10px 25px rgba(239,68,68,0.35)",
            },
          }
        );

      } else {

        toast.dismiss();
        // INVALID CREDENTIALS
        toast.error(
          "Invalid credentials",
          {
            duration: 4000,
            icon: <FiAlertTriangle color="white" size={18} />,
            style: {
              background: "#ef4444",
              color: "#fff",
              fontWeight: "700",
              padding: "14px 18px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              textAlign: "center",
              minWidth: "260px",
            },
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6] px-6 -mt-10">

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 1200 800"
      >
        {/* ROAD BASE */}
        <path
          d="M60 400 C 150 800, 600 750, 700 350 C 800 10, 1300 350, 1150 550"
          stroke="#2f2f2f"
          strokeWidth="100"
          fill="none"
          strokeLinecap="round"
        />

        {/* ROAD EDGE LIGHT */}
        <path
          d="M60 400 C 150 800, 600 750, 700 350 C 800 10, 1300 350, 1150 550"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="125"
          fill="none"
          strokeLinecap="round"
        />

        {/* CENTER DASH LINE */}
        <path
          d="M60 400 C 150 800, 600 750, 700 350 C 800 10, 1300 350, 1150 550"
          stroke="white"
          strokeWidth="4"
          fill="none"
          strokeDasharray="20 20"
          strokeDashoffset="0"
          strokeLinecap="round"
          className="road-draw"
        />
      </svg>
        
      <img
        src={bikeImage}
        alt="Bike"
        style={{
          transform: `translate(${mouse.x * -30}px, ${mouse.y * -20}px)`,
        }}
        className="hidden lg:block absolute left-10 top-20 w-[490px] animate-floatBike transition-transform duration-200 ease-out pointer-events-none"
      />

      <div className="bg-white p-8 rounded-2xl w-full z-10 max-w-md shadow-[0_0_25px_rgba(255,140,0,0.35),0_15px_40px_rgba(0,0,0,0.15)]
        hover:shadow-[0_0_50px_rgba(255,115,0,0.6),0_20px_50px_rgba(0,0,0,0.2)]
        hover:-translate-y-1 transition-all duration-300">

        <h2 className="text-3xl font-bold text-center">Welcome Back</h2>

        <form onSubmit={handleSubmit} noValidate className="mt-6">

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600">Email</label>

            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className={`input mt-2 ${
                errors.email ? "border-red-500" : ""
              }`}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mt-4 relative">
            <label className="text-sm text-gray-600">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className={`input mt-2 pr-10 ${
                errors.password ? "border-red-500" : ""
              }`}
            />

            {/* 👁 ICON */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-14 -translate-y-1 cursor-pointer text-gray-500 transition-all duration-300 hover:scale-110 active:scale-90"
            >
              {showPassword ? (
                <FiEyeOff className="transition-transform duration-300 rotate-180" />
              ) : (
                <FiEye className="transition-transform duration-300" />
              )}
            </span>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* FORGOT PASSWORD */}
          <div className="text-right mt-2">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-orange-500 hover:underline hover:text-orange-600 transition"
            >
              Forgot Password?
            </button>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-orange-500 text-white py-3 rounded-xl transition-all duration-300 hover:bg-orange-600 hover:shadow-lg hover:-translate-y-1 active:scale-95"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* SIGNUP */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-orange-500 hover:underline"
          >
            Sign Up
          </Link>
        </p>

      </div>

      <img
        src={carImage}
        alt="Car"
        style={{
          transform: `translate(${mouse.x * 30}px, ${mouse.y * 20}px)`,
        }}
        className="hidden lg:block absolute right-5 -bottom-5 w-[500px] animate-floatCar transition-transform duration-200 ease-out pointer-events-none"
      />
            
    </div>
  );
};

export default Login;