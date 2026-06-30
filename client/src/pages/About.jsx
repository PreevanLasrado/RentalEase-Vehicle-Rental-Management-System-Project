import React, { useEffect, useState, useRef} from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import CountUp from "react-countup";
import {
  FaHeadset,
  FaMapMarkerAlt,
  FaDollarSign,
  FaStar,
  FaCar,
  FaUserTie,
  FaEye,
  FaBullseye,
  FaLightbulb,
  FaUsers, 
  FaCity
} from "react-icons/fa";
import aboutImage from "../assets/about_image.png";
import aboutImage2 from "../assets/about_image2.png";
import { useInView } from "framer-motion"; 

const Counter = ({ end, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <div ref={ref}>
      <h3 className="text-5xl font-extrabold text-orange-500 mb-3">
        {count}+
      </h3>
      <p className="text-gray-500">{label}</p>
    </div>
  );
};

const About = () => {
  const { scrollY, scrollYProgress } = useScroll();

  // Parallax
  const y = useTransform(scrollY, [0, 300], [0, 80]);

  // ✅ ICONS AS COMPONENTS (FIXED)
  const features = [
    { icon: FaHeadset, title: "Customer Support", desc: "24/7 support" },
    { icon: FaMapMarkerAlt, title: "Many Locations", desc: "Multiple cities" },
    { icon: FaDollarSign, title: "Best Price", desc: "Affordable pricing" },
    { icon: FaStar, title: "Experience Driver", desc: "Professional drivers" },
    { icon: FaCar, title: "Verified Cars", desc: "Quality checked vehicles" },
    { icon: FaUserTie, title: "Consultation", desc: "Expert guidance" },
  ];

  const visionMission = [
    {
      icon: FaEye,
      title: "Vision",
      text: "To redefine rentals globally with trust and innovation.",
    },
    {
      icon: FaBullseye,
      title: "Mission",
      text: "Make renting effortless with seamless technology.",
    },
  ];

  const [stats, setStats] = useState({
    users: 0,
    vehicles: 0,
    cities: 0,
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="w-full -mt-4 bg-gray-50 text-gray-800 overflow-hidden">

      {/* 🔥 SCROLL PROGRESS BAR */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-orange-500 origin-left z-50"
      />

      {/* 🌈 FLOATING BLOBS */}
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute w-72 h-72 bg-orange-300 rounded-full blur-3xl opacity-20 top-20 left-10"
      />
      <motion.div
        animate={{ y: [0, 40, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute w-72 h-72 bg-orange-400 rounded-full blur-3xl opacity-20 bottom-20 right-10"
      />

      {/* 🚀 HERO */}
      <section className="relative py-14 -mt-2 flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 bg-gradient-to-rborder-b border-orange-300 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600"
        />

        {/* Content */}
        <div className="relative z-10 px-6">

          {/* HEADING */}
          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-6xl font-black mb-2"
          >
            About RentalEase
          </motion.h1>

          {/* SUBTEXT */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-[16px] font-bold opacity-90"
          >
            Making car rentals simple, fast and accessible — Wherever You Are
          </motion.p>

        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="max-w-6xl mx-auto px-6 -mt-12 grid md:grid-cols-2 gap-12 items-center relative">

        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-black mb-5">
            <span className="text-orange-500">Who</span>{" "}
            <span className="text-black">We</span>{" "}
            <span className="text-orange-500">Are</span>
            <span className="text-black">?</span>
          </h2>

          <p className="text-gray-600 font-medium text-[18px] leading-relaxed mb-4 text-justify">
            RentEase is a modern car rental platform built to simplify how people move.
            Whether you're traveling for business or exploring a new city, we make every
            ride effortless.
          </p>

          <p className="text-gray-600 font-medium text-[18px] leading-relaxed mb-4 text-justify">
            We combine smart technology with a user-first approach to deliver a seamless
            booking experience — Fast, Reliable and Transparent.
          </p>

          <p className="text-gray-600 font-medium text-[18px] leading-relaxed text-justify">
            At RentEase, we don’t just provide cars we deliver convenience,
            flexibility, and confidence with every journey.
          </p>
        </motion.div>

        {/* IMAGE + FLOATING ICON */}
        <div className="relative flex justify-center mt-8">
  
          {/* Glow */}
          <div className="absolute w-96 h-96 bg-orange-300 rounded-full blur-3xl opacity-20" />

          <motion.img
            src={aboutImage}
            alt="About RentEase"
            className="w-full max-w-3xl relative z-10 drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 60 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ duration: 0.9 }}
          />

        </div>

      </section>

      {/* Vision and Mission */}
      <section className="bg-gray-50 -mt-10 px-6">
        <div className="max-w-6xl mx-auto text-center">

          {/* HEADING */}
          <h2 className="text-5xl font-black mb-8">
            <span className="text-black">Our</span>{" "}
            <span className="text-orange-500">Vision</span>{" "}
            <span className="text-black">&</span>{" "} 
            <span className="text-orange-500">Mission</span>
          </h2>

          {/* CARDS */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* VISION */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-10 rounded-3xl 
                shadow-[0_5px_20px_rgba(255,115,0,0.15)] 
                transition duration-300 
                hover:shadow-[0_15px_50px_rgba(255,115,0,0.35)] 
                hover:-translate-y-2"
            >
              <div className="flex justify-center mb-4">
                <div className="text-orange-500 text-4xl">
                  <FaLightbulb />
                </div>
              </div>

              <h3 className="text-3xl font-extrabold mb-3">
                Our Vision
              </h3>

              <p className="text-gray-600 leading-relaxed text-[18px] max-w-md mx-auto">
                To become a trusted and customer-first rental platform by expanding
                our services and delivering seamless mobility experiences everywhere.
              </p>
            </motion.div>

            {/* MISSION */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-10 rounded-3xl 
                shadow-[0_5px_20px_rgba(255,115,0,0.15)] 
                transition duration-300 
                hover:shadow-[0_15px_50px_rgba(255,115,0,0.35)] 
                hover:-translate-y-2"
            >
              <div className="flex justify-center mb-4">
                <div className="text-orange-500 text-4xl">
                  <FaBullseye />
                </div>
              </div>

              <h3 className="text-3xl font-extrabold mb-3">
                Our Mission
              </h3>

              <p className="text-gray-600 leading-relaxed text-[18px] max-w-md mx-auto">
                To make renting vehicles hassle-free, reliable, and affordable,
                while ensuring customer satisfaction and safety at every step.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 🔢 COUNTERS */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">

        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black">
            Our <span className="text-orange-500">Stats</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

          {/* USERS */}
          <motion.div
            whileHover={{ y: -8, scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-[0_10px_40px_rgba(255,115,0,0.25)] transition"
          >
            <div className="text-black text-5xl mb-2 flex justify-center">
              <FaUsers />
            </div>
            <h3 className="text-[60px] font-extrabold text-orange-500">
              <Counter end={stats.users} />
            </h3>
            <p className="text-gray-500 text-[18px]">Users</p>
          </motion.div>

          {/* VEHICLES */}
          <motion.div
            whileHover={{ y: -8, scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-[0_10px_40px_rgba(255,115,0,0.25)] transition"
          >
            <div className="text-black text-5xl mb-2 flex justify-center">
              <FaCar />
            </div>
            <h3 className="text-[60px] font-extrabold text-orange-500">
              <Counter end={stats.vehicles} />
            </h3>
            <p className="text-gray-500 text-[18px]">Vehicles</p>
          </motion.div>

          {/* CITIES */}
          <motion.div
            whileHover={{ y: -8, scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-[0_10px_40px_rgba(255,115,0,0.25)] transition"
          >
            <div className="text-black text-5xl mb-2 flex justify-center">
              <FaCity />
            </div>
            <h3 className="text-[60px] font-extrabold text-orange-500">
              <Counter end={stats.cities} />
            </h3>
            <p className="text-gray-500 text-[18px]">Cities</p>
          </motion.div>

          {/* SUPPORT */}
          <motion.div
            whileHover={{ y: -8, scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-[0_10px_40px_rgba(255,115,0,0.25)] transition"
          >
            <div className="text-black text-5xl mb-2 flex justify-center">
              <FaHeadset />
            </div>
            <h3 className="text-5xl font-extrabold text-orange-500 mb-3">
              24/7
            </h3>
            <p className="text-gray-500 text-[18px]">Support</p>
          </motion.div>

        </div>
      </section>

      {/* 💡 WHY CHOOSE US */}
      <section className="bg-white py-18 mb-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* ✨ Glow behind car */}
          <div className="absolute w-[400px] h-[400px] bg-orange-500 blur-[120px] opacity-30 rounded-full"></div>

          {/* 🖼️ Car Image */}
          <motion.img
            src={aboutImage2}
            alt="Why Choose Us"
            className="w-full max-w-2xl relative z-10 drop-shadow-2xl"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />

          {/* 📄 CONTENT (RIGHT) */}
          <div>

            {/* HEADING */}
            <h2 className="text-5xl font-black mb-4">
              <span className="text-orange-500">Why</span>{" "}
              <span className="text-black">Choose</span>{" "}
              <span className="text-orange-500">Us</span>
              <span className="text-black">?</span>
            </h2>

            {/* SUBTEXT */}
            <p className="text-gray-600 max-w-xl mb-12 text-lg leading-relaxed">
              We offer the best car rental experience with top-quality vehicles,
              affordable pricing, and excellent customer support.
            </p>

            {/* FEATURES GRID */}
            <div className="grid md:grid-cols-2 gap-y-12 gap-x-14">

              {features.map((item, i) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={i}
                    className="flex items-start gap-5"
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="text-orange-500 text-4xl mt-1">
                      <Icon />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default About;