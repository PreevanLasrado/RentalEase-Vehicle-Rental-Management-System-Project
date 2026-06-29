import { useState, useEffect } from "react";
import { Shield, PlusCircle, User, Phone, Mail, ArrowLeft, ChevronRight, CalendarDays, Clock, ShieldCheck, Wallet, CreditCard, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import car_icon from "../assets/car-icon.png";
import CalendarModal from "../components/CalendarModal";
import paymentIcons from "../assets/paynow.png";

const BookingModal = ({ car, onClose, carDates, setCarDates, oldCancelledBookingId }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [animate, setAnimate] = useState(false);

  const [insurance, setInsurance] = useState(false);
  const [driver, setDriver] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

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

  const [showDetails, setShowDetails] = useState(false);

  const [showInsuranceInfo, setShowInsuranceInfo] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const depositAmount = car.deposit || 5000;

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [errors, setErrors] = useState({});
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [experienceConfirmed, setExperienceConfirmed] = useState(false);

  const handleBookNow = (car) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      // 🔥 store redirect + booking intent
      localStorage.setItem("redirectAfterLogin", "/rentals");

      localStorage.setItem(
        "pendingBooking",
        JSON.stringify({ carId: car._id })
      );

      navigate("/login");
      return;
    }

    // ✅ already logged in → open modal
    setSelectedCar(car);
    setShowModal(true);
  };

  const handleLogin = () => {
    // after login success
    localStorage.setItem("user", JSON.stringify(userData));

    const redirect = localStorage.getItem("redirectAfterLogin");

    if (redirect) {
      navigate(redirect);
      localStorage.removeItem("redirectAfterLogin");
    } else {
      navigate("/");
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "RENT10EASE") {
      const discount = Math.floor(finalTotal * 0.10);

      setPromoDiscount(discount);
      setPromoApplied(true);
      setPromoError(""); // ✅ clear error
    } else {
      setPromoError("Promo code invalid"); // ❗ show error
      setPromoApplied(false);
      setPromoDiscount(0);
    }
  };

  const validateFields = () => {
    const newErrors = {};

    if (!userDetails.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!/^[a-zA-Z\s]+$/.test(userDetails.name)) {
      newErrors.name = "Name should contain only letters";
    }

    if (!userDetails.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Enter valid email";
    }

    if (!userDetails.phone.match(/^[0-9]{10}$/)) {
      newErrors.phone = "Enter valid 10-digit phone number";
    }

    if (!/^\d{10}$/.test(userDetails.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (!paymentSuccess) return;

    const timer = setTimeout(() => {
      navigate("/rentals", { replace: true });
      window.location.reload(); // 🔥 FORCE REFRESH
    }, 2000);

    return () => clearTimeout(timer);
  }, [paymentSuccess, navigate]);

  const [options, setOptions] = useState({
    childSeat: false,
    driver: false,
    chauffeur: false
  });

  // 🔥 LOCAL STATE (NO PARENT NEEDED)
  const [dates, setDates] = useState({
    start: null,
    end: null,
    pickupTime: "8:00 AM",
    dropTime: "8:00 AM",
  });

  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const user = JSON.parse(localStorage.getItem("user")); // or from context

  useEffect(() => {
    if (user) {
      setUserDetails({
        name: user.name || "",
        email: user.email || "",
        phone: ""
      });
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setTimeout(() => setAnimate(true), 50);
    return () => (document.body.style.overflow = "auto");
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);

    const day = d.toLocaleDateString("en-US", { weekday: "short" });
    const month = d.toLocaleDateString("en-US", { month: "short" });

    return `${day} ${month} ${d.getDate()} ${d.getFullYear()}`;
  };

  // DAYS
  const getDays = () => {
    if (!selectedDates?.start || !selectedDates?.end) return 0;

    const start = new Date(selectedDates.start);
    const end = new Date(selectedDates.end);

    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.ceil(diff));
  };

  // DISCOUNT RATE
  const getDiscountRate = (pricePerDay) => {
    if (pricePerDay >= 100000) return 0.10;
    if (pricePerDay > 20000) return 0.07;
    return 0.05;
  };

  const days = getDays();

  // BASE
  const basePrice = car.pricePerDay * days;

  // DISCOUNT
  const discountRate = getDiscountRate(basePrice);
  const discountAmount = Math.floor(basePrice * discountRate);
  const discountedPrice = basePrice - discountAmount;

  // ADD-ONS
  const insuranceCost = insurance ? days * 300 : 0;

  const optionsCost =
    (options.childSeat ? 650 : 0) +
    (options.driver ? 350 : 0) +
    (options.chauffeur ? 13500 : 0);

  // SUBTOTAL
  const subtotal =
    discountedPrice +
    insuranceCost +
    optionsCost;

  // TAX
  const tax = Math.floor(subtotal * 0.05);

  // FINAL
  const finalTotal = subtotal + tax;
  const finalAfterPromo = finalTotal - promoDiscount;

  const effectiveTotal = promoApplied ? finalAfterPromo : finalTotal;
  const payNowAmount = Math.floor(effectiveTotal * 0.05);
  const payLaterAmount = effectiveTotal - payNowAmount;

  const getGrandTotal = () => {
    if (!selectedDates?.start || !selectedDates?.end) return 0;

    return effectiveTotal + depositAmount;
  };

  if (isProcessing) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium">Processing payment...</p>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white">

        <div className="flex flex-col items-center justify-center text-center animate-fadeIn">

          {/* TICK */}
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-scaleUp">
            <svg
              className="w-10 h-10 text-green-600 animate-draw"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* TEXT */}
          <h2 className="text-3xl font-bold mb-2">
            Booking Confirmed!
          </h2>

          <p className="text-gray-700 mb-2 text-[18px]">
            Your car has been successfully booked.
          </p>
 
          <p className="text-black text-[18px] font-bold mt-0">
            Thank you for choosing us!
          </p>

        </div>
      </div>
    );
  }

  const handleConfirmBooking = async () => {
    if (!validateFields()) return;

    if (!ageConfirmed || !experienceConfirmed) {
      alert("Please confirm eligibility");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      setIsProcessing(true);

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // 🔥 MUST
        },
        body: JSON.stringify({
          vehicleId: car._id,
          startDate: selectedDates.start,
          endDate: selectedDates.end,
          pickupTime: selectedDates.pickupTime,
          dropTime: selectedDates.dropTime,
          city: car.city,
          totalPrice: getGrandTotal(),
        }),
      });

      const data = await res.json();

      console.log("BOOKING RESPONSE:", data);

      if (!res.ok) {
        setIsProcessing(false);
        alert(data.message || "Booking failed");
        return;
      }

      // DELETE OLD CANCELLED BOOKING AFTER SUCCESSFUL REBOOK
      if (oldCancelledBookingId) {
        await fetch(
          `http://localhost:5000/api/bookings/${oldCancelledBookingId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
      }

      setIsProcessing(false);
      setPaymentSuccess(true);

    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* MODAL */}
      <div
        className={`relative bg-white w-[950px] max-w-[95%] rounded-3xl shadow-2xl p-6 transition-all duration-300 ${
          animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >

        {/* CLOSE */}
        <button onClick={onClose} className="absolute top-5 right-5 text-2xl">
          ✕
        </button>

        {/* HEADER */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">Step {step} of 2</p>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full bg-green-500 transition-all duration-500 ${
                step === 1 ? "w-1/2" : "w-full"
              }`}
            />
          </div>
        </div>

        <div className="flex gap-6 h-[500px]">

          {/* LEFT */}
          <div className="w-1/2">

            <img src={car.image} className="rounded-xl h-[360px] w-full object-cover" />

            <div className="mt-4 bg-gray-100 rounded-2xl p-4 relative">

              <p className="text-sm text-gray-500">
                {car.transmission} · {car.type}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={car_icon} className="w-5 h-5" />
                  <p className="font-semibold">{car.name}</p>
                </div>
                <button
                  onClick={() => setShowDetails(true)}
                  className="text-blue-500 text-sm"
                >
                  Car details
                </button>
              </div>

              <div className="bg-gray-100 rounded-xl p-3 flex items-center gap-3">
                <div className="bg-green-600 text-white px-3 py-2 -ml-4 rounded-2xl font-bold">
                  8.2
                </div>
                <div>
                  <p className="font-semibold">Verified Car</p>
                  <p className="text-gray-500 text-[14px]">
                    400+ successful bookings
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT */}
          <div className="w-1/2 flex flex-col">

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">

              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold">{car.name}</h2>

                  {/* DATE CARD */}
                  <div
                    onClick={() => setShowCalendar(prev => !prev)}
                    className="flex justify-between items-center bg-gray-100 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-200"
                  >
                    <div className="flex gap-3">
                      <CalendarDays className="text-orange-500" />

                      <div>
                        <p className="font-medium">
                          {selectedDates?.start && selectedDates?.end
                            ? `${formatDate(selectedDates.start)} (${selectedDates.pickupTime}) — ${formatDate(selectedDates.end)} (${selectedDates.dropTime})`
                            : "Select your dates"}
                        </p>

                        <p className="text-green-600 text-sm">
                          {selectedDates?.start && selectedDates?.end
                            ? "Available for your dates"
                            : "Click to select"}
                        </p>
                      </div>
                    </div>

                    <ChevronRight />
                  </div>

                  {selectedDates?.start && selectedDates?.end && (  
                    <div className="mt-3 space-y-2 text-sm text-gray-700">
                      <h3 className="font-semibold text-black text-lg">Pickup & Dropoff Information</h3>

                      {/* PICKUP DATE */}
                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        <span>{formatDate(selectedDates.start)}</span>
                      </div>

                      {/* PICKUP TIME */}
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{selectedDates.pickupTime}</span>
                      </div>

                      {/* DROP DATE */}
                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        <span>{formatDate(selectedDates.end)}</span>
                      </div>

                      {/* DROP TIME */}
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{selectedDates.dropTime}</span>
                      </div>

                    </div>
                  )}

                  {/* EXTRAS */}
                  <div className="space-y-3">

                    <h3 className="font-semibold text-lg">Insurance</h3>

                    {/* FREE CANCELLATION */}
                    <div
                      onClick={() => setInsurance(false)}
                      className={`flex justify-between items-center p-4 rounded-xl cursor-pointer transition ${
                        !insurance
                          ? "bg-green-100 border border-green-400"
                          : "bg-gray-100"
                      }`}
                    >
                      <p className="font-medium">
                        Free cancellation up to 48 hours before pickup
                      </p>

                      { !insurance && (
                        <span className="text-green-600 text-xl">✔</span>
                      )}
                    </div>

                    {/* COMPREHENSIVE INSURANCE */}
                    <div
                      onClick={() => setInsurance(true)}
                      className={`flex justify-between items-center p-4 rounded-xl cursor-pointer transition ${
                        insurance
                          ? "bg-green-100 border border-green-400"
                          : "bg-gray-100"
                      }`}
                    >
                      <div>
                        <p className="font-medium">
                          Comprehensive insurance (+₹300/day)
                        </p>
                        <p className="text-sm text-gray-500">
                          Excess amount of ₹3000–₹5000 · <span
                            onClick={(e) => {
                              e.stopPropagation(); // IMPORTANT (prevents card click)
                              setShowInsuranceInfo(true);
                            }}
                            className="text-blue-500 cursor-pointer"
                          >
                            More
                          </span>
                        </p>
                      </div>

                      { insurance && (
                        <span className="text-green-600 text-xl">✔</span>
                      )}
                    </div>

                  </div>

                  <div className="mt-5">
                    <h3 className="font-semibold text-lg mb-2">Deposit</h3>

                    <div className="flex items-center justify-between bg-gray-100 rounded-2xl p-4">

                      {/* LEFT */}
                      <div className="flex items-start gap-3">

                        {/* ICON */}
                        <div className="bg-gray-100 p-1 rounded-lg mt-2 ">
                          <Wallet className="w-5 h-5 text-gray-700" />
                        </div>

                        {/* TEXT */}
                        <div>
                          <p className="font-medium">Deposit</p>
                          <p className="text-sm text-gray-500">
                            Refunded within 21 days after return
                          </p>
                        </div>

                      </div>

                      {/* RIGHT PRICE */}
                      <p className="font-semibold text-lg">
                        ₹{car.deposit || 5000}
                      </p>

                    </div>
                  </div>

                  <div className="mt-5">
                    <h3 className="font-semibold text-lg mb-3">Options</h3>

                    <div className="bg-gray-100 rounded-2xl divide-y">

                      {/* CHILD SEAT */}
                      <div className="flex items-center justify-between p-4">
                        <p>
                          Child seat · <span className="text-gray-600">₹650/rental</span>
                        </p>

                        <button
                          onClick={() => setOptions(prev => ({ ...prev, childSeat: !prev.childSeat }))}
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                            options.childSeat ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                              options.childSeat ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* ADDITIONAL DRIVER */}
                      <div className="flex items-center justify-between p-4">
                        <p>
                          Additional Driver · <span className="text-gray-600">₹350/rental</span>
                        </p>

                        <button
                          onClick={() => setOptions(prev => ({ ...prev, driver: !prev.driver }))}
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                            options.driver ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                              options.driver ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* CHAUFFEUR */}
                      <div className="flex items-center justify-between p-4">
                        <p>
                          Chauffeur Service · <span className="text-gray-600">₹13500/rental</span>
                        </p>

                        <button
                          onClick={() => setOptions(prev => ({ ...prev, chauffeur: !prev.chauffeur }))}
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                            options.chauffeur ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                              options.chauffeur ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                    </div>

                  </div>

                  <div className="mt-5">
                    <h3 className="font-semibold text-lg mb-3">Important info</h3>

                    <div className="bg-gray-100 rounded-2xl divide-y">

                      {/* PAYMENT ON PICKUP */}
                      <div className="flex gap-4 p-4">
                        <CreditCard className="w-9 h-9 text-gray-600 mt-4" />

                        <div>
                          <p className="font-medium">Payment on pickup</p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Bank transfer, Cash, Credit card (3% bank charges), Crypto, Debit card (Visa, Mastercard)
                          </p>
                        </div>
                      </div>

                      {/* DEPOSIT PAYMENT */}
                      <div className="flex gap-4 p-4">
                        <Wallet className="w-7 h-7 text-gray-600 mt-4" />

                        <div>
                          <p className="font-medium">Deposit payment</p>
                          <p className="text-sm text-gray-600">
                            Bank transfer, Cash, Credit card, Crypto, Debit card (Visa, Mastercard)
                          </p>
                        </div>
                      </div>

                      {/* MINIMUM DRIVER */}
                      <div className="flex gap-4 p-4">
                        <User className="w-6 h-6 text-gray-600 mt-3" />

                        <div>
                          <p className="font-medium">Minimum driver requirements</p>
                          <p className="text-sm text-gray-600">
                            18+ years old · 1 year driving experience
                          </p>
                        </div>
                      </div>

                      {/* REQUIRED DOCUMENTS */}
                      <div
                        onClick={() => setShowDocs(true)}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-200 transition"
                      >
                        <div className="flex gap-4">
                          <FileText className="w-6 h-6 text-gray-600 -mt-0" />

                          <div>
                            <p className="font-medium">Required documents</p>
                          </div>
                        </div>

                        <ChevronRight className="text-gray-500" />
                      </div>

                    </div>
                  </div>

                  {/* PRICE */}
                  {selectedDates?.start && selectedDates?.end && (
                    <div className="mt-4 text-sm space-y-2">
                      <h3 className="font-semibold text-lg mb-2">Price Summary</h3>
                      <div className="mt-4 text-[15px] space-y-2">
                        {/* RENTAL */}
                        <div className="flex justify-between">
                          <span>Rental price for {days} day(s)</span>
                          <span>₹{basePrice}</span>
                        </div>

                        {/* DISCOUNT */}
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({Math.round(discountRate * 100)}%)</span>
                          <span>-₹{discountAmount}</span>
                        </div>

                        {/* 🔥 ADD-ONS SECTION */}
                        {insurance && (
                          <div className="flex justify-between">
                            <span>Insurance (₹300 × {days})</span>
                            <span>₹{insuranceCost}</span>
                          </div>
                        )}

                        {options.childSeat && (
                          <div className="flex justify-between">
                            <span>Child seat</span>
                            <span>₹650</span>
                          </div>
                        )}

                        {options.driver && (
                          <div className="flex justify-between">
                            <span>Additional driver</span>
                            <span>₹350</span>
                          </div>
                        )}

                        {options.chauffeur && (
                          <div className="flex justify-between">
                            <span>Chauffeur service</span>
                            <span>₹13500</span>
                          </div>
                        )}

                        {/* TAX */}
                        <div className="flex justify-between">
                          <span>GST 5%</span>
                          <span>₹{tax}</span>
                        </div>

                        <hr className="my-2" />

                        {/* TOTAL */}
                        <div className="flex justify-between items-center font-semibold text-lg">
                          <span>Total for {days} day(s)</span>

                          <div className="text-right">
                            {/* OLD PRICE */}
                            <p className="line-through text-gray-400 text-sm">
                              ₹{basePrice + insuranceCost + optionsCost}
                            </p>

                            {/* FINAL */}
                            <p className="text-green-600 font-bold">
                              ₹{finalTotal}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ================= STEP 2 ================= */}
              {step === 2 && (
                <>
                  {/* BACK */}
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-3 mb-4"
                  >
                    <ArrowLeft size={16} />
                    <span className="text-1xl font-semibold">Back</span>
                  </button>

                  <h3 className="font-semibold text-lg mb-0">Price Summary</h3>

                  {/* PRICE BREAKDOWN */}
                  <div className="bg-white rounded-2xl p-0 space-y-3 text-sm">

                    <div className="flex justify-between">
                      <span>Rental price for {days} days</span>
                      <span>₹{basePrice}</span>
                    </div>

                    <div className="flex justify-between text-green-600">
                      <span>Discount ({Math.round(discountRate * 100)}%)</span>
                      <span>-₹{discountAmount}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Insurance</span>
                      <span>₹{insuranceCost}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Options</span>
                      <span>₹{optionsCost}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>GST 5%</span>
                      <span>₹{tax}</span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Promo Discount (10%)</span>
                        <span>-₹{promoDiscount}</span>
                      </div>
                    )}

                    <hr />

                    <div className="flex justify-between items-center font-semibold text-lg">
                      <span>Total for {days} day(s)</span>

                      <div className="text-right">
                        {/* OLD PRICE */}
                        <p className="line-through text-gray-400 text-sm">
                          ₹{basePrice + insuranceCost + optionsCost}
                        </p>

                        {/* FINAL */}
                        <p className="text-green-600 font-bold">
                          ₹{promoApplied ? finalAfterPromo : finalTotal}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PROMO */}
                  <div className="flex items-center gap-2 mt-3 bg-gray-100 rounded-xl px-1 py-2">
                    <input
                      value={promoCode}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        setPromoCode(value);

                        // reset everything when user edits
                        setPromoApplied(false);
                        setPromoDiscount(0);
                        setPromoError("");
                      }}
                      placeholder="Enter promo code"
                      className="flex-1 bg-transparent outline-none"
                    />

                    {promoCode.trim() !== "" && !promoApplied && (
                      <button
                        onClick={handleApplyPromo}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                      >
                        Apply
                      </button>
                    )}

                    {promoApplied && (
                      <span className="text-green-600 font-medium">Applied ✓</span>
                    )}

                  </div>
                  {promoError && (
                    <p className="text-red-500 text-sm pl-1">
                      {promoError}
                    </p>
                  )}

                  {/* PAYMENT CARD */}
                  <div className="bg-gray-100 rounded-2xl p-4 mt-4 space-y-2">

                    {/* PAY NOW */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Pay now online</p>
                        <img
                          src={paymentIcons}
                          alt="payment methods"
                          className="mt-0 h-8 object-contain"
                        />
                      </div>

                      <p className="font-semibold mb-6">
                        ₹{payNowAmount}
                      </p>
                    </div>

                    <hr />

                    {/* PAY LATER */}
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Pay the rest at pickup</p>
                        <p className="text-xs text-gray-500">
                          Bank transfer, Cash, Credit card, Credit card (3% bank charges apply), Crypto, Debit card (Visa, Mastercard), Debit card (Visa, Mastercard) + (3% bank charges apply)
                        </p>
                      </div>

                      <p>₹{payLaterAmount}</p>
                    </div>
                  </div>

                  {/* DEPOSIT */}
                  <div className="flex justify-between mt-4">
                    <div>
                      <p className="font-medium">Refundable Deposit</p>
                      <p className="text-[14px] text-gray-500">
                        Refunded within 21 days after you return the car
                      </p>
                    </div>

                    <p>₹{depositAmount}</p>
                  </div>

                  {/* POLICY */}
                  <div className="flex justify-between mt-2 mb-3">
                    <span>Cancellation Policy</span>
                    <span className="text-[13px] mt-1 mb-3 font-medium">Free cancellation up to 48 hours before pickup</span>
                  </div>

                  <h2 className="text-xl font-bold mb-3">Personal details</h2>
                  {/* NAME */}
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={20} />

                    <input
                      value={userDetails.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setUserDetails({ ...userDetails, name: value });
                        }
                      }}
                      placeholder="Full name"
                      className="border pl-10 p-3 w-full rounded-xl"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

                  {/* EMAIL */}
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} />

                    <input
                      value={userDetails.email}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, email: e.target.value })
                      }
                      placeholder="Email for booking confirmation"
                      className="border pl-10 p-3 w-full rounded-xl"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

                  {/* PHONE */}
                  <div className="flex mt-2">
                    {/* ICON + CODE */}
                    <div className="flex items-center gap-0 bg-gray-100 px-2 rounded-l-xl border">
                      <Phone size={16} className="text-black" />
                      <span className="text-sm">+91</span>
                    </div>

                    {/* INPUT */}
                    <input
                      value={userDetails.phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,10}$/.test(value)) {
                          setUserDetails({ ...userDetails, phone: value });
                        }
                      }}
                      placeholder="Phone number"
                      className="border p-3 w-full rounded-r-xl"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}

                  {/* CHECKBOXES */}
                  <div className="mt-4 space-y-0">

                    <div className="flex justify-between items-center">
                      <p>I confirm my age is 18+ years</p>
                      <input
                        type="checkbox"
                        checked={ageConfirmed}
                        onChange={() => setAgeConfirmed(!ageConfirmed)}
                        className="w-5 h-5 accent-orange-500"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <p>I confirm my driving experience is above 1 year</p>
                      <input
                        type="checkbox"
                        checked={experienceConfirmed}
                        onChange={() => setExperienceConfirmed(!experienceConfirmed)}
                        className="w-5 h-5 accent-orange-500 mb-4 mt-4"
                      />
                    </div>
                  </div>

                </>
              )}
            </div>

            {/* TOTAL */}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="pl-32">₹{getGrandTotal()}</span>
                  {selectedDates?.start && selectedDates?.end && (
                    <p className="text-xs text-gray-500 mt-1">
                      (Includes ₹{depositAmount} refundable deposit)
                    </p>
                  )}
              </div>

              {step === 1 ? (
                <button
                  disabled={!selectedDates?.start}
                  className={`w-full mt-3 py-3 rounded-xl text-white ${
                    selectedDates?.start
                      ? "bg-orange-500"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  onClick={() => setStep(2)}
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleConfirmBooking}
                  disabled={
                    !userDetails.name ||
                    !userDetails.email ||
                    !userDetails.phone ||
                    !ageConfirmed ||
                    !experienceConfirmed
                  }
                  className={`w-full mt-3 py-3 rounded-xl text-white ${
                    userDetails.name &&
                    userDetails.email &&
                    userDetails.phone &&
                    ageConfirmed &&
                    experienceConfirmed
                      ? "bg-green-500"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Proceed to Payment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CALENDAR */}
        {showCalendar && (
          <CalendarModal
            car={car}
            onClose={() => setShowCalendar(false)}

            onSave={(start, end, pickupTime, dropTime) => {
              setCarDates(prev => ({
                ...prev,
                [car._id]: {
                  start,
                  end,
                  pickupTime,
                  dropTime
                }
              }));
              setShowCalendar(false);
            }}

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

            pickupTime={selectedDates?.pickupTime || "8:00 AM"}
            dropTime={selectedDates?.dropTime || "8:00 AM"}

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

        {showDetails && (
          <div className="absolute inset-0 flex items-center justify-center z-50">

            {/* OVERLAY INSIDE MODAL */}
            <div
              className="absolute inset-0 bg-black/40 rounded-3xl"
              onClick={() => setShowDetails(false)}
            />

            {/* POPUP */}
            <div className="relative bg-white w-[500px] max-w-[90%] h-[600px] rounded-2xl p-6 shadow-xl transition-all duration-300 scale-95 opacity-0 animate-[fadeIn_0.3s_forwards]">

              {/* TITLE */}
              <h2 className="text-[26px] font-bold text-center mb-2">
                {car.name}
              </h2>

              <hr className="mb-3" />

              {/* DETAILS GRID */}
              <div className="grid grid-cols-2 gap-y-2 text-sm">

                <p className="text-gray-500">Model</p>
                <p className="text-right">{car.model || car.name}</p>

                <p className="text-gray-500">Brand</p>
                <p className="text-right">{car.brand}</p>

                <p className="text-gray-500">Class</p>
                <p className="text-right">{car.type}</p>

                <p className="text-gray-500">Body type</p>
                <p className="text-right">{car.bodyType}</p>

                <p className="text-gray-500">Transmission</p>
                <p className="text-right">{car.transmission}</p>

                <p className="text-gray-500">Year</p>
                <p className="text-right">{car.year}</p>

                <p className="text-gray-500">Color</p>
                <p className="text-right">{car.color}</p>

                <p className="text-gray-500">Engine capacity</p>
                <p className="text-right">{car.engineCapacity}</p>

                <p className="text-gray-500">Drive type</p>
                <p className="text-right">{car.driveType}</p>

                <p className="text-gray-500">Horsepower</p>
                <p className="text-right">{car.horsepower}</p>

                <p className="text-gray-500">0-100 km/h</p>
                <p className="text-right">{car.acceleration}</p>

                <p className="text-gray-500">Max. speed</p>
                <p className="text-right">{car.maxSpeed}</p>

                <p className="text-gray-500">Seats</p>
                <p className="text-right">{car.seats}</p>

                <p className="text-gray-500">Doors</p>
                <p className="text-right">{car.doors}</p>

                <p className="text-gray-500">Mileage</p>
                <p className="text-right">{car.mileage} km</p>

                <p className="text-gray-500">Price</p>
                <p className="text-right font-semibold text-orange-600">₹{car.pricePerDay}/day</p>

              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setShowDetails(false)}
                className="w-full mt-3 bg-orange-400 py-3 rounded-xl hover:bg-orange-500"
              >
                Close
              </button>

            </div>
          </div>
        )}
        
        {showInsuranceInfo && (
          <div className="absolute inset-0 flex items-center justify-center z-50">

            {/* OVERLAY */}
            <div
              className="absolute inset-0 bg-black/40 rounded-3xl"
              onClick={() => setShowInsuranceInfo(false)}
            />

            {/* POPUP */}
            <div className="relative bg-white w-[520px] max-w-[90%] rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">

              {/* ❌ CLOSE ICON */}
              <button
                onClick={() => setShowInsuranceInfo(false)}
                className="absolute top-4 right-4 text-gray-500 text-[22px] hover:text-black"
              >
                ✕
              </button>

              {/* TITLE */}
              <h2 className="text-xl font-bold mb-1">
                Comprehensive insurance
              </h2>

              <p className="text-gray-500 mb-3">
                Excess amount of <span className="font-semibold text-black">₹3000–₹5000</span>
              </p>

              <hr className="mb-4" />

              {/* CONTENT */}
              <div className="text-sm text-gray-700 space-y-4 leading-relaxed">

                {/* SECTION 1 */}
                <div>
                  <p className="font-semibold mb-2 text-black">What is NOT covered</p>

                  <div className="space-y-2">

                    <div className="flex gap-2">
                      <span>•</span>
                      <p>Damage to tires, rims, hubcaps, antennas, and windows.</p>
                    </div>

                    <div className="flex gap-2">
                      <span>•</span>
                      <p>Damage caused while driving off-road, towing, racing, or illegal driving damage.</p>
                    </div>

                    <div className="flex gap-2">
                      <span className="text-red-500">•</span>
                      <p className="font-medium text-red-600">
                        Driving under alcohol or drugs voids insurance.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span>•</span>
                      <p>Personal belongings are not covered.</p>
                    </div>

                  </div>
                </div>

                {/* SECTION 2 */}
                <div>
                  <p className="font-semibold mb-2 text-black">In case of an accident</p>

                  <div className="space-y-2">

                    <div className="flex gap-2">
                      <span className="text-orange-500">•</span>
                      <p className="font-medium">
                        Police report is mandatory
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span>•</span>
                      <p>
                        <span className="font-semibold text-green-600">Green report (not at fault)</span> — you pay nothing
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span>•</span>
                      <p>
                        <span className="font-semibold text-red-600">Red report (at fault)</span> — pay approx ₹5000 + excess fee
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span className="text-red-500">•</span>
                      <p className="font-medium text-red-600">
                        Without a police report, all expenses are borne by the renter
                      </p>
                    </div>

                  </div>
                </div>

                {/* SECTION 3 */}
                <div>
                  <p className="font-semibold mb-2 text-black">Basic coverage</p>

                  <div className="flex gap-2">
                    <span>•</span>
                    <p>Basic insurance (Third-party liability) is included.</p>
                  </div>
                </div>

                {/* SECTION 4 */}
                <div>
                  <p className="font-semibold mb-2 text-black">Excess (if at fault)</p>

                  <div className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <p className="font-medium">
                      ₹3000–₹5000 + a possible additional fee for the vehicle's downtime + percentage % of the damage cost.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {showDocs && (
          <div className="absolute inset-0 flex items-center justify-center z-50">

            {/* OVERLAY */}
            <div
              className="absolute inset-0 bg-black/40 rounded-3xl"
              onClick={() => setShowDocs(false)}
            />

            {/* POPUP */}
            <div className="relative bg-white w-[520px] max-w-[90%] rounded-3xl p-6 shadow-xl max-h-[80vh] overflow-y-auto">

              {/* CLOSE */}
              <button
                onClick={() => setShowDocs(false)}
                className="absolute top-4 right-4 text-[22px] text-gray-500 hover:text-black"
              >
                ✕
              </button>

              {/* TITLE */}
              <h2 className="text-[24px] font-bold mb-2 -mt-2">
                Required documents
              </h2>

              <hr className="mb-4" />

              <p className="text-sm text-gray-600 mb-4">
                You can rent a car in India only if you carry original copies of the following documents:
              </p>

              {/* RESIDENTS */}
              <div className="mb-4">
                <p className="font-semibold mb-2">For Indian residents</p>

                <div className="space-y-2 text-sm text-gray-700">

                  <div className="flex gap-2">
                    <span>•</span>
                    <p>Valid Driving License</p>
                  </div>

                  <div className="flex gap-2">
                    <span>•</span>
                    <p>Aadhaar Card / Government ID</p>
                  </div>

                  <div className="flex gap-2">
                    <span>•</span>
                    <p>PAN Card (for verification)</p>
                  </div>

                </div>
              </div>

              {/* TOURISTS */}
              <div className="mb-4">
                <p className="font-semibold mb-2">For international tourists</p>

                <div className="space-y-2 text-sm text-gray-700">

                  <div className="flex gap-2">
                    <span>•</span>
                    <p>Passport</p>
                  </div>

                  <div className="flex gap-2">
                    <span>•</span>
                    <p>Valid Visa</p>
                  </div>

                  <div className="flex gap-2">
                    <span>•</span>
                    <p>International Driving Permit (IDP)</p>
                  </div>

                  <div className="flex gap-2">
                    <span>•</span>
                    <p>Home Country Driving License</p>
                  </div>

                </div>
              </div>

              {/* INFO BOX */}
              <div className="bg-gray-100 rounded-xl p-3 text-sm text-gray-700">
                Visitors from certain countries may be allowed to drive using their home country license, 
                but carrying an IDP is strongly recommended.
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingModal;