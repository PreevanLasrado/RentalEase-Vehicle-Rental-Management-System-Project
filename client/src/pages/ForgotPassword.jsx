import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";
import { FiCheckCircle } from "react-icons/fi";


const ForgotPassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // HANDLE INPUT
  const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));

  setErrors((prev) => {
    let newErrors = { ...prev };

    // ✅ remove current field error
    delete newErrors[name];

    // 🔥 LIVE PASSWORD MATCH CHECK (SAFE VERSION)
    if (name === "confirmPassword") {
      if (value !== form.password) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (name === "password") {
      if (form.confirmPassword && value !== form.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    return newErrors;
  });
};

  // VALIDATION
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
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const loadingToast = toast.loading("Updating password...");

    try {
      await API.put("/auth/reset-password", {
        email: form.email,
        password: form.password,
      });

      toast.success("Password updated successfully", {
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
            fontSize: "16px",
            justifyContent: "center",
            gap: "8px",
            textAlign: "center",
            minWidth: "225px",
        },
    });

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      toast.error("Something went wrong", {
        duration: 5000,
        icon: <FiAlertTriangle color="white" size={20} />,
        style: {
            background: "#ef4444",
            color: "#fff",
            fontWeight: "700",
            padding: "14px 18px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            fontSize: "16px",
            justifyContent: "center",   
            gap: "8px",
            textAlign: "center",
        },
    });
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6] px-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center">
          Reset Password
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Enter your email and new password
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6">

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className={`input mt-2 ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* NEW PASSWORD */}
          <div className="mt-4">
            <label className="text-sm text-gray-600">New Password</label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter new password"
                value={form.password}
                onChange={handleChange}
                className={`input pr-10 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />

              {/* 👁 ICON WITH ANIMATION */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 -translate-y-1 cursor-pointer text-gray-500 transition-all duration-300 hover:scale-110 active:scale-90"
              >
                {showPassword ? (
                  <FiEyeOff className="transition-transform duration-300 rotate-180" />
                ) : (
                  <FiEye className="transition-transform duration-300 rotate-0" />
                )}
              </span>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mt-4">
            <label className="text-sm text-gray-600">Confirm Password</label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`input pr-10 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 -translate-y-2/4 cursor-pointer text-gray-500 transition-all duration-300 hover:scale-110 active:scale-90"
              >
                {showPassword ? (
                  <FiEyeOff className="transition-transform duration-300 rotate-180" />
                ) : (
                  <FiEye className="transition-transform duration-300 rotate-0" />
                )}
              </span>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button className="w-full mt-6 bg-orange-500 text-white py-3 rounded-xl transition-all duration-300 hover:bg-orange-600 hover:shadow-lg hover:-translate-y-1 active:scale-95">
            Update Password
          </button>

        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;