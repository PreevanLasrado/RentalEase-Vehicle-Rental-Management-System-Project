import { FaCar, FaDollarSign, FaShieldAlt, FaHeadset } from "react-icons/fa";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import carImage from "../assets/image.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import cities from "../data/indianCities.json";
import HowItWorks from "../components/HowItWorks";
import CarRentals from "../components/CarRentals";
import WhyChooseUs from "../components/WhyChooseUs";
import OurServices from "../components/OurServices";
import Reviews from "../components/Reviews";
import HomeContact from "../components/HomeContact";
import toast from "react-hot-toast";

function SearchBar() {
  const formatTime = (time) => {
  const [hour, minute] = time.split(":");
  const h = parseInt(hour);
  const suffix = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minute} ${suffix}`;
  };

  const timeOptions = [
    "08:00","08:30","09:00","09:30",
    "10:00","10:30","11:00","11:30",
    "12:00","12:30","13:00","13:30",
    "14:00","14:30","15:00","15:30",
    "16:00","16:30","17:00","17:30",
  ];

  const timeOptions1 = [];
  for (let hour = 8; hour <= 21; hour++) {   
    timeOptions1.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour !== 21) {
      timeOptions1.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }

  const getCurrentTime = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const timeToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const isTodayFullyPassed = () => {
    const current = getCurrentTime(); // in minutes

    return timeOptions.every((time) => {
      const [h, m] = time.split(":").map(Number);
      const timeValue = h * 60 + m;
      return timeValue < current;
    });
  };

  const isDisabledDate = (date) => {
    const today = new Date();

    const isSameDay =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    // ❌ disable today if all times passed
    if (isSameDay && isTodayFullyPassed()) {
      return false; // block today
    }

    return true; // allow all other dates
  };

  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState(new Date());
  const [dropDate, setDropDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropTime, setDropTime] = useState("10:00");
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navigate = useNavigate();
  const handleSearchClick = () => {
    if (!location.trim()) {
      toast.error(
        <div className="flex items-center justify-center gap-3">
          <FaExclamationTriangle className="text-white text-lg" />
          <span>Please select a city</span>
        </div>,
        {
          id: "city-error",
          icon: null, // ❌ removes default cross icon
          style: {
            background: "#ef4444",
            color: "#fff",
            fontWeight: "600",
            padding: "14px 20px",
            borderRadius: "10px",
            width: "240px", // 🔥 smaller width
            textAlign: "center",
          },
        }
      );
      return;
    }
    navigate("/rentals", {
      state: {
        city: location,
        pickupDate,
        dropDate,
        pickupTime,
        dropTime,
      },
    });
  };

  const [suggestions, setSuggestions] = useState([]);
  const handleSearch = (query) => {
    setLocation(query);

    const filtered = cities.filter((city) =>
      city.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 10)); 
  };

  useEffect(() => {
    const handleClick = () => {
      setActiveDropdown(null);
      setSuggestions([]); // ✅ CLOSE LOCATION DROPDOWN
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (isToday(pickupDate)) {
      const current = getCurrentTime();

      const [h, m] = pickupTime.split(":").map(Number);
      const selected = h * 60 + m;

      if (selected < current) {
        setPickupTime(timeOptions.find((t) => {
          const [hh, mm] = t.split(":").map(Number);
          return hh * 60 + mm >= current;
        }) || "10:00");
      }
    }
  }, [pickupDate]);

  useEffect(() => {
    if (!pickupDate || !dropDate) return;

    const pickup = new Date(pickupDate);
    const drop = new Date(dropDate);

    // Same day (should NOT happen due to minDate, but safe check)
    if (pickup.toDateString() === drop.toDateString()) {
      const minTime = timeToMinutes(pickupTime) + 1440; // ❌ won't work same day
      return;
    }

    // If exactly next day → enforce same or later time
    const nextDay = new Date(pickup);
    nextDay.setDate(nextDay.getDate() + 1);

    if (drop.toDateString() === nextDay.toDateString()) {
      if (timeToMinutes(dropTime) < timeToMinutes(pickupTime)) {
        setDropTime(pickupTime);
      }
    }
  }, [pickupDate, dropDate, pickupTime]);

  const maxTime = 21 * 60;
  if (timeToMinutes(dropTime) > maxTime) {
    setDropTime("21:00");
  }

  useEffect(() => {
    if (isToday(pickupDate) && isTodayFullyPassed()) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setPickupDate(tomorrow);
    }
  }, [pickupDate]);

  useEffect(() => {
    if (!pickupDate) return;

    const minDrop = new Date(pickupDate);
    minDrop.setDate(minDrop.getDate() + 1); // 🔥 +24 hours (1 day)

    if (!dropDate || dropDate < minDrop) {
      setDropDate(minDrop);
    }
  }, [pickupDate]);

  return (
    <div className="relative flex justify-center -mt-28 px-6 z-20">

      <div className="w-full max-w-6xl bg-white rounded-2xl flex items-center overflow-visible border 
        shadow-[0_10px_40px_rgba(255,115,0,0.45),0_0_30px_rgba(255,140,0,0.35)] 
        hover:shadow-[0_15px_60px_rgba(255,115,0,0.6),0_0_40px_rgba(255,140,0,0.5)] 
        hover:-translate-y-1 transition-all duration-300">

        {/* LOCATION */}
        <div className="flex items-center gap-3 px-6 py-5 flex-1 border-r hover:bg-gray-50 rounded-l-2xl">
          <FaMapMarkerAlt className="text-gray-400" />

          <div 
            className="relative w-full"
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropdown(null); // ✅ CLOSE TIME DROPDOWN
            }}
            >  {/* ✅ KEEP EVERYTHING INSIDE */}

            <p className="text-xs text-gray-400">Pick up city</p>

            <input
              value={location}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Enter city"
              className="outline-none text-sm font-semibold w-full bg-transparent"
            />

            {/* ✅ DROPDOWN INSIDE */}
            {suggestions.length > 0 && (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="absolute left-0 top-full mt-3 w-full bg-white 
                shadow-2xl rounded-xl max-h-60 overflow-y-auto 
                z-[9999] border">

                {suggestions.map((city, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setLocation(city);
                      setSuggestions([]);
                    }}
                    className="px-4 py-3 hover:bg-orange-100 cursor-pointer text-sm"
                  >
                    {city}
                  </div>
                ))}

              </div>
            )}

          </div>
        </div>

        {/* PICKUP DATE */}
        <div className="relative flex items-center gap-3 px-6 py-5 flex-1 border-r">

          <FaCalendarAlt className="text-gray-400" />

          <div className="w-full">
            <p className="text-xs text-gray-400">Pick up date</p>

            <DatePicker
              selected={pickupDate}
              onChange={(date) => setPickupDate(date)}
              minDate={new Date()}
              filterDate={isDisabledDate}
              className="w-full bg-transparent outline-none text-sm font-semibold cursor-pointer"
              dateFormat="EEE, MMM d"
              popperPlacement="bottom"
            />
          </div>

        </div>

        {/* PICKUP TIME */}
        <div className="relative flex items-center gap-3 px-6 py-5 flex-1 border-r">

          <FaClock className="text-gray-400" />

          <div
            className="cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropdown(
                activeDropdown === "pickupTime" ? null : "pickupTime"
              );
              setSuggestions([]);
            }}
          >
            <p className="text-xs text-gray-400">Pick up time</p>
            <p className="text-sm font-semibold">
              {formatTime(pickupTime)}
            </p>
          </div>

          {/* DROPDOWN */}
          {activeDropdown === "pickupTime" && (
            <div className="absolute left-0 top-[90%] bg-white shadow-xl rounded-xl p-2 w-44 z-[999] max-h-60 overflow-y-auto border">

              {timeOptions
                .filter((time) => {
                  if (!isToday(pickupDate)) return true;

                  const [h, m] = time.split(":").map(Number);
                  const timeValue = h * 60 + m;

                  return timeValue >= getCurrentTime(); // 🔥 filter past
                })
                .map((time) => (
                  <div
                    key={time}
                    onClick={() => {
                      setPickupTime(time);
                      setActiveDropdown(null);
                    }}
                    className="px-3 py-2 hover:bg-orange-100 rounded cursor-pointer"
                  >
                    {formatTime(time)}
                  </div>
                ))}

            </div>
          )}

        </div>

        {/* DROP DATE */}
        <div className="relative flex items-center gap-3 px-6 py-5 flex-1 border-r">

          <FaCalendarAlt className="text-gray-400" />

          <div className="w-full">
            <p className="text-xs text-gray-400">Pick up date</p>

            <DatePicker
              selected={dropDate}
              onChange={(date) => setDropDate(date)}
              minDate={
                new Date(new Date(pickupDate).setDate(pickupDate.getDate() + 1))
              }
              maxDate={
                new Date(new Date(pickupDate).setDate(pickupDate.getDate() + 14))
              }
              // filterDate={(date) => {
              //   const min = new Date(pickupDate);
              //   min.setDate(min.getDate() + 1);

              //   const max = new Date(pickupDate);
              //   max.setDate(max.getDate() + 14);

              //   return date >= min && date <= max;
              // }}
              className="w-full bg-transparent outline-none text-sm font-semibold cursor-pointer"
              dateFormat="EEE, MMM d"
            />
          </div>

        </div>

        {/* DROP TIME */}
        <div className="relative flex items-center gap-3 px-6 py-5 flex-1">

          <FaClock className="text-gray-400" />

          <div
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropdown(
                activeDropdown === "dropTime" ? null : "dropTime"
              );
              setSuggestions([]);
            }}
            className="cursor-pointer"
          >
            <p className="text-xs text-gray-400">Drop off time</p>
            <p className="text-sm font-semibold">
              {formatTime(dropTime)}
            </p>
          </div>

          {activeDropdown === "dropTime" && (
            <div className="absolute left-0 top-[90%] bg-white shadow-xl rounded-xl p-2 w-44 z-[999] max-h-60 overflow-y-auto border">

              {timeOptions1
                .filter((time) => {
                  const timeValue = timeToMinutes(time);

                  const pickup = new Date(pickupDate);
                  const drop = new Date(dropDate);

                  const nextDay = new Date(pickup);
                  nextDay.setDate(nextDay.getDate() + 1);

                  // 🔥 If drop is exactly next day → enforce 24h
                  if (drop.toDateString() === nextDay.toDateString()) {
                    return timeValue >= timeToMinutes(pickupTime);
                  }

                  return true;
                })
                .map((time) => (
                  <div
                    key={time}
                    onClick={() => {
                      setDropTime(time);
                      setActiveDropdown(null);
                    }}
                    className="px-3 py-2 hover:bg-orange-100 rounded cursor-pointer"
                  >
                    {formatTime(time)}
                  </div>
                ))}

            </div>
          )}

        </div>

        {/* SEARCH BUTTON */}
        <button
          onClick={handleSearchClick}
          className="bg-orange-500 text-white px-10 py-7 flex items-center gap-2 font-semibold rounded-r-2xl hover:bg-orange-600 transition-all shadow-lg"
        >
          <FaSearch />
          Search
        </button>

      </div>

    </div>
  );
}

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white overflow-hidden">

      {/* 🔥 HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#f5f0e6] to-white px-16 pt-14 pb-16">

        {/* BACKGROUND WAVE */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-orange-100 rounded-t-[100%]"></div>

        <div className="grid md:grid-cols-2 items-center gap-10 min-h-[500px]">

          
          {/* TEXT */}
          <div className="flex flex-col justify-center -mt-56">
            <h1 className="font-black text-black mt-8 mb-2 hover:animate-shake transition-all duration-300">
  
              {/* MAIN BRAND */}
              <span className="text-[28px]">
                Rental<span className="text-orange-500">Ease</span>
              </span>

              {/* TAGLINE */}
              <span className="text-[28px] font-extrabold ml-2">
                - Your Ride, Your Way
              </span>

            </h1>

            <h1 className="text-5xl font-black leading-tight">
              Easy And Fast Way <br />
              To Rent Your <span className="text-orange-500">Car</span>
            </h1>

            {/* SUB TEXT */}
            <p className="mt-4 text-black-1000 font-medium text-[18px]">
              Fast, reliable, and affordable rental services available 24/7
            </p>

            {/* NEW TAGLINE */}
            <p className="mt-2 text-black-1000 font-normal text-[18px]">
              Choose from a wide range of vehicles tailored to your journey - anytime, anywhere.
            </p>

            {/* TRUST POINTS */}
            <div className="mt-4 flex gap-6 text-[17px] text-black/80">
              <span className="cursor-pointer transition duration-300 hover:text-orange-500 hover:-translate-y-1">
                  ✔ No hidden charges
              </span>

              <span className="cursor-pointer transition duration-300 hover:text-orange-500 hover:-translate-y-1">
                  ✔ Instant booking
              </span>

              <span className="cursor-pointer transition duration-300 hover:text-orange-500 hover:-translate-y-1">
                  ✔ Verified vehicles
              </span>
            </div>


            <div className="mt-6 flex gap-4">
  
              {/* BOOK NOW */}
              <button
                onClick={() => navigate("/rentals")}
                className="bg-orange-500 text-white px-6 py-2.5 rounded-lg 
                      font-semibold tracking-wide
                      transition-all duration-300 
                    hover:bg-orange-600 hover:shadow-lg hover:-translate-y-1"
              >
                Book Now
              </button>

              {/* VIEW SERVICES */}
              <button
                onClick={() => {
                  const section = document.getElementById("services");

                  if (section) {
                    const yOffset = -70; // adjust based on navbar height
                    const y =
                      section.getBoundingClientRect().top +
                      window.pageYOffset +
                      yOffset;

                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
                className="border-2 border-orange-500 text-orange-500 px-3 py-2.5 rounded-lg 
                        font-semibold tracking-wide
                        transition-all duration-300 
                      hover:bg-orange-500 hover:text-white hover:shadow-lg hover:-translate-y-1"
              >
                View Services
              </button>

            </div>
          </div>

          {/* IMAGE */}
          <div className="relative flex items-center justify-center h-[500px]">
            <img
              src={carImage}
              className="w-full h-full object-contain scale-125 
                      -translate-y-16
                      transition-all duration-500 
                      hover:scale-130 hover:-translate-y-20
                      drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <SearchBar />

      <HowItWorks />

      <CarRentals />

      <WhyChooseUs />

      <OurServices />

      <Reviews />

      <HomeContact />

      

    </div>
  );
};

export default Home;