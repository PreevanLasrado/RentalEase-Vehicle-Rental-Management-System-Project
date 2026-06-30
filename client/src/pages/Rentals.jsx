import { useState, useEffect } from "react";
import { Search, Heart, Calendar, Car, MapPin, Star, Users, Settings, Fuel, Gauge } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import cities from "../data/indianCities.json";
import L from "leaflet";
import SearchBar from "../components/SearchBar";
// import cars from "../data/carsData";
import { FiChevronLeft, FiChevronRight, FiAlertTriangle } from "react-icons/fi";
import CarDetailsModal from "../components/CarDetailsModal";
import BookingModal from "../components/BookingModal";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

const brands = ["Toyota","Tesla","Hyundai","BMW","Audi","Mercedes","Kia","Honda","Ford","Volkswagen","Mahindra","Nissan","Chevrolet","Jeep","Land Rover","Volvo","Tata","Porsche","Lexus"];
const fuelTypes = ["Petrol", "Diesel", "Electric"];
const carTypes = ["Economy", "Standard", "Premium", "Sport", "Business", "Luxury"];
const seating = [2, 4, 5, 6, 7];

const colors = [
  "blue","brown","green","gray","navy","beige","black","white",
  "purple","silver","teal","gold","red","cyan",
  "orange","pink","maroon","olive"
];

const cityCoords = {
  Bangalore: [12.9716, 77.5946],
  Mumbai: [19.0560, 72.8677],
  Delhi: [28.6139, 77.2090],
  Chennai: [13.0827, 80.2707],
  Hyderabad: [17.3600, 78.4767],
  Pune: [18.5204, 73.8567],
  Kolkata: [22.5726, 88.3639],
};

function FlyToCity({ selectedCity }) {
  const map = useMap();

  useEffect(() => {
    // 🇮🇳 Reset to India
    if (!selectedCity) {
      map.flyTo([20.5937, 78.9629], 5, {
        duration: 1.5,
      });
      return;
    }

    // ✅ SAFE CHECK
    const coords = cityCoords[selectedCity];

    if (!coords) return;   // 🔥 THIS LINE FIXES YOUR CRASH

    map.flyTo(coords, 13, {
      duration: 1.5,
    });

  }, [selectedCity, map]);

  return null;
}

// custom icon
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
});

function CityMarker({ selectedCity, cars }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (selectedCity) {
      setAnimate(false);
      setTimeout(() => setAnimate(true), 50);
    }
  }, [selectedCity]);

  // ✅ AFTER hooks, not before
  if (!selectedCity) return null;

  const coords = cityCoords[selectedCity];

  const carCount = cars.filter(
    (car) => car.city === selectedCity
  ).length;

  return (
    <Marker
      position={coords}
      icon={markerIcon}
      className={animate ? "marker-drop" : ""}
    >
      <Popup>
        <div className="flex flex-col gap-1 text-sm">

          {/* City */}
          <div className="flex items-center gap-2 font-semibold text-black">
            <MapPin size={16} className="text-black" />
            {selectedCity}
          </div>

          {/* Cars Count */}
          <div className="flex items-center gap-2 text-black font-semibold">
            <Car size={16} className="text-black" />
            {carCount} Available
          </div>

        </div>
      </Popup>
    </Marker>
  );
}

function MapView({ selectedCity, cars }) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      className="h-64 rounded-2xl z-10"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <FlyToCity selectedCity={selectedCity} />

      {/* 🔥 NEW FEATURE */}
      <CityMarker selectedCity={selectedCity} cars={cars} />

    </MapContainer>
  );
}

