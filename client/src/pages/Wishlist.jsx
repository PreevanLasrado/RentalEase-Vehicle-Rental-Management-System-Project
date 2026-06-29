import { useEffect, useState } from "react";
import { Trash2, Users, Settings, Fuel, Heart, Calendar, Gauge } from "lucide-react";
import { useNavigate } from "react-router-dom";
import wishlistIcon from "../assets/wishlist_icon.png";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null);

  // 🔥 FETCH WISHLIST
  const fetchWishlist = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) return;

    try {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      setWishlist(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWishlist();

    window.addEventListener("wishlistUpdated", fetchWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", fetchWishlist);
    };
  }, []);

  const removeFromWishlist = async (vehicleId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    // 🔥 trigger animation first
    setRemovingId(vehicleId);

    setTimeout(async () => {
        try {
        await fetch("http://localhost:5000/api/wishlist/toggle", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ vehicleId }),
        });

        // remove from UI
        setWishlist((prev) =>
            prev.filter((item) => item.vehicleId._id !== vehicleId)
        );

        window.dispatchEvent(new Event("wishlistUpdated"));
        } catch (err) {
        console.error(err);
        }

        setRemovingId(null);
    }, 300); // ⏱ match animation duration
  };

  // 📅 FORMAT DATE
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ❌ EMPTY STATE
  if (!wishlist.length) {
    return (
        <div className="flex flex-col items-center justify-center h-[100vh] -mt-24 mb-12 text-gray-500 text-center
            opacity-0 animate-fadeInUp">
        {/* 🖼 IMAGE */}
        <img
            src={wishlistIcon}
            alt="Wishlist Empty"
            className="w-[500px] mb-1 opacity-100"
        />

        {/* TEXT */}
        <h2 className="text-3xl font-semibold text-gray-700 -mt-12 mb-2">
            Your Wishlist is Empty
        </h2>

        <p className="text-lg">
            Start adding vehicles you love ❤️
        </p>
        </div>
    );
  }

  return (
    <div className={`max-w-8xl mx-auto px-12 py-8 -mt-4 bg-white/80 space-y-8 ${
        wishlist.length < 3 ? "min-h-[calc(100vh-64px)]" : ""
        }`}
    >

      <h1 className="text-5xl font-black mb-8 text-gray-800 flex justify-center items-center gap-3">
        <Heart size={28} className="text-gray-500 w-8 h-8 transition-transform duration-300 hover:scale-110" />
        Wishlist
        <Heart size={28} className="text-gray-500 w-8 h-8 transition-transform duration-300 hover:scale-110" />
      </h1>

      {wishlist.map((item) => {
        const car = item.vehicleId;

        return (
         <div
            className={`group flex items-center gap-6 p-5 rounded-3xl bg-white/80 backdrop-blur-lg border border-gray-100
            shadow-[0_8px_30px_rgba(0,0,0,0.08)]
            transition-all duration-300
            ${
                removingId === car._id
                ? "opacity-0 translate-x-10 scale-95"
                : "opacity-100 translate-x-0 scale-100"
            }`}
         >
            {/* 🚗 IMAGE */}
            <div className="w-60 aspect-[16/11] overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover object-center"
                />

                {/* subtle overlay */}
                <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/10 transition" />
            </div>

            {/* 📄 DETAILS */}
            <div className="flex-1 space-y-3">
              <h2 className="text-4xl font-extrabold">{car.name}</h2>

              <div className="flex items-center gap-4 text-gray-700 text-[18px]">
                <span className="flex items-center gap-1">
                  <Users size={16} /> {car.seats} Seats
                </span>
                <span className="flex items-center gap-1">
                  <Settings size={16} /> {car.transmission}
                </span>
                <span className="flex items-center gap-1">
                  <Fuel size={16} /> {car.fuel}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} /> {car.year}
                </span>
              </div>

              <div>
                <span className="flex items-center gap-1 text-[18px]">
                    <Gauge size={16} />
                    {car.mileage} km/rental
                </span>
              </div>

              {/* 📅 ADDED ON */}
              <p className="text-[18px] text-gray-500">
                <span className="text-bold">Added on:</span> {formatDate(item.createdAt)}
              </p>
            </div>

            {/* 💰 PRICE + ACTION */}
            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <p className="text-green-600 text-[26px] font-extrabold">
                  ₹{car.pricePerDay.toLocaleString()}
                </p>
                <p className="text-[16px] text-gray-500">per day</p>
              </div>

              <div className="flex items-center gap-3">
                {/* BOOK */}
                <button
                  onClick={() =>
                    navigate("/rentals", {
                      state: {
                        openBooking: true,
                        vehicleId: car._id,
                      },
                    })
                  }
                  className="px-4 py-2 rounded-3xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all duration-300 hover:scale-110"
                >
                  Book Now
                </button>

                {/* REMOVE */}
                <button
                  onClick={() => removeFromWishlist(car._id)}
                  className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}