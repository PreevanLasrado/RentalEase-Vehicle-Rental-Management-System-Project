import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Notification from "./Notification";
import AddVehicleModal from "../components/AddVehicleModal";
import axios from "axios";

const AdminBookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingTableRef = useRef(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [showNotifications, setShowNotifications] =
  useState(false);
  const [notifications, setNotifications] =
    useState([]);

  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // REMOVE AUTH DATA
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");

    // OPTIONAL: CLEAR EVERYTHING
    localStorage.clear();

    // REDIRECT
    navigate("/login");

    // FORCE REFRESH
    window.location.reload();
  };

  const [dashboardStats, setDashboardStats] = useState({
    activeRentals: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalBookings: 0,
    fleetUtilization: 0,
    revenueTrend: [],
    recentBookings: [],
  });

  const bookingSuggestions =
  dashboardStats.recentBookings
    .filter((booking) => {

      const bookingId =
        `BK-${booking._id.slice(-5).toUpperCase()}`;

      const customerName =
        booking.user?.name || "";

      return (

        bookingId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||

        customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

    })
    .slice(0, 5);

  const filteredBookings =
  dashboardStats.recentBookings.filter(
    (booking) => {

      const matchesStatus =
        statusFilter === "all" ||
        booking.status === statusFilter;

      const bookingId =
        `BK-${booking._id.slice(-5).toUpperCase()}`;

      const customerName =
        booking.user?.name || "";

      const matchesSearch =

        bookingId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||

        customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    }
  );

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  useEffect(() => {
    const fetchDashboardStats = async () => {
        try {

        const response = await fetch(
            "http://localhost:5000/api/dashboard/stats"
        );

        const data = await response.json();

        setDashboardStats(data);

        } catch (error) {
        console.log(error);
        }
    };

    const fetchNotifications = async () => {
      try {

        const token = JSON.parse(
          localStorage.getItem("user")
        )?.token;

        const res = await axios.get(
          "http://localhost:5000/api/contacts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications(res.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboardStats();
    fetchNotifications();

  }, []);

  const stats = [
    {
        title: "Total Bookings",
        value: dashboardStats.totalBookings,
        icon: "calendar_today",
        extra: "All Bookings",
    },

    {
        title: "Active Rentals",
        value: dashboardStats.activeRentals,
        icon: "directions_car",
        extra: "Currently Active",
    },

    {
        title: "Revenue",
        value: `₹${dashboardStats.totalRevenue.toLocaleString("en-IN")}`,
        icon: "payments",
        extra: "Total Revenue Till Date",
    },

    {
        title: "Total Users",
        value: dashboardStats.totalUsers,
        icon: "group",
        extra: "Registered Users",
    },
    ];

  const scrollToBookings = () => {
    bookingTableRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
  };

  const markAsRead = async (id) => {
    try {

      const token = JSON.parse(
        localStorage.getItem("user")
      )?.token;

      await axios.put(
        `http://localhost:5000/api/contacts/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, read: true }
            : item
        )
      );

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener(
        "click",
        handleClickOutside
      );
    };

  }, []);

  return (
    <div className="flex min-h-screen bg-[#fff8f2] font-inter">

      {/* SIDEBAR */}
      <aside className="w-[280px] bg-gradient-to-b from-[#2b0d00] to-[#4a1800] text-white flex flex-col justify-between p-6 fixed left-0 top-0 h-screen overflow-hidden">

        <div>

          {/* LOGO */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="material-symbols-outlined text-white">
                directions_car
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-black">
                RentalEase
              </h1> 

              <p className="text-sm text-orange-200">
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-1">

            {[
              {
                name: "Overview",
                path: "/dashboard",
                icon: "dashboard",
              },
              {
                name: "Fleet",
                path: "/fleet",
                icon: "directions_car",
              },
              {
                name: "Bookings",
                path: "/adminbookings",
                icon: "calendar_today",
              },
              {
                name: "Customers",
                path: "/customers",
                icon: "group",
              },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "hover:bg-white/10 text-orange-100"
                }`}
              >
                <span className="material-symbols-outlined">
                  {item.icon}
                </span>

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* USER */}
        <div className="border-t border-white/10 pt-5">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* INITIALS */}
            <div className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl border-2 border-orange-300 shadow-lg">

                {user?.name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            {/* USER INFO */}
            <div>
                <h3 className="font-bold text-[16px] text-white leading-none mb-1">
                {user?.name || "Admin"}
                </h3>

                <p className="text-[14px] text-orange-200">
                RentalEase Admin
                </p>
            </div>
            {/* LOGOUT */}
            <button
               onClick={handleLogout}
               className="w-11 h-11 rounded-xl bg-[#0f172a] hover:bg-red-500 transition-all duration-300 flex items-center justify-center group"
            >
               <span className="material-symbols-outlined text-white group-hover:translate-x-1 transition-all">
                   logout
               </span>
            </button>   
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-[280px] flex-1 p-8">

        {/* TOPBAR */}
        <div className="flex items-center justify-between -mt-5 mb-6">

          {/* LEFT */}
          <div className="flex items-center gap-8">

            {/* DASHBOARD TITLE */}
            <h1 className="text-4xl font-black text-orange-500 tracking-tight">
                Bookings
            </h1>

            {/* SEARCH */}
            <div
              className="relative w-[520px]"
              onClick={(e) => e.stopPropagation()}
            >

              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                search
              </span>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search bookings..."
                className="w-full bg-white border border-orange-300 rounded-full py-3 pl-12 pr-4 outline-none focus:border-orange-400 shadow-sm"
              />

              {/* SUGGESTIONS */}
              {showSuggestions && searchTerm && (

                <div className="absolute top-[110%] left-0 w-full bg-white border border-orange-200 rounded-3xl shadow-2xl overflow-hidden z-50">

                  {bookingSuggestions.length > 0 ? (

                    bookingSuggestions.map((booking) => (

                      <button
                        key={booking._id}
                        onClick={() => {

                          setSearchTerm(
                            `BK-${booking._id
                              .slice(-5)
                              .toUpperCase()}`
                          );

                          setShowSuggestions(false);

                        }}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-orange-50 transition-all border-b border-orange-100 last:border-none text-left"
                      >

                        <div>

                          <h3 className="font-bold text-[#2b0d00]">
                            BK-{booking._id
                              .slice(-5)
                              .toUpperCase()}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {booking.user?.name || "User"}
                          </p>

                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            booking.status === "cancelled"
                              ? "bg-red-100 text-red-500"
                              : booking.status === "completed"
                              ? "bg-blue-100 text-blue-500"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {booking.status.toUpperCase()}
                        </span>

                      </button>
                    ))

                  ) : (

                    <div className="px-5 py-4 text-gray-500">
                      No bookings found
                    </div>

                  )}
                </div>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-5">

            <button
              onClick={() =>
                setShowNotifications(true)
              }
              className="relative w-12 h-12 rounded-2xl bg-white border border-orange-100 flex items-center justify-center hover:bg-orange-100 transition-all"
            >
              <span className="material-symbols-outlined text-orange-500 text-[28px]">
                notifications
              </span>

              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[8px] font-bold flex items-center justify-center border-2 border-white shadow-md">
                  {unreadCount}
                </div>
              )}
            </button>

            <button
              onClick={() => setShowAddVehicle(true)}
              className="bg-orange-500 hover:bg-orange-600 transition-all text-white px-4 py-3 rounded-3xl flex items-center gap-2 font-semibold shadow-lg shadow-orange-500/30"
            >
              <span className="material-symbols-outlined">
                add
              </span>

              Add New Vehicle
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-6 mb-6">

          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-orange-300 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">

                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-orange-500">
                    {stat.icon}
                  </span>
                </div>
              </div>

              <p className="text-gray-500 mb-2">
                {stat.title}
              </p>

              <h1 className="text-[clamp(1.8rem,2.5vw,3.8rem)] leading-none font-black mb-4 break-all">
                {stat.value}
              </h1>

              <p className="text-sm text-orange-500 font-medium">
                {stat.extra}
              </p>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div ref={bookingTableRef} className="bg-white -mb-3 rounded-3xl border border-orange-300 shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="p-6 border-b border-orange-100 flex justify-between items-center">

                <h2 className="text-3xl -ml-1 font-bold">
                    Detailed Booking Status
                </h2>

                <div className="flex items-center gap-3">
                    {["all", "active", "completed", "cancelled"].map((status) => (

                        <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 capitalize overflow-hidden ${
                            statusFilter === status
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105"
                            : "bg-orange-50 text-orange-500 hover:bg-orange-100"
                        }`}
                        >
                        <span className="relative z-10">
                            {status}
                        </span>

                        {/* IOS STYLE GLOW */}
                        {statusFilter === status && (
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 animate-pulse opacity-20"></div>
                        )}
                        </button>
                    ))}
                </div>
            </div>

            {/* TABLE */}
            <div className="max-h-[520px] overflow-y-auto overflow-x-auto custom-scrollbar">

                <table className="w-full">

                <thead className="bg-orange-100 text-[18px] text-gray-500">
                    <tr>
                    <th className="text-left p-5">Booking ID</th>
                    <th className="text-left p-5">Customer</th>
                    <th className="text-left p-5">Vehicle</th>
                    <th className="text-left p-5">Period</th>
                    <th className="text-left p-5">Amount</th>
                    <th className="text-left p-5">Status</th>
                    </tr>
                </thead>

                <tbody>

                    {filteredBookings.map((booking, index) => (

                    <tr
                        key={index}
                        className="border-b border-orange-100 hover:bg-orange-50/50 transition-all"
                    >

                        {/* BOOKING ID */}
                        <td className="p-5 text-orange-500 font-semibold">
                        #BK-{booking._id.slice(-5).toUpperCase()}
                        </td>

                        {/* CUSTOMER */}
                        <td className="p-5">
                        {booking.user?.name || "User"}
                        </td>

                        {/* VEHICLE */}
                        <td className="p-5">
                        {booking.vehicle?.name || "Vehicle"}
                        </td>

                        {/* PERIOD */}
                        <td className="p-5">

                            <div className="flex flex-col">

                                {/* DATES */}
                                <span className="font-medium">
                                {new Date(booking.startDate).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                                {" - "}
                                {new Date(booking.endDate).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                                </span>

                                {/* TIMES */}
                                <span className="text-sm text-gray-500 mt-1">
                                {booking.pickupTime} → {booking.dropTime}
                                </span>

                            </div>
                        </td>

                        {/* AMOUNT */}
                        <td className="p-5 font-semibold">
                        ₹{booking.totalPrice?.toLocaleString("en-IN")}
                        </td>

                        {/* STATUS */}
                        <td className="p-5">

                        <span
                            className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                            booking.status === "cancelled"
                                ? "bg-red-100 text-red-500"
                                : booking.status === "completed"
                                ? "bg-blue-100 text-blue-500"
                                : "bg-green-100 text-green-600"
                            }`}
                        >
                            {booking.status?.toUpperCase()}
                        </span>

                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
      </main>

      <Notification
        isOpen={showNotifications}
        onClose={() =>
          setShowNotifications(false)
        }
        notifications={notifications}
        markAsRead={markAsRead}
      />

      <AddVehicleModal
        showAddVehicle={showAddVehicle}
        setShowAddVehicle={setShowAddVehicle}
      />

    </div>
  );
};

export default AdminBookings;