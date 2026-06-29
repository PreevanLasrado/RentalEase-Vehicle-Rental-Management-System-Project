import CalendarModal from "../components/CalendarModal";
import { useState, useEffect } from "react";
import { CalendarDays, CreditCard, ChevronRight } from "lucide-react";

const CarDetailsModal = ({ car, onClose, carDates, setCarDates }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const selectedDates =
    carDates[car._id] ||
    (car.prefilledDates
      ? {
          start: car.prefilledDates.pickupDate
            ? new Date(car.prefilledDates.pickupDate)
            : null,

          end: car.prefilledDates.dropDate
            ? new Date(car.prefilledDates.dropDate)
            : null,

          pickupTime: car.prefilledDates.pickupTime,
          dropTime: car.prefilledDates.dropTime,
        }
      : {});

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
    });
  };

  const getDays = () => {
    if (!selectedDates.start || !selectedDates.end) return 0;
    return Math.ceil(
      (selectedDates.end - selectedDates.start) / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[999] transition-all duration-300
      ${isClosing ? "bg-black/0 backdrop-blur-0" : "bg-black/50 backdrop-blur-sm"}`}
    >

      <div
        className={`bg-white w-[900px] rounded-3xl shadow-2xl relative p-6 flex gap-6
        transform transition-all duration-300
        ${isClosing
          ? "opacity-0 scale-95 translate-y-4"
          : "opacity-100 scale-100 translate-y-0"}
        `}
      >

        {/* CLOSE */}
        <button
          onClick={() => {
            setIsClosing(true);
            setTimeout(onClose, 250); // match animation duration
          }}
          className="absolute text-[23px] top-4 right-4"
        >
          ✕
        </button>

        {/* LEFT */}
        <div className="w-1/2">

          <img src={car.image} className="rounded-xl h-[360px] w-full object-cover" />

          <div className="mt-4 bg-gray-100 rounded-2xl p-4 relative">

            {/* DATE */}
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <CalendarDays className="text-orange-500" />

                <div>
                  <p className="font-medium">
                    {selectedDates.start && selectedDates.end
                        ? `${formatDate(selectedDates.start)} (${selectedDates.pickupTime || "8:00 AM"}) 
                        — 
                        ${formatDate(selectedDates.end)} (${selectedDates.dropTime || "8:00 AM"})`
                        : "Select your dates"}
                  </p>
                  
                  {/* {selectedDates.pickupTime && selectedDates.dropTime && (
                    <p className="text-xs text-gray-500">
                        Pickup: {selectedDates.pickupTime} • Drop-off: {selectedDates.dropTime}
                    </p>
                  )} */}

                  <p
                    className={`text-sm ${
                      car?.isUnavailable
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {car?.isUnavailable
                      ? "Already booked for selected dates"
                      : selectedDates.start && selectedDates.end
                      ? "Available for your dates"
                      : "Click to select"}
                  </p>
                </div>
              </div>

              <button
                disabled={car?.isUnavailable}
                onClick={() => {
                  if (car?.isUnavailable) return;
                  setShowCalendar((prev) => !prev);
                }}
                className={`transition-all ${
                  car?.isUnavailable
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:scale-110"
                }`}
              >
                <ChevronRight />
              </button>
            </div>

            <hr className="my-4" />

            {/* PRICE */}
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <CreditCard className="text-orange-500" />
                <div>
                  <p>Rental price for {getDays()} day(s)</p>
                  <p className="text-green-600 text-sm">₹{car.pricePerDay}/day</p>
                </div>
              </div>

              <p className="font-semibold">
                ₹{getDays() * car.pricePerDay}
              </p>
            </div>
          </div>

          {/* CALENDAR */}
          {showCalendar && !car?.isUnavailable && (
            <CalendarModal
              car={car}
              onClose={() => setShowCalendar(false)}

              onSave={(start, end, pickupTime, dropTime) =>
                setCarDates(prev => ({
                    ...prev,
                    [car._id]: { 
                    start, 
                    end, 
                    pickupTime, 
                    dropTime 
                    }
                }))
              }

              startDate={
                selectedDates.start
                  ? new Date(
                      selectedDates.start.getFullYear(),
                      selectedDates.start.getMonth(),
                      selectedDates.start.getDate()
                    )
                  : null
              }

              endDate={
                selectedDates.end
                  ? new Date(
                      selectedDates.end.getFullYear(),
                      selectedDates.end.getMonth(),
                      selectedDates.end.getDate()
                    )
                  : null
              }

              setStartDate={(date) =>
                setCarDates(prev => ({
                  ...prev,
                  [car._id]: {
                    ...prev[car._id],
                    start: date
                  }
                }))
              }

              setEndDate={(date) =>
                setCarDates(prev => ({
                  ...prev,
                  [car._id]: {
                    ...prev[car._id],
                    end: date
                  }
                }))
              }
              pickupTime={selectedDates.pickupTime || "8:00 AM"}
              dropTime={selectedDates.dropTime || "8:00 AM"}

              setPickupTime={(time) =>
                setCarDates(prev => ({
                    ...prev,
                    [car._id]: {
                    ...prev[car._id],
                    pickupTime: time
                    }
                }))
              }

              setDropTime={(time) =>
                setCarDates(prev => ({
                    ...prev,
                    [car._id]: {
                    ...prev[car._id],
                    dropTime: time
                    }
                }))
              }
            />
          )}

        </div>

        {/* RIGHT → DETAILS */}
        <div className="w-1/2 flex flex-col">

          <h2 className="text-3xl font-bold mb-2">{car.name}</h2>

          <hr className="mb-3" />

          <div className="flex gap-16 text-[16px]">

            {/* LEFT */}
            <div className="flex flex-col gap-3 flex-1">

              <p><span className="text-gray-500">Model</span><br /><span className="font-medium">{car.model || car.name}</span></p>

              <p><span className="text-gray-500">Brand</span><br /><span className="font-medium">{car.brand}</span></p>

              <p><span className="text-gray-500">Class</span><br /><span className="font-medium">{car.type}</span></p>

              <p><span className="text-gray-500">Body type</span><br /><span className="font-medium">{car.bodyType}</span></p>

              <p><span className="text-gray-500">Transmission</span><br /><span className="font-medium">{car.transmission}</span></p>

              <p><span className="text-gray-500">Year</span><br /><span className="font-medium">{car.year}</span></p>

              <p><span className="text-gray-500">Color</span><br /><span className="font-medium">{car.color}</span></p>

              <p><span className="text-gray-500">Engine capacity</span><br /><span className="font-medium">{car.engineCapacity}</span></p>

            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-3 flex-1">

              <p><span className="text-gray-500">Drive type</span><br /><span className="font-medium">{car.driveType}</span></p>

              <p><span className="text-gray-500">Horsepower</span><br /><span className="font-medium">{car.horsepower}</span></p>

              <p><span className="text-gray-500">0-100 km/h</span><br /><span className="font-medium">{car.acceleration}</span></p>

              <p><span className="text-gray-500">Max. speed</span><br /><span className="font-medium">{car.maxSpeed}</span></p>

              <p><span className="text-gray-500">Seats</span><br /><span className="font-medium">{car.seats}</span></p>

              <p><span className="text-gray-500">Doors</span><br /><span className="font-medium">{car.doors || "N/A"}</span></p>

              <p><span className="text-gray-500">Mileage</span><br /><span className="font-medium">{car.mileage} km</span></p>

              <p><span className="text-gray-500">Price</span><br /><span className="font-medium">₹{car.pricePerDay}/day</span></p>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsModal;