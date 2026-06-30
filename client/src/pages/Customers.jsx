import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Notification from "./Notification";
import AddVehicleModal from "../components/AddVehicleModal";
import axios from "axios";

const Customers = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [visibleBookings, setVisibleBookings] = useState(3);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("All");

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
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");

    localStorage.clear();

    navigate("/login");

    window.location.reload();
  };

  const [dashboardStats, setDashboardStats] = useState({
    activeRentals: 0,
    totalRevenue: 0,
    totalUsers: 0,
    fleetUtilization: 0,
    revenueTrend: [],
    recentBookings: [],

    basicMembers: 0,
    standardMembers: 0,
    premiumMembers: 0,
  });

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/dashboard/stats`
        );

        const data = await response.json();

        setDashboardStats(data);

      } catch (error) {
        console.log(error);
      }
    };

    const fetchCustomers = async () => {
      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log(data);

        // IF API RETURNS { users: [...] }
        const usersArray = data.users || data;

        // FILTER ONLY USERS
        const filteredCustomers = usersArray.filter(
          (user) => user.role === "user"
        );

        setCustomers(filteredCustomers);

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
          `${import.meta.env.VITE_API_URL}/api/contacts`,
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
    fetchCustomers();
    fetchNotifications();

  }, []);

  useEffect(() => {
    setVisibleBookings(3);

  }, [selectedCustomer]);

  const stats = [
    {
      title: "Total Customers",
      value: dashboardStats.totalUsers,
      icon: "group",
      extra: "Registered Customers",
    },

    {
      title: "Basic Members",
      value: dashboardStats.basicMembers,
      icon: "person",
      extra: "Basic Subscription Users",
    },

    {
      title: "Standard Members",
      value: dashboardStats.standardMembers,
      icon: "workspace_premium",
      extra: "Standard Plan Users",
    },

    {
      title: "Premium Members",
      value: dashboardStats.premiumMembers,
      icon: "diamond",
      extra: "Premium Loyalty Users",
    },
  ];

  const handleBookingsScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 5) {

      setVisibleBookings((prev) => prev + 3);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      setCustomers((prev) =>
        prev.filter((user) => user._id !== userId)
      );

      setSelectedCustomer(null);

    } catch (error) {
      console.log(error);
    }
  };

  const handleBlockUser = async (userId) => {
    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/block`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      setCustomers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? {
                ...user,
                isBlocked: data.isBlocked,
              }
            : user
        )
      );

      setSelectedCustomer((prev) => ({
        ...prev,
        isBlocked: data.isBlocked,
      }));

    } catch (error) {
      console.log(error);
    }
  };

  const customerSuggestions = customers
  .filter((customer) =>
    customer.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  .slice(0, 5);

  const filteredCustomers = customers.filter(
    (customer) => {

      const matchesPlan =
        selectedPlan === "All" ||
        customer.currentPlan?.toLowerCase() ===
          selectedPlan.toLowerCase();

      const matchesSearch =
        customer.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesPlan && matchesSearch;
    }
  );

  const markAsRead = async (id) => {
    try {

      const token = JSON.parse(
        localStorage.getItem("user")
      )?.token;

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/contacts/${id}/read`,
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
      <main className="ml-[280px] flex h-screen w-[calc(100vw-280px)] overflow-hidden">

        {/* LEFT CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">

          {/* TOPBAR */}
          <div className="flex items-center justify-between -mt-5 mb-6">

            {/* LEFT */}
            <div className="flex items-center gap-6 flex-1 min-w-0">

              <h1 className="text-4xl font-black text-orange-500 tracking-tight">
                Customers
              </h1>

              {/* SEARCH */}
              <div
                className="relative flex-1 max-w-[520px]"
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
                  placeholder="Search customers..."
                  className="w-full bg-white border border-orange-300 rounded-full py-3 pl-12 pr-4 outline-none focus:border-orange-400 shadow-sm"
                />

                {/* SUGGESTIONS */}
                {showSuggestions && searchTerm && (

                  <div className="absolute top-[110%] left-0 w-full bg-white border border-orange-200 rounded-3xl shadow-2xl overflow-hidden z-50">

                    {customerSuggestions.length > 0 ? (

                      customerSuggestions.map((customer) => (

                        <button
                          key={customer._id}
                          onClick={() => {

                            setSearchTerm(customer.name);

                            setSelectedCustomer(customer);

                            setShowSuggestions(false);

                          }}
                          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-orange-50 transition-all border-b border-orange-100 last:border-none text-left"
                        >

                          {/* INITIALS */}
                          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">

                            {customer.name
                              ?.split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>

                            <h3 className="font-bold text-gray-900">
                              {customer.name}
                            </h3>

                            <p className="text-sm text-gray-500">
                              {customer.email}
                            </p>

                          </div>

                        </button>
                      ))

                    ) : (

                      <div className="px-5 py-4 text-gray-500">
                        No customers found
                      </div>

                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-4 flex-shrink-0">

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
          <div className="bg-white -mb-3 rounded-3xl border border-orange-200 shadow-sm overflow-visible">

            {/* HEADER */}
            <div className="flex items-center justify-between p-6 -mb-3 border-b border-orange-100">

              <h2 className="text-3xl font-bold text-[#2b0d00]">
                Customers Details
              </h2>

              <div className="relative">
                {/* FILTER BUTTON */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-5 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-600 font-medium transition-all"
                >
                  Filters
                </button>

                {/* DROPDOWN */}
                {showFilters && (

                  <div className="absolute top-12 -left-3 w-25 bg-white border border-orange-100 rounded-2xl shadow-xl overflow-hidden z-50 animate-fadeIn">

                    {["All", "Basic", "Standard", "Premium"].map((plan) => (

                      <button
                        key={plan}
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-5 py-3 transition-all ${
                          selectedPlan === plan
                            ? "bg-orange-500 text-white"
                            : "hover:bg-orange-50 text-[#2b0d00]"
                        }`}
                      >
                        {plan}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto overflow-y-visible">

              <table className="w-full">

                <thead className="bg-orange-100">

                  <tr className="text-left text-[18px] text-gray-500">
                    <th className="p-5">Customer</th>
                    <th className="p-5">Total Rentals</th>
                    <th className="p-5">Membership Plan</th>
                    <th className="p-5">Joined Date</th>
                    <th className="p-5">Last Active</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => (

                    <tr
                      key={customer._id}
                      onClick={() => setSelectedCustomer(customer)}
                      className="border-t border-orange-100 hover:bg-orange-100 transition-all cursor-pointer"
                    >

                      {/* CUSTOMER */}
                      <td className="p-5">

                        <div className="flex items-center gap-4">

                          {/* INITIALS */}
                          <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">

                            {customer.name
                              ?.split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h3 className="font-bold text-[#2b0d00]">
                              {customer.name}
                            </h3>

                            <p className="text-sm text-gray-500">
                              {customer.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* TOTAL RENTALS */}
                      <td className="p-5 font-bold text-[#2b0d00]">
                        {customer.totalBookings || 0} Rentals
                      </td>

                      {/* MEMBERSHIP */}
                      <td className="p-5">
                        <span className="px-3 py-2 rounded-full text-[16px] font-bold bg-orange-200 text-orange-600 capitalize">
                          {customer.currentPlan || "Basic"}
                        </span>
                      </td>

                      {/* JOINED DATE */}
                      <td className="p-5 font-semibold text-gray-600">

                        {new Date(customer.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      {/* Last Active */}
                      <td className="p-5 font-semibold text-gray-600">

                        {new Date(customer.lastLogin).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        {selectedCustomer && (

          <div className="w-[380px] min-w-[380px] h-screen bg-white border-l border-orange-200 p-8 overflow-y-auto shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold text-[#2b0d00]">
                Customer Details
              </h2>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-3xl text-gray-400 hover:text-orange-500"
              >
                ×
              </button>
            </div>

            {/* PROFILE */}
            <div className="text-center">

              {/* INITIALS */}
              <div className="w-28 h-28 rounded-full bg-orange-500 flex items-center justify-center text-white text-4xl font-black mx-auto border-4 border-orange-200 shadow-lg">

                {selectedCustomer.name
                  ?.split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <h3 className="text-3xl font-black text-[#2b0d00] mt-5">
                {selectedCustomer.name}
              </h3>

              <p className="text-orange-500 font-medium mt-2 capitalize">
                {selectedCustomer.currentPlan || "Basic"} Member
              </p>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-2 gap-4 mt-8">

              {/* BLOCK */}
              <button
                onClick={() => handleBlockUser(selectedCustomer._id)}
                className={`py-3 rounded-2xl text-white font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedCustomer.isBlocked
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >

                <span className="material-symbols-outlined">
                  {selectedCustomer.isBlocked ? "lock_open" : "block"}
                </span>

                {selectedCustomer.isBlocked ? "Unblock" : "Block"}
              </button>

              {/* DELETE */}
              <button
                onClick={() => handleDeleteUser(selectedCustomer._id)}
                className="py-3 rounded-2xl border border-red-200 hover:bg-red-50 text-red-500 font-semibold transition-all flex items-center justify-center gap-2"
              >

                <span className="material-symbols-outlined">
                  delete
                </span>

                Delete
              </button>
            </div>

            {/* RECENT BOOKINGS */}
            <div className="mt-10">

              <h4 className="font-bold text-[#2b0d00] mb-5">
                Recent Bookings
              </h4>

              <div
                className={`space-y-4 pr-2 ${
                  selectedCustomer.recentBookings?.length > 3
                    ? "h-[315px] overflow-y-scroll"
                    : ""
                }`}
                onScroll={
                  selectedCustomer.recentBookings?.length > 3
                    ? handleBookingsScroll
                    : undefined
                }
              >

                {selectedCustomer.recentBookings?.length > 0 ? (

                  selectedCustomer.recentBookings
                    ?.slice(0, visibleBookings)
                    .map((booking) => (

                    <div
                      key={booking._id}
                      className="bg-orange-50 rounded-2xl p-5 border border-orange-100"
                    >

                      {/* TOP */}
                      <div className="flex items-start justify-between gap-4">

                        {/* LEFT */}
                        <div className="flex-1 min-w-0">

                          {/* CAR NAME */}
                          <h5 className="font-bold text-[18px] text-[#2b0d00] leading-none">
                            {booking.vehicle?.name || "Vehicle"}
                          </h5>

                          {/* DATES */}
                          <div className="flex items-center gap-3 mt-4 text-sm text-gray-500 whitespace-nowrap">

                            {/* START */}
                            <div className="flex items-center gap-1">

                              <span>
                                {new Date(booking.startDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",  
                                  }
                                )}
                              </span>
                            </div>

                            {/* ARROW */}
                            <span className="text-gray-400">
                              →
                            </span>

                            {/* END */}
                            <div className="flex items-center gap-1">

                              <span>
                                {new Date(booking.endDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* STATUS */}
                        <div
                          className={`px-3 py-1 -mt-2 rounded-full text-[14px] font-bold capitalize ${
                            booking.status === "active"
                              ? "bg-green-100 text-green-600"
                              : booking.status === "completed"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {booking.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (

                  <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 text-gray-500 text-center">
                    No bookings found
                  </div>
                )}
              </div>
            </div>

            {/* ACCOUNT NOTES */}
            <div className="mt-10">

              <h4 className="font-bold text-[#2b0d00] mb-2">
                Account Notes
              </h4>

              <div className="bg-[#fff8f2] border border-orange-100 text-[16px] text-justify rounded-2xl p-3 text-gray-600">
                Customer has completed{" "}
                <span className="font-bold text-[#2b0d00]">
                  {selectedCustomer.totalBookings || 0}
                </span>{" "}
                bookings with a{" "}
                <span className="capitalize">
                  {selectedCustomer.currentPlan || "basic"}
                </span>{" "}
                membership plan.
              </div>
            </div>
          </div>
        )}
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

export default Customers;