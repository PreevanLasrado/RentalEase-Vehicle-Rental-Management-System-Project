import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MdEmail, MdLocationPin, MdOutlinePayments } from "react-icons/md";
import { FaPhone, FaPhoneAlt, FaWhatsapp, FaCarSide } from "react-icons/fa";
import { FiArrowRight, FiSettings, FiCalendar, FiRefreshCw } from "react-icons/fi";
import { RiCustomerService2Line } from "react-icons/ri";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    subject: "",
    message: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});

  const userInfo = JSON.parse(localStorage.getItem("user"));

  const cities = [
    "Bangalore",
    "Mumbai",
    "Delhi",
    "Chennai",
    "Hyderabad",
    "Pune",
    "Kolkata",
  ];

  const validate = () => {
    let newErrors = {};

    // ✅ NAME (letters only + min 3)
    if (!/^[A-Za-z ]+$/.test(form.name)) {
      newErrors.name = "Name must contain only letters";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // ✅ EMAIL (same as before)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email";
    }

    // ✅ PHONE (exactly 10 digits)
    if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    // ✅ CITY
    if (!form.city) {
      newErrors.city = "Please select a city";
    }

    // ✅ SUBJECT (simple message)
    if (!form.subject.trim()) {
      newErrors.subject = "Enter subject";
    }

    // ✅ MESSAGE (simple message)
    if (!form.message.trim()) {
      newErrors.message = "Enter your message";
    }

    // ✅ CHECKBOX
    if (!form.agree) {
      newErrors.agree = "You must agree before submitting";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (!userInfo || !userInfo.token) {
      toast.error("Please login first to send your message!", {
        id: "login-required",

        style: {
          borderRadius: "12px",
          background: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #fca5a5",
          padding: "14px 20px",
          fontWeight: "600",
          minWidth: "390px",
          whiteSpace: "nowrap",
        },

        iconTheme: {
          primary: "#dc2626",
          secondary: "#ffffff",
        },
      });

      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/contacts",
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          city: form.city,
          subject: form.subject,
          message: form.message,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      toast.success("Message sent successfully!", {
        style: {
          borderRadius: "12px",
          background: "#ecfdf5",
          color: "#16a34a",
          border: "1px solid #86efac",
          padding: "14px 18px",
          fontWeight: "600",
        },
        iconTheme: {
          primary: "#16a34a",
          secondary: "#ffffff",
        },
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        subject: "",
        message: "",
        agree: false,
      });

    } catch (error) {

      toast.error("Something went wrong!", {
        style: {
          borderRadius: "12px",
          background: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #fca5a5",
          padding: "14px 18px",
          fontWeight: "600",
        },
        iconTheme: {
          primary: "#dc2626",
          secondary: "#ffffff",
        },
      });
    }
  };

  const formRef = useRef(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full bg-white">

      {/* 🔥 HERO SECTION */}
      <section className="bg-orange-50 py-10 -mt-6 px-10 flex flex-col md:flex-row items-center justify-between gap-5">

        {/* LEFT IMAGE */}
        <div className="flex justify-center md:w-1/2">
          <div className="w-[420px] h-[420px] rounded-full overflow-hidden relative">
            <img
              src="https://img.freepik.com/premium-photo/customer-service-representative-with-headset-smiling_1410957-71604.jpg"
              alt="support"
              className="w-full h-full object-cover"
            />

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full shadow-[0_0_80px_20px_rgba(255,115,0,0.4)]"></div>
          </div>
        </div>

        {/* RIGHT TEXT */}
        <div className="md:w-1/2 text-center md:text-left">

          {/* SUPPORT HUB */}
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full mb-2 shadow-sm border border-orange-200 animate-pulse">
            <RiCustomerService2Line className="text-2xl" />

            <span className="text-sm font-extrabold tracking-[0.2em] uppercase">
              Support Hub
            </span>
          </div>

          <h2 className="text-6xl font-black leading-tight">
            <span className="text-orange-500">Get <span className="text-black">in </span>Touch</span>{" "}
            <span className="text-black">With <span className="text-orange-500">Us</span></span>
          </h2>

          <p className="text-gray-600 mt-3 -mb-3 text-lg leading-relaxed max-w-[600px] text-justify">
            Need assistance with bookings, rentals, or travel support? Our RentEase
            team is always ready to deliver fast, reliable service and a smooth customer experience.
          </p>

          <button
            onClick={scrollToForm}
            className="mt-6 bg-orange-500 text-white px-5 py-2 rounded-full text-[18px] font-semiabold shadow-lg hover:bg-orange-600 transition-all"
          >
            Reach Us
          </button>
        </div>
      </section>
      <div
        ref={formRef}
        className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-8"
      >

        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-10 items-stretch">

          {/* 🔵 LEFT SIDE - CONTACT INFO */}
          <div className="space-y-6">
            {/* TITLE */}
            <div>
              <h2 className="text-4xl font-extrabold text-black">General Inquiries</h2>
              <p className="text-gray-500 mt-2 text-[16px]">
                Reach out for business partnerships, fleet inquiries, or feedback.
              </p>
            </div>

            {/* EMAIL */}
            <div className="group flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-gray-50">

              {/* ICON */}
              <div className="bg-gray-100 p-3 rounded-full text-2xl text-gray-700 
                transition-all duration-300 
                group-hover:bg-orange-500 
                group-hover:text-white">
                <MdEmail />
              </div>

              {/* TEXT */}
              <div>
                <p className="text-xs text-orange-500 font-semibold">EMAIL</p>
                <p className="font-medium text-gray-800">support@rentalease.in  </p>
              </div>

            </div>

            {/* PHONE */}
            <div className="group flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-gray-50">

              <div className="bg-gray-100 p-3 rounded-full text-xl text-gray-700 
                transition-all duration-300 
                group-hover:bg-orange-500 
                group-hover:text-white">
                <FaPhoneAlt />
              </div>

              <div>
                <p className="text-xs text-orange-500 font-semibold pl-1">PHONE</p>
                <p className="font-medium text-gray-800 pl-1">+91 12345 67890 </p>
              </div>

            </div>

            {/* LOCATION */}
            <div className="group flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-gray-50">

              <div className="bg-gray-100 p-3 rounded-full text-2xl text-gray-700 
                transition-all duration-300 
                group-hover:bg-orange-500 
                group-hover:text-white">
                <MdLocationPin />
              </div>

              <div>
                <p className="text-xs text-orange-500 font-semibold">HEADQUARTERS</p>
                <p className="font-medium text-gray-800">Bangalore, India</p>
              </div>

            </div>

            {/* 🔥 DARK PRIORITY CARD */}
            <div className="bg-gradient-to-br from-black to-gray-900 text-white p-6 rounded-3xl mt-4">
              
              <span className="bg-red-500 text-xs px-3 py-1 rounded-full font-semibold text-white animate-pulse">
                URGENT SUPPORT
              </span> 

              <h3 className="text-xl font-semibold mt-4">
                Priority Fleet Help
              </h3>

              <p className="text-gray-300 text-sm mt-2 text-justify">
                Need immediate support while on the move? Our team is ready to assist you in real-time with fast, reliable solutions. Get the help you need, exactly when you need it—without delays.
              </p>  

              <div
                onClick={() => window.open("https://wa.me/", "_blank")}
                className="group inline-flex items-center mt-3 gap-2 cursor-pointer font-semibold text-orange-400 relative transition-all duration-300"
              >

                {/* TEXT */}
                <span className="transition-all duration-300 group-hover:text-orange-300">
                  Live WhatsApp Support
                </span>

                {/* ICON */}
                <FiArrowRight
                  className="text-lg transition-all duration-300 transform group-hover:translate-x-2"
                />

              </div>

            </div>

          </div>

          {/* 🟠 RIGHT SIDE - FORM */}
          <div className="bg-white p-8 rounded-3xl h-full flex flex-col border 
            shadow-[0_10px_40px_rgba(255,120,0,0.25),0_0_25px_rgba(255,120,0,0.15)] 
            hover:shadow-[0_20px_60px_rgba(255,120,0,0.45),0_0_40px_rgba(255,120,0,0.25)] 
            transition-all duration-300">

            <h2 className="text-4xl font-extrabold -mt-2 mb-8 text-center">
              Contact <span className="text-orange-500">Us</span>
            </h2>

            <form onSubmit={handleSubmit} noValidate className="space-y-5 flex flex-col h-full">

              <div className="grid md:grid-cols-2 gap-4">
                {/* NAME */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[A-Za-z ]*$/.test(value)) {
                        setForm({ ...form, name: value });
                      }
                    }}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* PHONE */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                    PHONE NUMBER
                  </label>

                  <div className="flex items-center border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-400">

                    {/* COUNTRY CODE */}
                    <div className="px-4 py-3 bg-gray-100 text-gray-700 font-medium">
                      +91
                    </div>

                    {/* INPUT */}
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      value={form.phone}
                      maxLength={10}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setForm({ ...form, phone: value.slice(0, 10) });
                      }}
                      className="w-full px-4 py-3 outline-none"
                    />
                  </div>

                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* CITY */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                    CITY
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">Select City</option>
                    {cities.map((c, i) => (
                      <option key={i}>{c}</option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>

              </div>

              {/* SUBJECT */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  SUBJECT
                </label>
                <input
                  type="text"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm">{errors.subject}</p>
                )}
              </div>

              {/* MESSAGE */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  YOUR MESSAGE
                </label>
                <textarea
                  rows="3"
                  placeholder="Tell us about your vehicle requirements, fleet size, route, timeline or any other details..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400 resize-none"
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm">{errors.message}</p>
                )}
              </div>

              {/* CHECKBOX */}
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                  className="accent-orange-500"
                />
                <p>I agree that RentalEase may contact me in response to this enquiry. My details will not be shared with third parties.</p>
              </div>
              {errors.agree && <p className="text-red-500 text-sm">{errors.agree}</p>}

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 -mb-3 rounded-3xl font-semibold hover:bg-orange-600 transition"
              >
                Send Message
              </button>          

            </form>
          </div>
        </div>
      </div>
      <section className="py-14 overflow-hidden bg-white">

      {/* SLIDER */}
      <div className="max-w-7xl -mt-10 -mb-4 mx-auto relative overflow-hidden">

        {/* LEFT FADE */}
        <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>

        {/* RIGHT FADE */}
        <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>

        <div className="flex animate-marquee gap-6 w-max">

          {[
            {
              title: "Free Maintenance",
              icon: <FiSettings />,
            },
            {
              title: "Cancel Anytime",
              icon: <FiCalendar />,
            },
            {
              title: "Easy Returns",
              icon: <FiRefreshCw />,
            },
            {
              title: "Premium Support",
              icon: <RiCustomerService2Line />,
            },
            {
              title: "Secure Payments",
              icon: <MdOutlinePayments />,
            },
            {
              title: "24/7 Assistance",
              icon: <FaCarSide />,
            },

            // duplicate for infinite effect
            {
              title: "Free Maintenance",
              icon: <FiSettings />,
            },
            {
              title: "Cancel Anytime",
              icon: <FiCalendar />,
            },
            {
              title: "Easy Returns",
              icon: <FiRefreshCw />,
            },
            {
              title: "Premium Support",
              icon: <RiCustomerService2Line />,
            },
            {
              title: "Secure Payments",
              icon: <MdOutlinePayments />,
            },
            {
              title: "24/7 Assistance",
              icon: <FaCarSide />,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="min-w-[260px] bg-orange-50 border border-orange-100 rounded-3xl p-8 
              shadow-sm hover:shadow-[0_10px_30px_rgba(255,120,0,0.25)] 
              hover:-translate-y-1 transition-all duration-300 group"
            >

              {/* ICON */}
              <div className="text-5xl text-orange-500 mb-6 
              transition-all duration-300 
              group-hover:scale-110 
              group-hover:drop-shadow-[0_0_15px_rgba(255,120,0,0.6)]">
                {item.icon}
              </div>

              {/* TITLE */}
              <h3 className="text-2xl font-bold text-gray-800 leading-snug">
                {item.title}
              </h3>

            </div>
          ))}

        </div>
      </div>
    </section>
    </div>
  );
};

export default Contact;