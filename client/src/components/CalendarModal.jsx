import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

const CalendarModal = ({ car, onClose, onSave, startDate, endDate, setStartDate, setEndDate, pickupTime, dropTime, setPickupTime, setDropTime}) => {
  if (!onClose) return null;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [openDropdown, setOpenDropdown] = useState(null); // "pickup" | "drop"

  const [toast, setToast] = useState(null);
  const [bookedRanges, setBookedRanges] = useState([]);

  useEffect(() => {
    if (toast) {
        const timer = setTimeout(() => setToast(null), 2500);
        return () => clearTimeout(timer);
    }
  }, [toast]);

  const isToday = (date) => {
    if (!date) return false;

    const today = new Date();

    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
  };

  const isTodayFullyBooked = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // last slot = 5:30 PM = 17*60 + 30 = 1050
    return currentMinutes > (17 * 60 + 30);
  };

  const getCurrentMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  const timeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  useEffect(() => {
    if (!startDate) return;

    if (isToday(startDate)) {
        const available = pickupTimes.filter(
        (time) => timeToMinutes(time) > getCurrentMinutes()
        );

        if (available.length === 0) {
        const tomorrow = new Date(startDate);
        tomorrow.setDate(tomorrow.getDate() + 1);

        setStartDate(tomorrow);
        setPickupTime("8:00 AM");
        }
    }
  }, [startDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const now = new Date();

  const isCurrentMonth =
    currentMonth.getMonth() === now.getMonth() &&
    currentMonth.getFullYear() === now.getFullYear();

  // ✅ Fix calendar alignment
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const handleDateClick = (date) => {
    if (date < today) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      const diff = (date - startDate) / (1000 * 60 * 60 * 24);

      if (diff < 1) {
        setToast({ type: "error", message: "Minimum Booking is 1 Day (24 Hours)" });
        return;
      }

      if (diff > 14) {
        setToast({ type: "error", message: "Maximum Booking is 14 Days" });
        return;
      }

      if (date > startDate) {
        setEndDate(date);
      } else {
        setStartDate(date);
      }
    }
  };

  const isInRange = (date) =>
    startDate && endDate && date >= startDate && date <= endDate;

  const isStart = (date) =>
    startDate && date.getTime() === startDate.getTime();

  const isEnd = (date) =>
    endDate && date.getTime() === endDate.getTime();

  const generateTimes = (startHour, endHour, endMinute = 0) => {
    const times = [];

    for (let h = startHour; h <= endHour; h++) {
        for (let m of [0, 30]) {
        if (h === endHour && m > endMinute) break;

        const hour12 = h % 12 === 0 ? 12 : h % 12;
        const ampm = h < 12 ? "AM" : "PM";

        times.push(`${hour12}:${m === 0 ? "00" : m} ${ampm}`);
        }
    }

    return times;
  };

  const pickupTimes = generateTimes(8, 17, 30); // 8:00 → 5:30
  const dropTimes = generateTimes(8, 21);       // 8:00 → 9:00

  const filteredPickupTimes = pickupTimes.filter((time) => {
    if (!isToday(startDate)) return true;

    return timeToMinutes(time) > getCurrentMinutes();
  });
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/bookings/car/${car._id}`
        );

        const data = await res.json();

        setBookedRanges(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, [car._id]);

  const isBookedDate = (date) => {
    return bookedRanges.some((booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);

      // remove time for accurate comparison
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);

      return checkDate >= start && checkDate <= end;
    });
  };

  return (
    <div className="absolute inset-0 bg-black/30 rounded-3xl flex items-center justify-center z-[999]">

      <div className="bg-white w-[450px] py-5 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] p-6 border animate-[fadeIn_0.25s_ease] relative">

        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-900 hover:text-black text-xl"
        >
            ✕
        </button>

        {/* TITLE */}
        <h2 className="text-xl font-semibold mb-4">Select duration</h2>

        {/* TIME */}
        <div className="flex gap-4 mb-4">

            {/* PICKUP */}
            <div className="flex-1 relative">
                <div
                onClick={() => setOpenDropdown(openDropdown === "pickup" ? null : "pickup")}
                className="bg-gray-100 rounded-xl p-3 cursor-pointer"
                >
                <p className="text-sm text-gray-500">Pickup time</p>
                <p className="font-medium">{pickupTime}</p>
                </div>

                {openDropdown === "pickup" && (
                <div className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-xl max-h-48 overflow-y-auto z-50">
                    {filteredPickupTimes.map((time, i) => (
                    <div
                        key={time}
                        onClick={() => {
                        setPickupTime(time);
                        setOpenDropdown(null);
                        }}
                        className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                    >
                        {time}
                    </div>
                    ))}
                </div>
                )}
            </div>

            {/* DROP OFF */}
            <div className="flex-1 relative">
                <div
                onClick={() => setOpenDropdown(openDropdown === "drop" ? null : "drop")}
                className="bg-gray-100 rounded-xl p-3 cursor-pointer"
                >
                <p className="text-sm text-gray-500">Drop-off time</p>
                <p className="font-medium">{dropTime}</p>
                </div>

                {openDropdown === "drop" && (
                <div className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-xl max-h-48 overflow-y-auto z-50">
                    {dropTimes.map((time, i) => (
                    <div
                        key={time}
                        onClick={() => {
                        setDropTime(time);
                        setOpenDropdown(null);
                        }}
                        className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                    >
                        {time}
                    </div>
                    ))}
                </div>
                )}
            </div>

        </div>

        {/* INFO */}
        <div className="bg-gray-100 rounded-xl p-3 text-center mb-4 text-sm">
          Min: 1 day • Max: 14 days
        </div>

        {/* MONTH NAV */}
        <div className="flex justify-between items-center mb-4">
          <button
            disabled={isCurrentMonth}
            onClick={() =>
                setCurrentMonth(
                new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1
                )
                )
            }
            className={`px-2 ${
                isCurrentMonth
                ? "text-gray-300 cursor-not-allowed"
                : "hover:text-black"
            }`}
          >
            ←
        </button>

          <h2 className="font-semibold">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1
                )
              )
            }
          >
            →
          </button>
        </div>

        {/* DAYS */}
        <div className="grid grid-cols-7 gap-2 text-center text-sm">

          {["Mo","Tu","We","Th","Fr","Sa","Su"].map((d) => (
            <div key={d} className="font-semibold">{d}</div>
          ))}

          {/* Empty slots for alignment */}
          {Array.from({ length: (firstDay === 0 ? 6 : firstDay - 1) }).map((_, i) => (
            <div key={"empty-" + i}></div>
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              day
            );

            const isPast = date < today;

            const isDisabledToday =
                isToday(date) && isTodayFullyBooked();

            const isDisabled =
              isPast ||
              isDisabledToday ||
              isBookedDate(date);

            return (
              <div
                key={day}
                onClick={() => {
                    if (isDisabled || isBookedDate(date)) return;
                    handleDateClick(date);
                }}
                className={`p-2 rounded-lg cursor-pointer transition
                    ${
                      isBookedDate(date)
                        ? "bg-red-100 text-red-400 cursor-no-drop"
                        : isDisabled
                        ? "text-gray-300 cursor-not-allowed"
                        : "cursor-pointer hover:bg-orange-200"
                    }

                    ${isInRange(date) ? "bg-orange-100" : ""}

                    ${
                        isStart(date) || isEnd(date)
                        ? "bg-orange-600 text-white font-semibold scale-105 shadow-md"
                        : ""
                    }

                    hover:bg-orange-300
                `}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
                // reset dates
                setStartDate(null);
                setEndDate(null);

                // 🔥 reset time also
                setPickupTime("8:00 AM");
                setDropTime("8:00 AM");

                // optional: close dropdown if open
                setOpenDropdown(null);
            }}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Clear
          </button>

          <button
            onClick={() => {
              if (!startDate || !endDate) {
                setToast({ type: "error", message: "Please select a valid date range" });
                return;
              }
              onSave(startDate, endDate, pickupTime, dropTime);
              onClose();
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Save
          </button>
        </div>

        {toast && (
            <div className="absolute inset-0 -top-[114%] flex items-center justify-center z-[1000] pointer-events-none">

                <div className="flex items-center gap-3 bg-red-500 text-white px-5 py-3 rounded-xl shadow-lg pointer-events-auto animate-[fadeIn_0.2s_ease]">

                {/* Icon */}
                <AlertCircle size={28} />

                {/* Message */}
                <p className="text-sm font-medium">{toast.message}</p>

                </div>

            </div>
        )}

      </div>
    </div>
  );
};

export default CalendarModal;