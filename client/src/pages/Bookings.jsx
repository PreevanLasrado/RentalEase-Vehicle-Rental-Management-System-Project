import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Car,
  MapPin,
  XCircle,
  CheckCircle2,
  History,
  Users,
  Fuel,
  Settings2,
  RotateCcw,
} from "lucide-react";

const MyBookings = () => {
  const navigate = useNavigate();
  const [activeBookings, setActiveBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const activeRef = useRef(null);
  const completedRef = useRef(null);
  const cancelledRef = useRef(null);

  const token = localStorage.getItem("token");

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []); 

  useEffect(() => {
    if (showCancelModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCancelModal]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/bookings/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      const now = new Date();

      const active = [];
      const past = [];
      const cancelled = [];

      res.data.forEach((booking) => {
        const endDate = new Date(booking.endDate);

        if (booking.status === "cancelled") {
          cancelled.push(booking);
        } else if (endDate >= now) {
          active.push(booking);
        } else {
          past.push(booking);
        }
      });

      const sortLatest = (arr) =>
        arr.sort(
          (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

      setActiveBookings(sortLatest(active));
      setPastBookings(sortLatest(past));
      setCancelledBookings(sortLatest(cancelled));
    } catch (err) {
      console.log(err);
    }
  };

  const cancelBooking = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBookings();
    } catch (err) {
      console.log(err);
    }
  };

  const openCancelModal = (id) => {
    setSelectedBookingId(id);
    setShowCancelModal(true);
  };

  const handleRebook = (booking) => {
    navigate("/rentals", {
      state: {
        rebook: true,

        oldBookingId: booking._id,

        vehicleId: booking.vehicle._id,
        startDate: booking.startDate,
        endDate: booking.endDate,

        pickupTime: booking.pickupTime,
        dropTime: booking.dropTime,
      },
    });
  };

  const handleCompletedRebook = (booking) => {
    navigate("/rentals", {
      state: {
        completedRebook: true,
        vehicleId: booking.vehicle._id,
      },
    });
  };

  const canCancelBooking = (booking) => {
    const now = new Date();

    // FORMAT DATE
    const pickupDate = new Date(booking.startDate);

    // GET TIME
    const pickupTime = booking.pickupTime || "08:00 AM";

    // SPLIT TIME
    const [time, modifier] = pickupTime.split(" ");

    let [hours, minutes] = time.split(":");

    hours = parseInt(hours);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    // SET REAL HOURS
    pickupDate.setHours(hours);
    pickupDate.setMinutes(parseInt(minutes));
    pickupDate.setSeconds(0);

    return now < pickupDate;
  };

  const BookingCard = ({ booking, active, handleCompletedRebook }) => (
    <div className="bg-white border border-gray-200 rounded-[30px] p-3 hover:shadow-xl transition duration-300 overflow-hidden">

      <div className="flex items-center justify-between gap-6">

        {/* LEFT */}
        <div className="flex items-center gap-5 flex-1 min-w-0">

          {/* IMAGE */}
          <img
            src={booking.vehicle?.image}
            alt=""
            className="w-[290px] h-[190px] rounded-[24px] object-cover flex-shrink-0"
          />

          {/* DETAILS */}
          <div className="flex flex-col justify-center min-w-0 flex-1">

            {/* NAME */}
            <h2 className="text-[26px] leading-none font-black text-gray-900">
              {booking.vehicle?.name}
            </h2>

            {/* LOCATION + FEATURES */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-5 text-gray-600">

              {/* LOCATION */}
              <div className="flex items-center gap-1 text-[16px]">
                <MapPin size={16} />
                <span>{booking.vehicle?.city}</span>
              </div>

              {/* SEATS */}
              <div className="flex items-center gap-1 text-[16px]">
                <Users size={16} />
                <span>{booking.vehicle?.seats} Seats</span>
              </div>

              {/* TRANSMISSION */}
              <div className="flex items-center gap-1 text-[16px]">
                <Settings2 size={16} />
                <span>{booking.vehicle?.transmission}</span>
              </div>

              {/* FUEL */}
              <div className="flex items-center gap-1 text-[16px]">
                <Fuel size={16} />
                <span>{booking.vehicle?.fuel}</span>
              </div>

              {/* YEAR */}
              <div className="flex items-center gap-1 text-[16px]">
                <Calendar size={16} />
                <span>{booking.vehicle?.year}</span>
              </div>
            </div>

            {/* DATES */}
            <div className="flex gap-4 mt-3 flex-wrap">

              {/* PICKUP */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 min-w-[165px]">

                <p className="text-gray-600 text-[16px] mb-1">
                  Pickup
                </p>

                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  <Calendar size={16} />
                  <span>
                    {new Date(booking.startDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm mt-1">
                  <Clock size={16} />
                  <span>
                    {booking.pickupTime || "08:00 AM"}
                  </span>
                </div>
              </div>

              {/* DROPOFF */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 min-w-[165px]">

                <p className="text-gray-600 text-[16px] mb-1">
                  Dropoff
                </p>

                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  <Calendar size={16} />
                  <span>
                    {new Date(booking.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm mt-1">
                  <Clock size={16} />
                  <span>
                    {booking.dropTime || "08:00 AM"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col justify-between items-end self-stretch min-w-[180px]">

          {/* PRICE */}
          <div className="text-right">
            <p className="text-gray-500 text-[16px]">
              Booking Price
            </p>

            <h3 className="text-[24px] font-black text-gray-900">
              ₹{booking.totalPrice?.toLocaleString()}
            </h3>
          </div>

          {/* BUTTON */}
          {active && (
            <button
              onClick={() => openCancelModal(booking._id)}
              disabled={!canCancelBooking(booking)}
              className={`px-6 py-3 rounded-2xl font-semibold transition shadow-lg whitespace-nowrap ${
                canCancelBooking(booking)
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-100"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              }`}
            >
              {canCancelBooking(booking)
                ? "Cancel Booking"
                : "Booking Active"}
            </button>
          )}

          {/* CANCELLED */}
          {booking.status === "cancelled" && (
            <button
              onClick={() => handleRebook(booking)}
              disabled={!canCancelBooking(booking)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition shadow-lg whitespace-nowrap ${
                canCancelBooking(booking)
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-100"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              }`}
            >
              <RotateCcw size={18} />

              {canCancelBooking(booking)
                ? "Rebook"
                : "Rebook"}
            </button>
          )}

          {/* COMPLETED BOOKINGS */}
          {booking.status === "completed" && (
            <button
              onClick={() => handleCompletedRebook(booking)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition shadow-lg shadow-blue-100"
            >
              <RotateCcw size={18} />
              Rebook
            </button>
          )}

        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb] overflow-x-hidden">
      
      <Navbar />

      {/* TOP HERO */}
      <div className="relative overflow-hidden">
        
        {/* GRADIENT BG */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 opacity-95"></div>

        {/* BLUR CIRCLES */}
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-28 -mb-12">

          <div className="flex flex-col items-center justify-center text-center">

            {/* TOP LABEL */}
            <p className="uppercase tracking-[7px] text-white/70 font-semibold mb-6 text-sm">
              Rental Dashboard
            </p>

            {/* HEADING */}
            <h1 className="text-7xl lg:text-8xl font-black text-white leading-[0.9]">
              My Bookings
            </h1>

            {/* DESCRIPTION */}
            <p className="text-white/85 text-xl mt-6 max-w-2xl leading-relaxed">
              Track your active rentals, revisit past trips and manage cancelled bookings — all from your personal RentalEase dashboard.
            </p>

            {/* STATS */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">

              {/* ACTIVE */}
              <div  
                onClick={() => scrollToSection(activeRef)}
                className="w-[100px] h-[100px] bg-white/15 backdrop-blur-2xl border border-white/20 rounded-[30px] flex flex-col items-center justify-center shadow-2xl hover:scale-105 transition duration-300"
              >

                <h3 className="text-white text-[14px] mb-2 font-bold">
                  Active
                </h3>

                <p className="text-2xl font-black text-white -mb-1">
                  {activeBookings.length}
                </p>
              </div>

              {/* COMPLETED */}
              <div 
                onClick={() => scrollToSection(completedRef)}
                className="w-[100px] h-[100px] bg-white/15 backdrop-blur-2xl border border-white/20 rounded-[30px] flex flex-col items-center justify-center shadow-2xl hover:scale-105 transition duration-300"
              >

                <h3 className="text-white text-[14px] mb-2 font-bold">
                  Completed
                </h3>

                <p className="text-2xl font-black text-white -mb-1">
                  {pastBookings.length}
                </p>
              </div>

              {/* CANCELLED */}
              <div 
                onClick={() => scrollToSection(cancelledRef)}
                className="w-[100px] h-[100px] bg-white/15 backdrop-blur-2xl border border-white/20 rounded-[30px] flex flex-col items-center justify-center shadow-2xl hover:scale-105 transition duration-300"
              >

                <h3 className="text-white text-[14px] mb-2 font-bold">
                  Cancelled
                </h3>

                <p className="text-2xl font-black text-white -mb-1">
                  {cancelledBookings.length}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">

        {/* ACTIVE BOOKINGS */}
        <section ref={activeRef} className="mb-20">

          <div className="flex items-center justify-between mb-8">

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="text-green-500" size={30} />
              </div>

              <div>
                <h2 className="text-4xl font-black text-gray-900">
                  Active Bookings
                </h2>

                <p className="text-gray-500 mt-1">
                  Your currently running rentals
                </p>
              </div>
            </div>
          </div>

          {activeBookings.length === 0 ? (
            <div className="bg-white rounded-[35px] border border-gray-100 shadow-sm p-20 text-center">
              
              <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="text-green-500" size={45} />
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No Active Rentals
              </h3>

              <p className="text-gray-500 text-lg">
                Your current bookings will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5 max-h-[700px] overflow-y-auto pr-2 custom-scroll">
              {activeBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  active={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* HISTORY */}
        <section ref={completedRef} className="mb-20">

          <div className="flex items-center justify-between mb-8">

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <History className="text-blue-500" size={30} />
              </div>

              <div>
                <h2 className="text-4xl font-black text-gray-900">
                  Booking History
                </h2>

                <p className="text-gray-500 mt-1">
                  Your completed journeys
                </p>
              </div>
            </div>
          </div>

          {pastBookings.length === 0 ? (
            <div className="bg-white rounded-[35px] border border-gray-100 shadow-sm p-20 text-center">

              <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-8">
                <History className="text-blue-500" size={45} />
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No Booking History
              </h3>

              <p className="text-gray-500 text-lg">
                Your completed rentals will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5 max-h-[700px] overflow-y-auto pr-2 custom-scroll">
              {pastBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} handleCompletedRebook={handleCompletedRebook} />
              ))}
            </div>
          )}
        </section>

        {/* CANCELLED */}
        <section ref={cancelledRef}>

          <div className="flex items-center justify-between mb-8">

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
                <XCircle className="text-red-500" size={30} />
              </div>

              <div>
                <h2 className="text-4xl font-black text-gray-900">
                  Cancelled Bookings
                </h2>

                <p className="text-gray-500 mt-1">
                  Cancelled rental history
                </p>
              </div>
            </div>
          </div>

          {cancelledBookings.length === 0 ? (
            <div className="bg-white rounded-[35px] border border-gray-100 shadow-sm p-20 text-center">

              <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-8">
                <XCircle className="text-red-500" size={45} />
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No Cancelled Bookings
              </h3>

              <p className="text-gray-500 text-lg">
                Cancelled rentals will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5 max-h-[700px] overflow-y-auto pr-2 custom-scroll">
              {cancelledBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">

          {/* BLUR BACKDROP */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          {/* MODAL */}
          <div className="relative bg-white w-[420px] max-w-[90%] rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">

            {/* CLOSE */}
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-5 right-5 text-gray-700 text-[20px] hover:text-black transition"
            >
              ✕
            </button>

            {/* ICON */}
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <XCircle className="text-red-500" size={42} />
            </div>

            {/* TITLE */}
            <h2 className="text-3xl font-black text-center text-gray-900">
              Cancel Booking?
            </h2>

            {/* DESCRIPTION */}
            <p className="text-gray-500 text-center mt-4 leading-relaxed">
              Are you sure you want to cancel this booking?
              This action cannot be undone.
            </p>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-8">

              {/* NO */}
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 h-[55px] rounded-2xl border border-gray-200 font-semibold hover:bg-gray-300 transition"
              >
                No
              </button>

              {/* YES */}
              <button
                onClick={async () => {
                  await cancelBooking(selectedBookingId);
                  setShowCancelModal(false);
                }}
                className="flex-1 h-[55px] rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold transition shadow-lg shadow-red-200"
              >
                Yes, Cancel
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyBookings;