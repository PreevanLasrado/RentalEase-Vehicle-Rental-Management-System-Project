import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Notification from "./Notification";
import AddVehicleModal from "../components/AddVehicleModal";

const Fleet = () => {
  const [activeFilter, setActiveFilter] = useState("All Vehicles");
  const [vehicles, setVehicles] = useState([]);
  const [visibleVehicles, setVisibleVehicles] = useState([]);
  const [page, setPage] = useState(1);
  const VEHICLES_PER_LOAD = 7;
  const tableRef = useRef(null);

  const location = useLocation();

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);  

  const [showDetails, setShowDetails] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const navigate = useNavigate();
  const bookingTableRef = useRef(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const [showNotifications, setShowNotifications] =
    useState(false);
  const [notifications, setNotifications] =
    useState([]);

  const [showAddVehicle, setShowAddVehicle] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user"));
  
  const isActive = (path) => location.pathname === path;

  const [showEditModal, setShowEditModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState({
    category: "",
    type: "",
    transmission: "",
    fuel: "",
    year: "",
    color: "",
    mileage: "",
    pricePerDay: "",
  });

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

  useEffect(() => {
    const fetchVehicles = async () => {

      try {

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/vehicles`
        );

        setVehicles(data);
        setVisibleVehicles(data.slice(0, VEHICLES_PER_LOAD));

      } catch (error) {

        console.log(error);
      }
    };

    fetchVehicles();

  }, []);

  useEffect(() => {
    const container = tableRef.current;
    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 50
      ) {

        if (visibleVehicles.length < filteredVehicles.length) {

          const nextPage = page + 1;

          const nextVehicles = filteredVehicles.slice(
            0,
            nextPage * VEHICLES_PER_LOAD
          );

          setVisibleVehicles(nextVehicles);
          setPage(nextPage);
        }
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };

  }, [visibleVehicles, vehicles, page]);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      vehicle.brand
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      vehicle.city
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      vehicle.licensePlate
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return (

      matchesSearch &&

      (selectedBrand === "" ||
        vehicle.brand === selectedBrand) &&

      (selectedCity === "" ||
        vehicle.city === selectedCity) &&

      (selectedCategory === "" ||
        vehicle.category === selectedCategory) &&

      (selectedType === "" ||
        vehicle.type === selectedType) &&

      (selectedTransmission === "" ||
        vehicle.transmission === selectedTransmission) &&

      (selectedFuel === "" ||
        vehicle.fuel === selectedFuel) &&

      (selectedYear === "" ||
        vehicle.year?.toString() === selectedYear)

    );
  });

  const searchSuggestions = vehicles.filter((vehicle) => {
    const query = searchTerm.toLowerCase();

    return (
      vehicle.name.toLowerCase().includes(query) ||
      vehicle.brand.toLowerCase().includes(query) ||
      vehicle.city.toLowerCase().includes(query) ||
      vehicle.licensePlate.toLowerCase().includes(query)
    );

  }).slice(0, 6);

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  useEffect(() => {
    setPage(1);

    setVisibleVehicles(
      filteredVehicles.slice(0, VEHICLES_PER_LOAD)
    );

  }, [
    selectedBrand,
    selectedCity,
    selectedCategory,
    selectedType,
    selectedTransmission,
    selectedFuel,
    selectedYear,
  ]);

  useEffect(() => {
    if (showDetails) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };

  }, [showDetails]);

  useEffect(() => {
    if (showEditModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };

  }, [showEditModal]);

  const [dashboardStats, setDashboardStats] = useState({
    activeRentals: 0,
    totalRevenue: 0,
    totalUsers: 0,
    fleetUtilization: 0,
    revenueTrend: [],
    recentBookings: [],
  });

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
    fetchNotifications();

  }, []);

  const stats = [
    {
      title: "Total Vehicles",
      value: dashboardStats.totalVehicles,
      icon: "directions_car",
      extra: "Vehicles In Fleet",
    },

    {
      title: "Revenue",
      value: `₹${dashboardStats.totalRevenue.toLocaleString("en-IN")}`,
      icon: "payments",
      extra: "Total Revenue Till Date",
    },

    {
      title: "Fleet Utilization",
      value: `${dashboardStats.fleetUtilization}%`,
      icon: "query_stats",
      extra: "Overall Fleet Usage",
    },

    {
      title: "Active Rentals",
      value: dashboardStats.activeRentals,
      icon: "car_rental",
      extra: "Currently Active",
    },
  ];

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
      window.removeEventListener("click", handleClickOutside);
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
      <main className="ml-[280px] flex-1 p-8 min-w-0">

        {/* TOPBAR */}
        <div className="flex items-center justify-between -mt-5 mb-6">

          {/* LEFT */}
          <div className="flex items-center gap-8">

            {/* DASHBOARD TITLE */}
            <h1 className="text-4xl font-black text-orange-500 tracking-tight">
                Fleet Inventory
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
                placeholder="Search vehicles..."
                className="w-full bg-white border border-orange-300 rounded-full py-3 pl-12 pr-4 outline-none focus:border-orange-400 shadow-sm"
              />

              {/* SUGGESTIONS */}
              {showSuggestions && searchTerm && (

                <div className="absolute top-[110%] left-0 w-full bg-white border border-orange-200 rounded-3xl shadow-2xl overflow-hidden z-50">

                  {searchSuggestions.length > 0 ? (

                    searchSuggestions.map((vehicle) => (

                      <button
                        key={vehicle._id}
                        onClick={() => {

                          setSearchTerm(vehicle.name);

                          setVisibleVehicles([vehicle]);

                          setShowSuggestions(false);

                        }}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-orange-50 transition-all border-b border-orange-100 last:border-none text-left"
                      >

                        <img
                          src={vehicle.image}
                          alt=""
                          className="w-14 h-12 rounded-xl object-cover"
                        />

                        <div>

                          <h3 className="font-bold text-gray-900">
                            {vehicle.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {vehicle.brand} • {vehicle.city}
                          </p>

                        </div>

                      </button>
                    ))

                  ) : (

                    <div className="px-5 py-4 text-gray-500">
                      No vehicles found
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

        {/* FILTERS */}
        <div className="bg-orange-100 rounded-3xl border border-orange-300 p-6 mb-8 w-full overflow-hidden shadow-sm">

          <div className="flex items-center justify-between -mb-5 -mt-3">

            {/* FILTER DROPDOWNS */}
            <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">

              {/* BRAND */}
              <div className="relative shrink-0">

                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="
                    appearance-none
                    bg-white
                    border
                    border-orange-100
                    hover:border-orange-200
                    hover:bg-orange-50
                    transition-all
                    duration-300
                    rounded-2xl
                    px-4
                    pr-10
                    py-2
                    text-[15px]
                    font-semibold
                    text-orange-600
                    outline-none
                    shadow-sm
                    min-w-[135px]
                    cursor-pointer
                  "
                >

                  <option value="">Brand</option>

                  <option value="Toyota">Toyota</option>
                  <option value="Tesla">Tesla</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="BMW">BMW</option>
                  <option value="Audi">Audi</option>
                  <option value="Mercedes">Mercedes</option>
                  <option value="Kia">Kia</option>
                  <option value="Honda">Honda</option>
                  <option value="Ford">Ford</option>
                  <option value="Tata">Tata</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Mahindra">Mahindra</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Jeep">Jeep</option>
                  <option value="Land Rover">Land Rover</option>
                  <option value="Volvo">Volvo</option>
                  <option value="Porsche">Porsche</option>
                  <option value="Lexus">Lexus</option>

                </select>

                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none text-[20px]">
                  keyboard_arrow_down
                </span>
              </div>

              {/* CITY */}
              <div className="relative shrink-0">

                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="
                    appearance-none
                    bg-white
                    border
                    border-orange-100
                    hover:border-orange-200
                    hover:bg-orange-50
                    transition-all
                    duration-300
                    rounded-2xl
                    px-4
                    pr-10
                    py-2
                    text-[15px]
                    font-semibold
                    text-orange-600
                    outline-none
                    shadow-sm
                    min-w-[120px]
                    cursor-pointer
                  "
                >

                  <option value="">City</option>

                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Kolkata">Kolkata</option>

                </select>

                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none text-[20px]">
                  keyboard_arrow_down
                </span>
              </div>

              {/* CATEGORY */}
              <div className="relative shrink-0">

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="
                    appearance-none
                    bg-white
                    border
                    border-orange-100
                    hover:border-orange-200
                    hover:bg-orange-50
                    transition-all
                    duration-300
                    rounded-2xl
                    px-4
                    pr-10
                    py-2
                    text-[15px]
                    font-semibold
                    text-orange-600
                    outline-none
                    shadow-sm
                    min-w-[140px]
                    cursor-pointer
                  "
                >

                  <option value="">Category</option>

                  <option value="2W">2 Wheeler</option>
                  <option value="4W">4 Wheeler</option>

                </select>

                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none text-[20px]">
                  keyboard_arrow_down
                </span>
              </div>

              {/* TYPE */}
              <div className="relative shrink-0">

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="
                    appearance-none
                    bg-white
                    border
                    border-orange-100
                    hover:border-orange-200
                    hover:bg-orange-50
                    transition-all
                    duration-300
                    rounded-2xl
                    px-4
                    pr-10
                    py-2
                    text-[15px]
                    font-semibold
                    text-orange-600
                    outline-none
                    shadow-sm
                    min-w-[120px]
                    cursor-pointer
                  "
                >

                  <option value="">Type</option>

                  <option value="Economy">Economy</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="Sport">Sport</option>
                  <option value="Business">Business</option>
                  <option value="Luxury">Luxury</option>

                </select>

                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none text-[20px]">
                  keyboard_arrow_down
                </span>
              </div>

              {/* TRANSMISSION */}
              <div className="relative shrink-0">

                <select
                  value={selectedTransmission}
                  onChange={(e) => setSelectedTransmission(e.target.value)}
                  className="
                    appearance-none
                    bg-white
                    border
                    border-orange-100
                    hover:border-orange-200
                    hover:bg-orange-50
                    transition-all
                    duration-300
                    rounded-2xl
                    px-4
                    pr-10
                    py-2
                    text-[15px]
                    font-semibold
                    text-orange-600
                    outline-none
                    shadow-sm
                    min-w-[150px]
                    cursor-pointer
                  "
                >

                  <option value="">Transmission</option>

                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>

                </select>

                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none text-[20px]">
                  keyboard_arrow_down
                </span>
              </div>

              {/* FUEL */}
              <div className="relative shrink-0">

                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="
                    appearance-none
                    bg-white
                    border
                    border-orange-100
                    hover:border-orange-200
                    hover:bg-orange-50
                    transition-all
                    duration-300
                    rounded-2xl
                    px-4
                    pr-10
                    py-2
                    text-[15px]
                    font-semibold
                    text-orange-600
                    outline-none
                    shadow-sm
                    min-w-[110px]
                    cursor-pointer
                  "
                >

                  <option value="">Fuel</option>

                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>

                </select>

                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none text-[20px]">
                  keyboard_arrow_down
                </span>
              </div>

              {/* YEAR */}
              <div className="relative shrink-0">

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="
                    appearance-none
                    bg-white
                    border
                    border-orange-100
                    hover:border-orange-200
                    hover:bg-orange-50
                    transition-all
                    duration-300
                    rounded-2xl
                    px-4
                    pr-10
                    py-2
                    text-[15px]
                    font-semibold
                    text-orange-600
                    outline-none
                    shadow-sm
                    min-w-[100px]
                    cursor-pointer
                  "
                >

                  <option value="">Year</option>

                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>

                </select>

                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none text-[20px]">
                  keyboard_arrow_down
                </span>
              </div>

              {/* RESET BUTTON */}
              <button
                onClick={() => {
                  setSelectedBrand("");
                  setSelectedCity("");
                  setSelectedCategory("");
                  setSelectedType("");
                  setSelectedTransmission("");
                  setSelectedFuel("");
                  setSelectedYear("");
                }}
                className="
                  w-10
                  h-10
                  rounded-3xl
                  bg-white
                  border
                  border-orange-100
                  hover:bg-red-500
                  hover:border-red-500
                  transition-all
                  duration-300
                  flex
                  items-center
                  justify-center
                  shrink-0
                  shadow-sm
                  group
                "
              >

                <span className="material-symbols-outlined text-red-400 group-hover:text-white text-[22px] transition-all">
                  close
                </span>

              </button>
            </div>
          </div>

          {/* TABLE */}
          <div
            ref={tableRef}
            className="w-full overflow-y-auto overflow-x-hidden max-h-[720px] rounded-2xl border border-orange-300"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#f97316 transparent",
            }}
          >

            <table className="w-full border-separate border-spacing-0">

              <thead className="bg-orange-300 text-gray-800 text-[15px] sticky top-0 z-20">

                <tr>
                  <th className="text-left p-5">Vehicle Details</th>
                  <th className="text-left p-5 whitespace-nowrap">License Plate</th>
                  <th className="text-left p-5">Category</th>
                  <th className="text-left p-5">Type</th>
                  <th className="text-left p-5">Transmission</th>
                  <th className="text-left p-5">Fuel</th>
                  <th className="text-left p-5">Price</th>
                  <th className="text-left p-5 w-[170px]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredVehicles
                  .slice(0, visibleVehicles.length)
                  .map((vehicle, index) => (

                  <tr
                    key={index}
                    className="border-t border-orange-100 hover:bg-orange-200 transition-all text-gray-800"
                  >

                    {/* VEHICLE DETAILS */}
                    <td className="p-5">

                      <div className="flex items-center gap-4">

                        <img
                          src={vehicle.image}
                          alt=""
                          className="w-[72px] h-[56px] rounded-xl object-cover shrink-0 border border-orange-100"
                        />

                        <div className="max-w-[120px]">

                          <h3 className="font-bold text-[16px] truncate text-gray-900">
                            {vehicle.name}
                          </h3>

                          <p className="text-gray-500 text-sm truncate">
                            {vehicle.city} • {vehicle.year}
                          </p>

                        </div>

                      </div>
                    </td>

                    {/* LICENSE PLATE */}
                    <td className="p-5 text-orange-600 font-semibold text-[14px]">
                      {vehicle.licensePlate}
                    </td>

                    {/* CATEGORY */}
                    <td className="p-5">

                      <span className="p-5 text-gray-800 font-medium text-[14px]">
                        {vehicle.category}
                      </span>
                    </td>

                    {/* TYPE */}
                    <td className="p-5 text-gray-800 font-medium text-[14px]">
                      {vehicle.type}
                    </td>

                    {/* TRANSMISSION */}
                    <td className="p-5 text-gray-800 font-medium text-[14px]">
                      {vehicle.transmission}
                    </td>

                    {/* FUEL */}
                    <td className="p-5 text-gray-800 font-medium text-[14px]">
                      {vehicle.fuel}
                    </td>

                    {/* PRICE */}
                    <td className="p-5 max-w-[120px]">

                      <div className="flex flex-col">

                        <span className="text-[18px] font-black text-gray-900">
                          ₹{vehicle.pricePerDay
                            ? vehicle.pricePerDay.toLocaleString("en-IN")
                            : "0"}
                        </span>

                        <span className="text-[12px] text-orange-500 font-medium">
                          per day
                        </span>

                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-5 min-w-[170px]">

                      <div className="flex items-center gap-3">

                        <button
                          onClick={async () => {

                            try {

                              const userInfo = JSON.parse(
                                localStorage.getItem("user")
                              );

                              const response = await fetch(
                                `${import.meta.env.VITE_API_URL}/api/vehicles/${vehicle._id}`,
                                {
                                  method: "DELETE",

                                  headers: {
                                    Authorization: `Bearer ${userInfo.token}`,
                                  },
                                }
                              );

                              const data = await response.json();

                              if (!response.ok) {
                                throw new Error(data.message);
                              }

                              // REMOVE FROM UI INSTANTLY
                              setVehicles((prevVehicles) =>
                                prevVehicles.filter(
                                  (v) => v._id !== vehicle._id
                                )
                              );

                            } catch (error) {

                              console.log(error);

                            }
                          }}
                          className="w-10 h-10 rounded-full bg-orange-400 hover:bg-red-500 transition-all duration-300 flex items-center justify-center group"
                        >

                          <span className="material-symbols-outlined text-[18px] text-black group-hover:text-white">
                            delete
                          </span>

                        </button>

                        <button
                          onClick={() => {

                            setSelectedCar(vehicle);

                            setEditVehicle({
                              category: vehicle.category || "",
                              type: vehicle.type || "",
                              transmission: vehicle.transmission || "",
                              fuel: vehicle.fuel || "",
                              year: vehicle.year || "",
                              color: vehicle.color || "",
                              mileage: vehicle.mileage || "",
                              pricePerDay: vehicle.pricePerDay || "",
                            });

                            setShowEditModal(true);
                          }}
                          className="w-10 h-10 rounded-full bg-orange-400 hover:bg-orange-500 transition-all flex items-center justify-center"
                        >

                          <span className="material-symbols-outlined text-[18px] text-black">
                            edit
                          </span>

                        </button>

                        <button 
                          onClick={() => {
                            setSelectedCar(vehicle);
                            setShowDetails(true);
                          }}
                          className="w-10 h-10 rounded-3xl bg-orange-400 border border-orange-100 hover:bg-orange-500 transition-all flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-[18px] text-black">
                            visibility
                          </span>
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
            {visibleVehicles.length < filteredVehicles.length && (
              <div className="py-4 text-center text-orange-400 text-sm">
                Loading more vehicles...
              </div>
            )}
          </div>

          {showDetails && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">

              {/* BACKDROP */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-md"
                onClick={() => setShowDetails(false)}
              />

              {/* MODAL */}
              <div className="relative bg-[#fff7f2] w-[540px] max-w-[92vw] max-h-[92vh] rounded-3xl border border-orange-200 shadow-2xl overflow-hidden scrollbar-hide">

                {/* IMAGE */}
                <div className="relative h-[180px]">

                  <img
                    src={selectedCar?.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* CLOSE */}
                  <button
                    onClick={() => setShowDetails(false)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-red-500 transition-all flex items-center justify-center group"
                  >

                    <span className="material-symbols-outlined text-red-500 group-hover:text-white text-[18px]">
                      close
                    </span>

                  </button>

                  {/* TITLE */}
                  <div className="absolute bottom-4 left-5">

                    <h2 className="text-4xl font-black text-white leading-none">
                      {selectedCar?.name}
                    </h2>

                    <p className="text-orange-200 text-lg font-semibold mt-2">
                      {selectedCar?.licensePlate}
                    </p>

                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4">

                  {/* GRID */}
                  <div className="grid grid-cols-3 gap-2">

                    {[
                      { label: "Brand", value: selectedCar?.brand },
                      { label: "Category", value: selectedCar?.category },
                      { label: "Type", value: selectedCar?.type },
                      { label: "Transmission", value: selectedCar?.transmission },

                      { label: "Fuel", value: selectedCar?.fuel },
                      { label: "Year", value: selectedCar?.year },
                      { label: "Body Type", value: selectedCar?.bodyType },
                      { label: "Color", value: selectedCar?.color },

                      { label: "Engine", value: selectedCar?.engineCapacity },
                      { label: "Drive Type", value: selectedCar?.driveType },
                      { label: "Horsepower", value: selectedCar?.horsepower },
                      { label: "Top Speed", value: `${selectedCar?.maxSpeed} km/h` },

                      { label: "0-100", value: `${selectedCar?.acceleration}s` },
                      { label: "Seats", value: selectedCar?.seats },
                      { label: "Doors", value: selectedCar?.doors },
                      { label: "Mileage", value: `${selectedCar?.mileage} km` },
                      { label: "License Plate", value: selectedCar?.licensePlate },
                      { label: "Rental Price", value: `${selectedCar?.pricePerDay}/day` },
                    ].map((item, index) => (

                      <div
                        key={index}
                        className="bg-white rounded-2xl px-4 py-1"
                      >

                        <p className="text-gray-500 text-[12px] mb-1">
                          {item.label}
                        </p>

                        <h3 className="text-[16px] font-black text-gray-900 leading-tight">
                          {item.value || "N/A"}
                        </h3>

                      </div>
                    ))}
                  </div> 
                </div>
              </div>
            </div>
          )}

          {/* EDIT MODAL */}
          {showEditModal && (

            <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">

              {/* BACKDROP */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-md"
              />

              {/* MODAL */}
              <div className="relative bg-[#fff7f2] w-[620px] max-w-[92vw] h-[640px] rounded-3xl border border-orange-200 shadow-2xl overflow-hidden">

                {/* HEADER */}
                <div className="px-6 py-4 border-b border-orange-100 flex items-center justify-between">

                  <div>

                    <h2 className="text-3xl font-black text-gray-900">
                      Edit Vehicle
                    </h2>

                    <p className="text-orange-500 font-medium">
                      Update Vehicle Details
                    </p>

                  </div>

                  {/* CLOSE */}
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-red-500 transition-all flex items-center justify-center group"
                  >

                    <span className="material-symbols-outlined text-red-500 group-hover:text-white text-[26px]">
                      close
                    </span>

                  </button>

                </div>

                {/* FORM */}
                <div className="p-6 space-y-5">

                  {/* VEHICLE INFO */}
                  <div className="grid grid-cols-2 gap-4 -mt-8">
                    {/* VEHICLE NAME */}
                    <div className="rounded-3xl p-5">

                      <p className="text-gray-500 text-sm mb-1">
                        Editing Vehicle
                      </p>

                      <h2 className="text-[24px] font-black text-gray-900 leading-tight">
                        {selectedCar?.name}
                      </h2>

                    </div>

                    {/* BRAND */}
                    <div className="rounded-3xl p-5 flex flex-col justify-center">

                      <p className="text-gray-500 text-sm mb-1">
                        Brand
                      </p>

                      <h2 className="text-[24px] font-black text-gray-900 leading-tight">
                        {selectedCar?.brand}
                      </h2>

                    </div>

                  </div>

                  {/* GRID */}
                  <div className="grid grid-cols-2 gap-4">

                    {/* CATEGORY */}
                    <div>

                      <label className="text-sm font-semibold text-gray-600 mb-2 block">
                        Category
                      </label>

                      <select
                        value={editVehicle.category}
                        onChange={(e) =>
                          setEditVehicle({
                            ...editVehicle,
                            category: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-orange-100 rounded-2xl px-4 py-3 outline-none focus:border-orange-400"
                      >

                        <option value="">
                          Select Category
                        </option>

                        <option value="2W">2 Wheeler</option>
                        <option value="4W">4 Wheeler</option>
                        
                      </select>

                    </div>

                    {/* TYPE */}
                    <div>

                      <label className="text-sm font-semibold text-gray-600 mb-2 block">
                        Type
                      </label>

                      <select
                        value={editVehicle.type}
                        onChange={(e) =>
                          setEditVehicle({
                            ...editVehicle,
                            type: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-orange-100 rounded-2xl px-4 py-3 outline-none focus:border-orange-400"
                      >

                        <option value="">
                          Select Type
                        </option>

                        <option value="Economy">Economy</option>
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                        <option value="Sport">Sport</option>
                        <option value="Business">Business</option>
                        <option value="Luxury">Luxury</option>

                      </select>

                    </div>

                    {/* TRANSMISSION */}
                    <div>

                      <label className="text-sm font-semibold text-gray-600 mb-2 block">
                        Transmission
                      </label>

                      <select
                        value={editVehicle.transmission}
                        onChange={(e) =>
                          setEditVehicle({
                            ...editVehicle,
                            transmission: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-orange-100 rounded-2xl px-4 py-3 outline-none focus:border-orange-400"
                      >

                        <option value="">
                          Select Transmission
                        </option>

                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>

                      </select>

                    </div>

                    {/* FUEL */}
                    <div>

                      <label className="text-sm font-semibold text-gray-600 mb-2 block">
                        Fuel
                      </label>

                      <select
                        value={editVehicle.fuel}
                        onChange={(e) =>
                          setEditVehicle({
                            ...editVehicle,
                            fuel: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-orange-100 rounded-2xl px-4 py-3 outline-none focus:border-orange-400"
                      >

                        <option value="">
                          Select Fuel
                        </option>

                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>

                      </select>

                    </div>

                    {/* YEAR */}
                    <div>

                      <label className="text-sm font-semibold text-gray-600 mb-2 block">
                        Year
                      </label>

                      <select
                        value={editVehicle.year}
                        onChange={(e) =>
                          setEditVehicle({
                            ...editVehicle,
                            year: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-orange-100 rounded-2xl px-4 py-3 outline-none focus:border-orange-400"
                      >

                        <option value="">
                          Select Year
                        </option>

                        {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}

                      </select>

                    </div>

                    {/* COLOR */}
                    <div>

                      <label className="text-sm font-semibold text-gray-600 mb-2 block">
                        Color
                      </label>

                      <select
                        value={editVehicle.color}
                        onChange={(e) =>
                          setEditVehicle({
                            ...editVehicle,
                            color: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-orange-100 rounded-2xl px-4 py-3 outline-none focus:border-orange-400"
                      >

                        <option value="">
                          Select Color
                        </option>

                        <option value="Blue">Blue</option>
                        <option value="Brown">Brown</option>
                        <option value="Green">Green</option>
                        <option value="Gray">Gray</option>
                        <option value="Navy">Navy</option>
                        <option value="Beige">Beige</option>
                        <option value="Black">Black</option>
                        <option value="White">White</option>
                        <option value="Purple">Purple</option>
                        <option value="Silver">Silver</option>
                        <option value="Teal">Teal</option>
                        <option value="Gold">Gold</option>
                        <option value="Red">Red</option>
                        <option value="Cyan">Cyan</option>
                        <option value="Orange">Orange</option>
                        <option value="Pink">Pink</option>
                        <option value="Maroon">Maroon</option>
                        <option value="Olive">Olive</option>

                      </select>

                    </div>

                    {/* MILEAGE */}
                    <div>

                      <label className="text-sm font-semibold text-gray-600 mb-2 block">
                        Mileage
                      </label>

                      <div className="relative">

                        <input
                          type="number"
                          value={editVehicle.mileage}
                          onChange={(e) =>
                            setEditVehicle({
                              ...editVehicle,
                              mileage: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-orange-100 rounded-2xl px-4 pr-14 py-3 outline-none focus:border-orange-400"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                          km
                        </span>

                      </div>

                    </div>

                    {/* RENTAL PRICE */}
                    <div>

                      <label className="text-sm font-semibold text-gray-600 mb-2 block">
                        Rental Price
                      </label>

                      <div className="relative">

                        <input
                          type="number"
                          value={editVehicle.pricePerDay}
                          onChange={(e) =>
                            setEditVehicle({
                              ...editVehicle,
                              pricePerDay: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-orange-100 rounded-2xl px-4 pr-16 py-3 outline-none focus:border-orange-400"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                          /day
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* SAVE BUTTON */}
                  <button
                    onClick={async () => {

                      try {

                        const userInfo = JSON.parse(
                          localStorage.getItem("user")
                        );

                        const response = await fetch(
                          `${import.meta.env.VITE_API_URL}/api/vehicles/${selectedCar._id}`,
                          {
                            method: "PUT",

                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${userInfo.token}`,
                            },

                            body: JSON.stringify(editVehicle),
                          }
                        );

                        const updatedVehicle = await response.json();

                        if (!response.ok) {
                          throw new Error(updatedVehicle.message);
                        }

                        /* UPDATE UI INSTANTLY */
                        setVehicles((prevVehicles) =>
                          prevVehicles.map((vehicle) =>
                            vehicle._id === updatedVehicle._id
                              ? updatedVehicle
                              : vehicle
                          )
                        );

                        /* UPDATE SELECTED CAR */
                        setSelectedCar(updatedVehicle);

                        /* CLOSE MODAL */
                        setShowEditModal(false);

                      } catch (error) {

                        console.log(error);

                      }
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 transition-all text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/20"
                  >
                    Save Changes
                  </button>

                </div>
              </div>
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-6 -mt-3 -mb-3">

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

export default Fleet;