export default function Rentals() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSearchBar, setShowSearchBar] = useState(false);

  const [price, setPrice] = useState(500000);
  const [sort, setSort] = useState("low");

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCity, setSelectedCity] = useState(
    location.state?.city || ""
  );
  const [tempCity, setTempCity] = useState("");
  const [open, setOpen] = useState(false);

  const transmissionTypes = ["Automatic", "Manual"];
  const [mileageRange, setMileageRange] = useState([0, 25]);

  const [selectedTransmission, setSelectedTransmission] = useState([]);
  const [selectedMileage, setSelectedMileage] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 12;

  const [yearRange, setYearRange] = useState([2018, 2026]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [carDates, setCarDates] = useState({});

  const [bookingCar, setBookingCar] = useState(null);

  const [pickupDate, setPickupDate] = useState(null);
  const [dropDate, setDropDate] = useState(null);
  const [pickupTime, setPickupTime] = useState(null);
  const [dropTime, setDropTime] = useState(null);

  const [availabilityMap, setAvailabilityMap] = useState({});
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [cars, setCars] = useState([]);

  const [searchInput, setSearchInput] = useState("");   // typing
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const [showLoginError, setShowLoginError] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);

  const [oldCancelledBookingId, setOldCancelledBookingId] = useState(null);

  const handleBookNow = (car) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      // 🔥 mark that login is coming from booking
      localStorage.setItem("loginFromBooking", "true");

      localStorage.setItem(
        "pendingBooking",
        JSON.stringify({ carId: car._id })
      );

      navigate("/login");
      return;
    }

    setBookingCar(car);
  };

  const handleSearch = (data) => {
    setSelectedCity(data.city);
    setPickupDate(data.pickupDate);
    setDropDate(data.dropDate);
    setPickupTime(data.pickupTime);
    setDropTime(data.dropTime);

    // setAppliedFilters({
    //   city: data.city,
    //   price,
    //   selectedBrands,
    //   selectedFuel,
    //   selectedType,
    //   selectedSeats,
    //   selectedColors,
    //   selectedTransmission,
    //   mileageRange,
    //   yearRange,
    //   availability,
    // });
  };

  const toggleColor = (c) => {
    if (selectedColors.includes(c)) {
      setSelectedColors(selectedColors.filter(x => x !== c));
    } else {
      setSelectedColors([...selectedColors, c]);
    }
  };

  const [availability, setAvailability] = useState({
    available: true,
    booked: false,
  });

  // Toggle Function
  const toggleSelect = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter((v) => v !== value));
    } else {
      setState([...state, value]);
    }
  };

  const [resetKey, setResetKey] = useState(0);

  // Clear All
  const clearAll = () => {
    setSelectedBrands([]);
    setSelectedFuel([]);
    setSelectedType([]);
    setSelectedSeats([]);
    setSelectedCategory([]);
    setSelectedColors([]);
    setSelectedTransmission([]);

    setPrice(100000);
    setMileageRange([0, 25]);
    setYearRange([2018, 2026]);

    setAvailability({
      available: true,
      booked: false,
    });

    setSelectedCity("");       // ✅ reset city
    setSort("low");            // ✅ reset sorting
    setCurrentPage(1);         // ✅ go back to page 1

    setResetKey(prev => prev + 1); 
  };

  // // Filter Logic
  // const filteredCars = cars.filter((car) => {
  //   if (!appliedFilters) return true;

  //   const isAvailable =
  //     availabilityMap[String(car._id)] === undefined
  //       ? true
  //       : availabilityMap[String(car._id)]

  //   // ONLY AVAILABLE
  //   if (appliedFilters.availability.available && !appliedFilters.availability.booked) {
  //     if (!isAvailable) return false;
  //   }

  //   // ONLY BOOKED
  //   if (!appliedFilters.availability.available && appliedFilters.availability.booked) {
  //     if (isAvailable) return false;
  //   }

  //   return (
  //     (!appliedFilters.city ||
  //       car.city?.toLowerCase() === appliedFilters.city.toLowerCase()) &&

  //     car.pricePerDay <= appliedFilters.price &&
  //     (appliedFilters.selectedBrands.length
  //       ? appliedFilters.selectedBrands.includes(car.brand)
  //       : true) &&
  //     (appliedFilters.selectedFuel.length
  //       ? appliedFilters.selectedFuel.includes(car.fuel)
  //       : true) &&
  //     (appliedFilters.selectedType.length
  //       ? appliedFilters.selectedType.includes(car.type)
  //       : true) &&
  //     (appliedFilters.selectedSeats.length
  //       ? appliedFilters.selectedSeats.includes(car.seats)
  //       : true) &&
  //     (appliedFilters.selectedColors.length
  //       ? appliedFilters.selectedColors.includes(car.color)
  //       : true) &&
  //     (appliedFilters.selectedTransmission.length
  //       ? appliedFilters.selectedTransmission.includes(car.transmission)
  //       : true) &&

  //     car.mileage >= appliedFilters.mileageRange[0] &&
  //     car.mileage <= appliedFilters.mileageRange[1] &&
  //     car.year >= appliedFilters.yearRange[0] &&
  //     car.year <= appliedFilters.yearRange[1]
  //   );
  // })
  // .sort((a, b) =>
  //   sort === "low"
  //     ? a.pricePerDay - b.pricePerDay
  //     : b.pricePerDay - a.pricePerDay
  // );

  const filteredCars = useMemo(() => {
    return (Array.isArray(cars) ? cars : [])
      .filter((car) => {
        // 🔹 Availability
        const isAvailable =
          availabilityMap[String(car._id)] === undefined
            ? true
            : availabilityMap[String(car._id)];

        if (availability.available && !availability.booked && !isAvailable) return false;
        if (!availability.available && availability.booked && isAvailable) return false;

        // 🔹 City
        if (selectedCity && car.city?.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }

        // 🔹 Price
        if (car.pricePerDay > price) return false;

        // 🔹 Brand
        if (selectedBrands.length && !selectedBrands.includes(car.brand)) return false;

        // 🔹 Fuel
        if (selectedFuel.length && !selectedFuel.includes(car.fuel)) return false;

        // 🔹 Type
        if (selectedType.length && !selectedType.includes(car.type)) return false;

        // 🔹 Category
        if (selectedCategory.length && !selectedCategory.includes(car.category)) return false;

        // 🔹 Seats
        if (selectedSeats.length && !selectedSeats.includes(car.seats)) return false;

        // 🔹 Color
        if (selectedColors.length && !selectedColors.includes(car.color)) return false;

        // 🔹 Transmission
        if (
          selectedTransmission.length &&
          !selectedTransmission.includes(car.transmission)
        )
          return false;

        // 🔹 Mileage
        if (
          car.mileage < mileageRange[0] ||
          car.mileage > mileageRange[1]
        )
          return false;

        // 🔹 Year
        if (
          car.year < yearRange[0] ||
          car.year > yearRange[1]
        )
          return false;

        // 🔹 Search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();

          const match =
            car.name.toLowerCase().includes(query) ||
            car.brand.toLowerCase().includes(query) ||
            car.type.toLowerCase().includes(query) ||
            car.transmission.toLowerCase().includes(query);

          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) =>
        sort === "low"
          ? a.pricePerDay - b.pricePerDay
          : b.pricePerDay - a.pricePerDay
      );
  }, [
    cars,
    availabilityMap,
    availability,
    selectedCity,
    price,
    selectedBrands,
    selectedFuel,
    selectedType,
    selectedCategory,
    selectedSeats,
    selectedColors,
    selectedTransmission,
    mileageRange,
    yearRange,
    searchQuery,
    sort
  ]);

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredCars]);

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [price, selectedBrands, selectedFuel, selectedType, selectedSeats, selectedColors, selectedTransmission, mileageRange, availability]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredCars.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  useEffect(() => {
    const pending = JSON.parse(localStorage.getItem("pendingBooking"));

    if (pending) {
      const car = cars.find(c => c._id === pending.carId);

      if (car) {
        setBookingCar(car); // 🔥 opens modal
      }

      localStorage.removeItem("pendingBooking");
    }
  }, [cars]);

  useEffect(() => {
    if (
      location.state?.openBooking &&
      location.state?.vehicleId &&
      cars.length > 0
    ) {
      const vehicle = cars.find(
        (v) => v._id === location.state.vehicleId
      );

      if (vehicle) {
        setBookingCar(vehicle);
        // 🔥 clear state after opening
        navigate(location.pathname, {
          replace: true,
          state: {},
        });
      }
    }

  }, [location.state, cars]);

  // useEffect(() => {
  //   const fetchCars = async () => {
  //     try {
  //       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vehicles`);
  //       const data = await res.json();

  //       setCars(data);
  //     } catch (err) {
  //       console.error("Error fetching vehicles", err);
  //     }
  //   };

  //   fetchCars();
  // }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/vehicles`
        );

        if (!res.ok) {
          console.error("Vehicle API Error:", res.status);
          setCars([]);
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setCars(data);
        } else {
          console.error("Invalid vehicles response:", data);
          setCars([]);
        }
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setCars([]);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    if (!pickupDate || !dropDate || !pickupTime || !dropTime) return;

    const fetchAvailability = async () => {
      try {
        const start = new Date(pickupDate);
        const end = new Date(dropDate);

        // set correct time
        const convertTo24Hour = (time) => {
          if (!time) return { hours: 0, minutes: 0 };

          const [timePart, modifier] = time.split(" ");

          let [hours, minutes] = timePart.split(":");

          hours = parseInt(hours);

          if (modifier === "PM" && hours !== 12) {
            hours += 12;
          }

          if (modifier === "AM" && hours === 12) {
            hours = 0;
          }

          return {
            hours,
            minutes: parseInt(minutes),
          };
        };

        const pickup = convertTo24Hour(pickupTime);
        start.setHours(pickup.hours, pickup.minutes);

        const drop = convertTo24Hour(dropTime);
        end.setHours(drop.hours, drop.minutes);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bookings/availability?startDate=${start.toISOString()}&endDate=${end.toISOString()}`
        );

        const data = await res.json();

        setAvailabilityMap(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAvailability();
  }, [pickupDate, dropDate, pickupTime, dropTime]);

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [
  //   selectedCity,
  //   price,
  //   selectedBrands,
  //   selectedFuel,
  //   selectedType,
  //   selectedSeats,
  //   selectedColors,
  //   selectedTransmission,
  //   mileageRange,
  //   availability,
  // ]);

  useEffect(() => {
    const delay = setTimeout(() => {
      // filtering happens automatically
    }, 200);

    return () => clearTimeout(delay);
  }, [searchQuery, searchInput]);

  const applySearch = () => {
    setSearchQuery(searchInput);   // 🔥 apply here
    setSearchSuggestions([]);
    setCurrentPage(1);
  };

  // 🔁 FETCH WISHLIST (on load)
  useEffect(() => {
    const fetchWishlist = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      // 🔴 if no user → reset UI
      if (!user?.token) {
        setWishlistIds([]);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        setWishlistIds(data.data.map(item => item.vehicleId._id));
      } catch (err) {
        console.error(err);
        setWishlistIds([]);
      }
    };

    // 🔥 run immediately
    fetchWishlist();

    // 🔥 run on login/logout/wishlist change
    window.addEventListener("wishlistUpdated", fetchWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", fetchWishlist);
    };
  }, []);

  const toggleWishlist = async (car) => {
    const user = JSON.parse(localStorage.getItem("user"));

    // 🚫 prevent spam
    if (showLoginError) return;

    // ❌ not logged in
    if (!user?.token) {
      setShowLoginError(true);

      setTimeout(() => {
        setShowLoginError(false);
      }, 3000);

      return;
    }

    try {
      const isWishlisted = wishlistIds.includes(car._id);

      // ⚡ optimistic UI
      if (isWishlisted) {
        setWishlistIds(prev => prev.filter(id => id !== car._id));
      } else {
        setWishlistIds(prev => [...prev, car._id]);
      }

      // 🔗 backend call
      await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ vehicleId: car._id }),
      });

      // 🔄 update navbar
      window.dispatchEvent(new Event("wishlistUpdated"));

    } catch (err) {
      console.error(err);

      // rollback
      setWishlistIds(prev => prev.filter(id => id !== car._id));
    }
  };

  useEffect(() => {
    // CANCELLED BOOKING REBOOK
    if (location.state?.rebook && cars.length > 0) {

      const {
        oldBookingId,
        vehicleId,
        startDate,
        endDate,
        pickupTime,
        dropTime,
      } = location.state;

      const vehicle = cars.find(
        (v) => v._id === vehicleId
      );

      if (vehicle) {

        setOldCancelledBookingId(oldBookingId);

        setBookingCar({
          ...vehicle,

          prefilledDates: {
            pickupDate: startDate,
            dropDate: endDate,

            pickupTime,
            dropTime,
          },
        });
      }
    }

    // COMPLETED BOOKING REBOOK
    if (location.state?.completedRebook && cars.length > 0) {

      const { vehicleId } = location.state;

      const vehicle = cars.find(
        (v) => v._id === vehicleId
      );

      if (vehicle) {

        // OPEN EMPTY BOOKING MODAL
        setBookingCar(vehicle);
      }
    }

  }, [location.state, cars]);

  return (
    <div className="bg-white -mt-6">

      {/* Top */}
      <div className="bg-white p-2 shadow relative top-3 z-40 overflow-visible">
        <div className="w-full pl-7 pr-11 pt-1">

          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 gap-3 relative overflow-visible">

            {/* 🔍 Search */}
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search cars..."
              value={searchInput}
              onChange={(e) => {
                const value = e.target.value;
                setSearchInput(value);

                if (!value.trim()) {
                  setSearchSuggestions([]);
                  return;
                }

                const suggestions = cars
                  .filter((car) =>
                    car.name.toLowerCase().includes(value.toLowerCase())
                  )
                  .map((car) => car.name)
                  .slice(0, 6);

                setSearchSuggestions(suggestions);
              }}
              className="w-full outline-none bg-gray-100"

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applySearch();
                }
              }}
            />

            {searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-3xl z-40 border-t border-gray-200 overflow-hidden">

                {searchSuggestions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSearchInput(item);
                      setSearchQuery(item);
                      setSearchSuggestions([]);
                    }}
                    className="px-6 py-4 text-black hover:bg-gray-100 cursor-pointer text-[15px]"
                  >
                    {item}
                  </div>
                ))}

              </div>
            )}

            {searchInput && (
              <button onClick={() => {
                setSearchInput("");
                setSearchQuery("");
              }}>
                ✕
              </button>
            )}

            {/* 🏙️ City Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="bg-white rounded-lg px-4 py-2 border text-sm flex items-center justify-between min-w-[140px]"
              >
                {selectedCity || "Select City"}
              </button>

              {open && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl rounded-xl border z-40 max-h-60 overflow-y-auto">

                  <div
                    onClick={() => {
                      setSelectedCity(""); // reset
                      setOpen(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer border-b">
                    Select City
                  </div>

                  {cities.map((city) => (
                    <div
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setOpen(false);
                      }}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 📅 Calendar Icon */}
            <button
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border hover:bg-gray-50 transition"
            >
              <Calendar size={22} />
            </button>
          </div>

          <div
            className={`transition-all duration-500 ${
              showSearchBar ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}
          >
            <SearchBar selectedCity={selectedCity} 
              setSelectedCity={setSelectedCity}
              onSearch={handleSearch} />
          </div>

        </div>
      </div>

      <div className="w-full pl-6 pr-14 pt-6 pb-0 flex gap-6 relative">
        {/* FILTERS */}
        <div key={resetKey} className="w-80 bg-white p-5 rounded-2xl shadow-sm space-y-6 relative z-30">

          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-[24px]">Filters</h2>
            <button onClick={clearAll} className="text-orange-500 text-[16px] hover:underline whitespace-nowrap">
              Clear All
            </button>
          </div>

          {/* Availability */}
          <div>
            <h3 className="font-bold mb-2 text-[18px]">Availability</h3>

            <label className="flex items-center gap-2 text-[16px] accent-orange-500">
              <input
                type="checkbox"
                checked={availability.available}
                onChange={() =>
                  setAvailability({
                    ...availability,
                    available: !availability.available,
                  })
                }
              />
              Available
            </label>

            <label className="flex items-center gap-2 text-[16px] accent-orange-500">
              <input
                type="checkbox"
                checked={availability.booked}
                onChange={() =>
                  setAvailability({
                    ...availability,
                    booked: !availability.booked,
                  })
                }
              />
              Already Booked
            </label>
          </div>

          {/* Price */}
          <div>
            <h3 className="font-bold mb-2 text-[18px]">Budget</h3>
            <input
              type="range"
              min="1000"
              max="500000"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <p className="text-[16px] mt-2">Up to ₹{price}</p>
          </div>

          {/* Brand */}
          <div>
            <h3 className="font-bold mb-2 text-[18px]">Brand</h3>
            <div className="flex flex-wrap gap-2">
              {brands.map(b => (
                <button
                  key={b}
                  onClick={() => toggleSelect(b, selectedBrands, setSelectedBrands)}
                  className={`px-3 py-1 rounded-full border text-[14px] ${
                    selectedBrands.includes(b)
                      ? "border-red-500 text-red-500"
                      : "border-gray-300"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <div>
              <h3 className="font-bold mb-3 text-[18px]">Color</h3>

              <div className="grid grid-cols-6 gap-3">
                {colors.map((c) => (
                  <div
                    key={c}
                    className="relative flex items-center justify-center group cursor-pointer"
                    onClick={() => toggleColor(c)}
                  >
                    {/* 🎨 Circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110
                      ${
                        selectedColors.includes(c)
                          ? "border-2 border-red-500"
                          : "border border-gray-300"
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: c }}
                      />
                    </div>

                    {/* 💬 Custom Tooltip */}
                    <div className="absolute bottom-10 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-150 pointer-events-none">
                      <div className="bg-white text-[14px] px-3 py-1 rounded-full shadow-md border whitespace-nowrap">
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <h3 className="font-bold mb-2 text-[18px]">Category</h3>

            <div className="flex flex-wrap gap-2">
              {["2W", "4W"].map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    toggleSelect(
                      cat,
                      selectedCategory,
                      setSelectedCategory
                    )
                  }
                  className={`px-3 py-1 rounded border text-[14px] transition-all
                  ${
                    selectedCategory.includes(cat)
                      ? "border-red-500 text-red-500"
                      : "border-gray-300"
                  }`}
                >
                  {cat === "2W" ? "2 Wheeler" : "4 Wheeler"}
                </button>
              ))}
            </div>
          </div>

          {/* Seating */}
          <div>
            <h3 className="font-bold mb-2 text-[18px]">Seating</h3>
            <div className="flex flex-wrap gap-2">
              {seating.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSelect(s, selectedSeats, setSelectedSeats)}
                  className={`px-2 py-1 rounded border text-[14px] ${
                    selectedSeats.includes(s)
                      ? "border-red-500 text-red-500"
                      : ""
                  }`}
                >
                  {s} Seater
                </button>
              ))}
            </div>
          </div>

          {/* {Transmission} */}
          <div>
            <h3 className="font-bold mb-2 text-[18px]">Transmission</h3>
            <div className="flex flex-wrap gap-2">
              {transmissionTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleSelect(t, selectedTransmission, setSelectedTransmission)}
                  className={`px-3 py-1 rounded border text-[14px] ${
                    selectedTransmission.includes(t)
                      ? "border-red-500 text-red-500"
                      : "border-gray-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* {Mileage} */}
          <div>
            <h3 className="font-bold mb-2 text-[18px]">Mileage/Range</h3>

            {/* Min Slider */}
            <div className="flex flex-col gap-2">
              <input
                type="range"
                min="0"
                max="30"
                value={mileageRange[0]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value <= mileageRange[1]) {
                    setMileageRange([value, mileageRange[1]]);
                  }
                }}
                className="w-full accent-orange-500"
              />

              {/* Max Slider */}
              <input
                type="range"
                min="0"
                max="30"
                value={mileageRange[1]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= mileageRange[0]) {
                    setMileageRange([mileageRange[0], value]);
                  }
                }}
                className="w-full accent-orange-500"
              />
            </div>

            {/* Display */}
            <div className="text-[16px] mt-2 text-black">
              {mileageRange[0]} km/rental — {mileageRange[1]} km/rental
            </div>
          </div>

          {/* Fuel */}
          <div>
            <h3 className="font-bold mb-2 text-[18px]">Fuel</h3>
            <div className="flex flex-wrap gap-2">
              {fuelTypes.map(f => (
                <button
                  key={f}
                  onClick={() => toggleSelect(f, selectedFuel, setSelectedFuel)}
                  className={`px-3 py-1 rounded border text-[14px] ${
                    selectedFuel.includes(f)
                      ? "border-red-500 text-red-500"
                      : ""
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <h3 className="font-bold mb-2 text-[18px]">Class</h3>
            <div className="flex flex-wrap gap-2">
              {carTypes.map(t => (
                <button
                  key={t}
                  onClick={() => toggleSelect(t, selectedType, setSelectedType)}
                  className={`px-3 py-1 rounded border text-[14px] ${
                    selectedType.includes(t)
                      ? "border-red-500 text-red-500"
                      : ""
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Model Year */}
          <div>
            <h3 className="font-bold mb-2 text-[18px]">Model Year</h3>

            <div className="flex flex-col gap-2">

              {/* Min Year */}
              <input
                type="range"
                min="2018"
                max="2026"
                value={yearRange[0]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value <= yearRange[1]) {
                    setYearRange([value, yearRange[1]]);
                  }
                }}
                className="w-full accent-orange-500"
              />

              {/* Max Year */}
              <input
                type="range"
                min="2018"
                max="2026"
                value={yearRange[1]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= yearRange[0]) {
                    setYearRange([yearRange[0], value]);
                  }
                }}
                className="w-full accent-orange-500"
              />

            </div>

            {/* Display */}
            <div className="text-[16px] mt-2 text-black">
              {yearRange[0]} — {yearRange[1]}
            </div>
          </div>

        </div>

        {/* CONTENT */}
        <div className="flex-1 min-h-screen flex flex-col relative z-20">

          <MapView selectedCity={selectedCity} cars={cars} />

          {/* Sort */}
          <div className="flex justify-between mt-4 mb-4">
            <h2 className="text-xl font-semibold">Cars</h2>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border px-3 py-2 rounded-lg font-semibold"
            >
              <option value="low">Price Low → High</option>
              <option value="high">Price High → Low</option>
            </select>
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-4 items-start">
              {currentCars.map((car) => {
                const isAvailable =
                  availabilityMap[String(car._id)] === undefined
                    ? true
                    : availabilityMap[String(car._id)];
                
                // const isWishlisted = wishlist.some(item => item._id === car._id);
                const isWishlisted = wishlistIds.includes(car._id);
    
                return (
                  <div
                    key={car._id}
                    className="relative bg-white rounded-2xl overflow-hidden group self-start transition-all duration-300 ease-out
                    hover:-translate-y-4 hover:scale-[1.02]
                    shadow-md hover:shadow-[0_25px_50px_rgba(0,0,0,0.15),0_10px_20px_rgba(0,0,0,0.08)]"
                  >

                    {/* IMAGE */}
                    <div className="relative">
                      <img
                        src={car.image}
                        alt={car.name}
                        className={`w-full h-52 object-cover ${
                          !isAvailable ? "opacity-70" : ""
                        }`}
                      />

                      {/* ❤️ Wishlist */}
                      <button
                        onClick={() => toggleWishlist(car)}
                        disabled={showLoginError}
                        className={`absolute top-3 right-3 rounded-full p-2 shadow z-20 transition-all duration-300 
                          ${isWishlisted ? "bg-red-500 scale-110" : "bg-white hover:scale-110"}
                          ${showLoginError ? "cursor-not-allowed opacity-70" : ""}
                        `}
                      >
                        <Heart
                          size={16}
                          className={`transition-all duration-300 
                            ${isWishlisted ? "text-white fill-white" : "text-gray-700"}
                          `}
                        />
                      </button>

                      {/* 🔥 FULL OVERLAY (LIKE YOUR DESIGN) */}
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white z-10">
                          <p className="text-xl font-bold">ALREADY BOOKED</p>
                          <p className="text-sm opacity-80">
                            Not available for selected time
                          </p>
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="p-4 pb-2">
                      <h3 className="font-semibold text-lg">{car.name}</h3>

                      <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-black">
                        <p className="flex items-center gap-2">
                          <Users size={16} />
                          {car.seats} Seats
                        </p>

                        <p className="flex items-center gap-2">
                          <Settings size={16} />
                          {car.transmission}
                        </p>

                        <p className="flex items-center gap-2">
                          <Fuel size={16} />
                          {car.fuel}
                        </p>

                        <p className="flex items-center gap-2">
                          <Calendar size={16} />
                          {car.year}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-gray-500 font-semibold">
                          <Gauge size={16} />
                          {car.mileage} km/rental
                        </div>

                        <div className="text-gray-500 font-semibold text-lg whitespace-nowrap">
                          ₹{car.pricePerDay}/day
                        </div>
                      </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="px-4 pb-3 -mt-3 max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-300">
                      <div className="flex gap-3 mt-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">

                        <button
                          className="flex-1 border border-orange-500 text-orange-500 rounded-full py-2 text-sm font-medium hover:bg-orange-500 hover:text-white transition-all"
                          onClick={() => {
                            setSelectedCar({
                              ...car,
                              prefilledDates: {
                                pickupDate,
                                dropDate,
                                pickupTime,
                                dropTime,
                              },
                              isUnavailable: !isAvailable,
                            });
                          }}
                        >
                          View Details
                        </button>

                        <button
                          onClick={() =>
                            handleBookNow({
                              ...car,

                              prefilledDates: {
                                pickupDate,
                                dropDate,
                                pickupTime,
                                dropTime,
                              },
                            })
                          }
                          disabled={!isAvailable}
                          className={`flex-1 rounded-full py-2 text-sm transition-all ${
                            isAvailable
                              ? "bg-orange-500 hover:bg-orange-600 text-white"
                              : "bg-gray-400 cursor-not-allowed text-white"
                          }`}
                        >
                          {isAvailable ? "Book Now" : "Unavailable"}
                        </button>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div> 
        </div>
      </div>

      {showLoginError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] pointer-events-none">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg 
               text-[15] font-medium flex items-center gap-2 animate-slideDown">

            <FiAlertTriangle size={19} />

            <span>Login to mark the vehicle as favourite</span>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center -mt-10 gap-6 pb-6 mr-57 ml-80 relative z-[999]">
          {/* Prev Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-2 border rounded-full hover:bg-orange-500 transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-md disabled:opacity-40"
            disabled={currentPage === 1}
          >
            <FiChevronLeft size={20} />
          </button>

          {/* Page Info */}
          <div className="text-[16px] font-semibold text-black">
            Page {currentPage} of {totalPages || 1}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-2 border rounded-full hover:bg-orange-500 transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-md disabled:opacity-40"
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <FiChevronRight size={20} />
          </button>
        </div>

        {selectedCar && (
          <CarDetailsModal  
            key={selectedCar.id}
            car={selectedCar}  
            onClose={() => setSelectedCar(null)}  

            carDates={carDates}
            setCarDates={setCarDates}
          />
        )}

        {bookingCar && (
          <BookingModal
            car={bookingCar}
            onClose={() => setBookingCar(null)}
            carDates={carDates}  
            setCarDates={setCarDates}
            oldCancelledBookingId={oldCancelledBookingId}
          />
        )}

    </div>
  );
}