import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const AddVehicleModal = ({
  showAddVehicle,
  setShowAddVehicle,
}) => {

  if (!showAddVehicle) return null;

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [vehicleName, setVehicleName] =
  useState("");

  const [city, setCity] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [year, setYear] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [type, setType] =
    useState("");

  const [seats, setSeats] =
    useState("");

  const [fuel, setFuel] =
    useState("");

  const [transmission, setTransmission] =
    useState("");

  const [mileage, setMileage] =
    useState("");

  const [color, setColor] =
    useState("");

  const [image, setImage] =
    useState("");

  const [pricePerDay, setPricePerDay] =
    useState("");

  const [bodyType, setBodyType] =
    useState("");

  const [engineCapacity, setEngineCapacity] =
    useState("");

  const [driveType, setDriveType] =
    useState("");

  const [horsepower, setHorsepower] =
    useState("");

  const [acceleration, setAcceleration] =
    useState("");

  const [maxSpeed, setMaxSpeed] =
    useState("");

  const [doors, setDoors] =
    useState("");

  const [licensePlate, setLicensePlate] =
    useState("");

  const validateForm = () => {
    let newErrors = {};

    // Vehicle Name
    if (!vehicleName.trim()) {
      newErrors.vehicleName =
        "Vehicle name is required";
    }

    // Select fields
    if (!city)
      newErrors.city = "Please select city";

    if (!brand)
      newErrors.brand = "Please select brand";

    if (!year)
      newErrors.year = "Please select year";

    if (!category)
      newErrors.category =
        "Please select category";

    if (!type)
      newErrors.type = "Please select type";

    if (!seats)
      newErrors.seats = "Please select seats";

    if (!fuel)
      newErrors.fuel = "Please select fuel";

    if (!transmission)
      newErrors.transmission =
        "Please select transmission";

    if (!color)
      newErrors.color = "Please select color";

    if (!bodyType)
      newErrors.bodyType =
        "Please select body type";

    if (!driveType)
      newErrors.driveType =
        "Please select drive type";

    // Mileage
    if (
      mileage === "" ||
      mileage < 0 ||
      mileage > 25
    ) {
      newErrors.mileage =
        "Mileage must be between 0-25";
    }

    // Image URL
    if (!image.trim()) {
      newErrors.image =
        "Image URL is required";

    } else {

      try {

        const url = new URL(image);

        const validHosts = [
          "images.unsplash.com",
          "cdn.pixabay.com",
          "i.imgur.com",
        ];

        const isImageExtension =
          /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(
            url.pathname
          );

        const isTrustedHost =
          validHosts.includes(url.hostname);

        if (
          !isImageExtension &&
          !isTrustedHost
        ) {

          newErrors.image =
            "Enter a valid image URL";

        }

      } catch {

        newErrors.image =
          "Enter a valid image URL";

      }
    }

    // Price
    if (!pricePerDay || pricePerDay <= 0) {
      newErrors.pricePerDay =
        "Enter valid price";
    }

    // Engine
    if (!engineCapacity.trim()) {
      newErrors.engineCapacity =
        "Engine capacity required";
    }

    // Horsepower
    if (!horsepower || horsepower <= 0) {
      newErrors.horsepower =
        "Enter valid horsepower";
    }

    // Acceleration
    if (!acceleration || acceleration <= 0) {
      newErrors.acceleration =
        "Enter valid acceleration";
    }

    // Max Speed
    if (!maxSpeed || maxSpeed <= 0) {
      newErrors.maxSpeed =
        "Enter valid max speed";
    }

    // Doors
    if (!doors || doors <= 0) {
      newErrors.doors =
        "Enter valid doors";
    }

    // License Plate
    if (!licensePlate.trim()) {
      newErrors.licensePlate =
        "License plate required";

    } else {

      const plateRegex =
        /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/;

      if (!plateRegex.test(licensePlate)) {

        newErrors.licensePlate =
          "Enter valid license plate";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const addVehicleHandler = async () => {
    if (!validateForm()) return;

    try {

      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      const vehicleData = {
        name: vehicleName,
        city,
        brand,
        year: Number(year),
        category,
        type,
        seats: Number(seats),
        fuel,
        transmission,
        mileage: Number(mileage),
        color,
        image,
        pricePerDay: Number(pricePerDay),
        bodyType,
        engineCapacity,
        driveType,
        horsepower: Number(horsepower),
        acceleration: Number(acceleration),
        maxSpeed: Number(maxSpeed),
        doors: Number(doors),
        licensePlate,
      };

      const response = await fetch(
        "http://localhost:5000/api/vehicles",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },

          body: JSON.stringify(vehicleData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success("Vehicle added successfully!", {
        duration: 3000,
        style: {
          borderRadius: "14px",
          background: "#16a34a",
          color: "#fff",
          fontWeight: "700",
          padding: "14px 18px",
        },
      });

      setShowAddVehicle(false);

      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {

      toast.error(error.message, {
        duration: 3000,
        style: {
          borderRadius: "14px",
          fontWeight: "700",
        },
      });

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BLUR BG */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* MODAL */}
      <div className="relative w-[95%] max-w-3xl bg-[#fff8f2] rounded-[38px] shadow-2xl border border-orange-200 overflow-hidden max-h-[95vh]">

        {/* HEADER */}
        <div className="sticky -mb-3 bg-white border-b border-orange-100 px-4 py-6 flex items-center justify-between z-10">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[32px]">
                directions_car
              </span>
            </div>

            <div>
              <h1 className="text-4xl font-black text-[#2b0d00]">
                Add New Vehicle
              </h1>

              <p className="text-gray-500 mt-1">
                Fill all vehicle details
              </p>
            </div>
          </div>

          {/* CLOSE */}
          <button
            onClick={() => setShowAddVehicle(false)}
            className="w-12 h-12 rounded-full bg-orange-100 hover:bg-orange-500 transition-all duration-300 flex items-center justify-center group"
          >
            <X
              className="text-orange-500 group-hover:text-white"
              size={22}
            />
          </button>
        </div>

        {/* BODY */}
        <div className="p-8">

          <div className="max-h-[60vh] overflow-y-auto pr-3">
            <div className="grid grid-cols-3 gap-6">

              {/* VEHICLE NAME */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Vehicle Name
                </label>

                <input
                  required
                  type="text"
                  value={vehicleName}
                  onChange={(e) =>
                    setVehicleName(e.target.value)
                  }
                  placeholder="BMW X5"
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.vehicleName
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                />
                
                {errors.vehicleName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.vehicleName}
                  </p>
                )}
              </div>

              {/* CITY */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  City
                </label>

                <select
                  required
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.city
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                >

                  <option value="">
                    Select City
                  </option>

                  <option>Bangalore</option>
                  <option>Mumbai</option>
                  <option>Delhi</option>
                  <option>Chennai</option>
                  <option>Hyderabad</option>
                  <option>Pune</option>
                  <option>Kolkata</option>

                </select>

                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city}
                  </p>
                )}
              </div>

              {/* BRAND */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Brand
                </label>

                <select
                  required
                  value={brand}
                  onChange={(e) =>
                    setBrand(e.target.value)
                  }
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.brand
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                >

                  <option value="">
                    Select Brand
                  </option>

                  <option>Toyota</option>
                  <option>Tesla</option>
                  <option>Hyundai</option>
                  <option>BMW</option>
                  <option>Audi</option>
                  <option>Mercedes</option>
                  <option>Kia</option>
                  <option>Honda</option>
                  <option>Ford</option>
                  <option>Tata</option>
                  <option>Volkswagen</option>
                  <option>Mahindra</option>
                  <option>Nissan</option>
                  <option>Chevrolet</option>
                  <option>Jeep</option>
                  <option>Land Rover</option>
                  <option>Volvo</option>
                  <option>Porsche</option>
                  <option>Lexus</option>

                </select>

                {errors.brand && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.brand}
                  </p>
                )}
              </div>

              {/* YEAR */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Year
                </label>

                <select
                  required
                  value={year}
                  onChange={(e) =>
                    setYear(e.target.value)
                  }
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.year
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                >

                  <option value="">
                    Select Year
                  </option>

                  <option>2026</option>
                  <option>2025</option>
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                  <option>2020</option>
                  <option>2019</option>
                  <option>2018</option>

                </select>

                {errors.year && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.year}
                  </p>
                )}
              </div>

              {/* CATEGORY */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Category
                </label>

                <select
                  required
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.category
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                >

                  <option value="">
                    Select Category
                  </option>

                  <option>4W</option>
                  <option>2W</option>

                </select>

                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category}
                  </p>
                )}
              </div>

              {/* TYPE */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Type
                </label>

                <select
                  required
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value)
                  }
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.type
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                >

                  <option value="">
                    Select Type
                  </option>

                  <option>Economy</option>
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Sport</option>
                  <option>Business</option>
                  <option>Luxury</option>

                </select>

                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.type}
                  </p>
                )}
              </div>

              {/* SEATS */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Seats
                </label>

                <select
                  required
                  value={seats}
                  onChange={(e) =>
                    setSeats(e.target.value)
                  }
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.seats
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                >

                  <option value="">
                    Select Seats
                  </option>

                  <option>2</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>

                </select>

                {errors.seats && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.seats}
                  </p>
                )}
              </div>

              {/* FUEL */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Fuel
                </label>

                <select
                  required
                  value={fuel}
                  onChange={(e) =>
                    setFuel(e.target.value)
                  }
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.fuel
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                >

                  <option value="">
                    Select Fuel
                  </option>

                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
            
                </select>

                {errors.fuel && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fuel}
                  </p>
                )}
              </div>

              {/* TRANSMISSION */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Transmission
                </label>

                <select
                  required
                  value={transmission}
                  onChange={(e) =>
                    setTransmission(e.target.value)
                  }
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.transmission
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                >

                  <option value="">
                    Select Transmission
                  </option>

                  <option>Automatic</option>
                  <option>Manual</option>

                </select>

                {errors.transmission && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.transmission}
                  </p>
                )}
              </div>

              {/* MILEAGE */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Mileage
                </label>

                <div className="relative">

                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={mileage}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value >= 0 || value === "") {
                        setMileage(value);
                      }
                    }}
                    placeholder="10"
                    className={`w-full h-14 rounded-2xl bg-white px-5 pr-14 outline-none transition-all duration-300 ${
                      errors.mileage
                        ? "border border-red-500 focus:border-red-500"
                        : "border border-orange-200 focus:border-orange-500"
                    }`}
                  />

                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    km
                  </span>
                </div>

                {errors.mileage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.mileage}
                  </p>
                )}
              </div>

              {/* COLOR */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Color
                </label>

                <select
                  required
                  value={color}
                  onChange={(e) =>
                    setColor(e.target.value)
                  }
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.color
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                >

                  <option value="">
                    Select Color
                  </option>

                  <option>Blue</option>
                  <option>Brown</option>
                  <option>Green</option>
                  <option>Gray</option>
                  <option>Navy</option>
                  <option>Beige</option>
                  <option>Black</option>
                  <option>White</option>
                  <option>Purple</option>
                  <option>Silver</option>
                  <option>Teal</option>
                  <option>Gold</option>
                  <option>Red</option>
                  <option>Cyan</option>
                  <option>Orange</option>
                  <option>Pink</option>
                  <option>Maroon</option>
                  <option>Olive</option>

                </select>

                {errors.color && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.color}
                  </p>
                )}
              </div>

              {/* IMAGE URL */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Image URL
                </label>

                <input
                  type="text"
                  value={image}
                  onChange={(e) =>
                    setImage(e.target.value)
                  }
                  placeholder="https://image-url.com"
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.image
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                />

                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.image}
                  </p>
                )}
              </div>

              {/* PRICE */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Price Per Day
                </label>

                <div className="relative">

                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                    ₹
                  </span>

                  <input
                    type="number"
                    value={pricePerDay}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value >= 0 || value === "") {
                        setPricePerDay(value);
                      }
                    }}
                    placeholder="8500"
                    className={`w-full h-14 rounded-2xl bg-white pl-10 pr-5 outline-none transition-all duration-300 ${
                      errors.pricePerDay
                        ? "border border-red-500 focus:border-red-500"
                        : "border border-orange-200 focus:border-orange-500"
                    }`}
                  />
                </div>

                {errors.pricePerDay && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.pricePerDay}
                  </p>
                )}
              </div>

              {/* BODY TYPE */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Body Type
                </label>

                <select
                  required
                  value={bodyType}
                  onChange={(e) =>
                    setBodyType(e.target.value)
                  }
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.bodyType
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                >

                  <option value="">
                    Select Body Type
                  </option>

                  <option>Sedan</option>
                  <option>Hatchback</option>
                  <option>SUV</option>
                  <option>Crossover</option>
                  <option>Coupe</option>
                  <option>Convertible</option>
                  <option>Station Wagon</option>
                  <option>Pickup Truck</option>

                </select>

                {errors.bodyType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bodyType}
                  </p>
                )}
              </div>

              {/* ENGINE */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Engine Capacity
                </label>

                <input
                  type="text"
                  value={engineCapacity}
                  onChange={(e) => {
                    let value = e.target.value
                      .replace(/[^0-9]/g, "");

                    setEngineCapacity(
                      value ? `${value}cc` : ""
                    );
                  }}
                  placeholder="2998cc"
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.engineCapacity
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                />

                {errors.engineCapacity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.engineCapacity}
                  </p>
                )}
              </div>

              {/* DRIVE TYPE */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Drive Type
                </label>

                <select
                  required
                  value={driveType}
                  onChange={(e) =>
                    setDriveType(e.target.value)
                  }
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.driveType
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                >

                  <option value="">
                    Select Drive Type
                  </option>

                  <option>FWD</option>
                  <option>RWD</option>
                  <option>AWD</option>
                  <option>4WD</option>

                </select>

                {errors.driveType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.driveType}
                  </p>
                )}
              </div>

              {/* HORSEPOWER */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Horsepower
                </label>

                <div className="relative">

                  <input
                    type="number"
                    value={horsepower}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value >= 0 || value === "") {
                        setHorsepower(value);
                      }
                    }}
                    placeholder="335"
                    className={`w-full h-14 rounded-2xl bg-white px-5 pr-16 outline-none transition-all duration-300 ${
                      errors.horsepower
                        ? "border border-red-500 focus:border-red-500"
                        : "border border-orange-200 focus:border-orange-500"
                    }`}
                  />

                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    hp
                  </span>
                </div>

                {errors.horsepower && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.horsepower}
                  </p>
                )}
              </div>

              {/* ACCELERATION */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Acceleration
                </label>

                <input
                  type="number"
                  value={acceleration}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value >= 0 || value === "") {
                      setAcceleration(value);
                    }
                  }}
                  placeholder="5.5"
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.acceleration
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                />

                {errors.acceleration && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.acceleration}
                  </p>
                )}
              </div>

              {/* MAX SPEED */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Max Speed
                </label>

                <div className="relative">

                  <input
                    type="number"
                    value={maxSpeed}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value >= 0 || value === "") {
                        setMaxSpeed(value);
                      }
                    }}
                    placeholder="250"
                    className={`w-full h-14 rounded-2xl bg-white px-5 pr-20 outline-none transition-all duration-300 ${
                      errors.maxSpeed
                        ? "border border-red-500 focus:border-red-500"
                        : "border border-orange-200 focus:border-orange-500"
                    }`}
                  />

                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    km/h
                  </span>
                </div>

                {errors.maxSpeed && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.maxSpeed}
                  </p>
                )}
              </div>

              {/* DOORS */}
              <div>
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  Doors
                </label>

                <input
                  type="number"
                  value={doors}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value >= 0 || value === "") {
                      setDoors(value);
                    }
                  }}
                  placeholder="5"
                  className={`w-full h-14 rounded-2xl bg-white px-5 outline-none transition-all duration-300 ${
                    errors.doors
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                />

                {errors.doors && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.doors}
                  </p>
                )}
              </div>

              {/* LICENSE */}
              <div className="col-span-1">
                <label className="text-[15px] font-bold text-[#2b0d00] mb-2 block">
                  License Plate
                </label>

                <input
                  type="text"
                  value={licensePlate}
                  onChange={(e) =>
                    setLicensePlate(
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="KA-05-BX-1837"
                  className={`w-full h-14 rounded-2xl bg-white px-5 uppercase outline-none transition-all duration-300 ${
                    errors.licensePlate
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-orange-200 focus:border-orange-500"
                  }`}
                />

                {errors.licensePlate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.licensePlate}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 mt-4 -mb-4">

            <button
              onClick={() =>
                setShowAddVehicle(false)
              }
              className="px-8 h-14 rounded-2xl border border-orange-200 text-[#2b0d00] font-black hover:bg-orange-100 hover:scale-105 transition-all"
            >
              Cancel
            </button>

            <button
              onClick={addVehicleHandler}
              className="px-8 h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 hover:scale-105 transition-all text-white font-black shadow-xl shadow-orange-500/30"
            >
              {loading ? "Adding..." : "Add Vehicle"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVehicleModal;