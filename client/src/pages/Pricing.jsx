import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle  } from "react-icons/fa";
import { MdOutlineStarPurple500 } from "react-icons/md";
import FAQ from "../components/FAQ";
const API_URL = "http://localhost:5000/api";

const plansData = {
  monthly: [
    {
      name: "Basic",
      price: 0,
      features: [
        "Browse available cars",
        "View car details & images",
        "Basic booking functionality",
        "Email support (48h response)",
        "Limited availability access",
      ],
    },
    {
      name: "Standard",
      price: 199,
      features: [
        "Unlimited bookings",
        "Access to premium cars",
        "Priority email support (24h)",
        "Booking history tracking",
        "Basic usage analytics",
        "Cancel & reschedule bookings",
      ],
    },
    {
      name: "Premium",
      price: 499,
      features: [
        "Unlimited bookings (no restrictions)",
        "Access to luxury & exclusive cars",
        "Dedicated customer assistant",
        "Instant priority support",
        "Advanced analytics dashboard",
        "Early access to new vehicles",
        "Custom booking preferences",
      ],
    },
  ],

  annual: [
    {
      name: "Basic",
      price: 0,
      features: [
        "Browse available cars",
        "View car details & images",
        "Basic booking functionality",
        "Email support (48h response)",
        "Limited availability access",
      ],
    },
    {
      name: "Standard",
      price: 199 * 12,
      features: [
        "Unlimited bookings",
        "Access to premium cars",
        "Priority email support (24h)",
        "Booking history tracking",
        "Basic usage analytics",
        "Cancel & reschedule bookings",
      ],
    },
    {
      name: "Premium",
      price: 499 * 12,
      features: [
        "Unlimited bookings (no restrictions)",
        "Access to luxury & exclusive cars",
        "Dedicated customer assistant",
        "Instant priority support",
        "Advanced analytics dashboard",
        "Early access to new vehicles",
        "Custom booking preferences",
      ],
    },
  ],
};

function Pricing() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");
  const [currentPlan, setCurrentPlan] = useState("Basic");
  const [timeLeft, setTimeLeft] = useState("");

  const plans = plansData[billing];
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [isPaying, setIsPaying] = useState(false);
  const [showFullScreenSuccess, setShowFullScreenSuccess] = useState(false);

  const getDiscountedPrice = (price, isAnnual) =>
    isAnnual ? Math.round(price * 0.8) : price;

  useEffect(() => {
    const fetchPlan = async () => {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token); // 🔥 debug

      if (!token) {
        setCurrentPlan("Basic");
        setTimeLeft("");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/plans/current`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          setCurrentPlan("Basic");
          return;
        }

        const data = await res.json();

        // 🔥 UPDATE LOCAL USER DATA
        const storedUser = JSON.parse(
          localStorage.getItem("user")
        );

        if (storedUser) {

          storedUser.currentPlan = data.planName;

          localStorage.setItem(
            "user",
            JSON.stringify(storedUser)
          );
        }

        setCurrentPlan(data.planName || "Basic");

        if (data.expiryDate) {
          startTimer(data.expiryDate);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchPlan();

  }, []);

  useEffect(() => {
    if (showModal) { 
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const startTimer = (expiry) => {
    const interval = setInterval(() => {
      const now = new Date();
      const expiryDate = new Date(expiry);
      const diff = expiryDate - now;

      if (diff <= 0) {
        setTimeLeft("");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-orange-50 text-gray-900 px-6 py-10 -mt-8">

      {/* 🔥 TITLE SECTION */}
      <div className="text-center mb-4 space-y-3">
        <h1 className="text-6xl font-black text-orange-500 tracking-tight">
          Choose Your Perfect Plan
        </h1>
        <p className="text-gray-600 text-[20px]">
          Unlock better rentals, smarter bookings, and premium experiences
        </p>
        <p className="text-[17px] text-gray-500">
          Upgrade anytime. Cancel anytime. No hidden charges.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex flex-col items-center mb-4 space-y-3">
        {/* 🔥 Sliding Toggle Pill */}
        <div className="relative w-56 h-12 bg-orange-200 rounded-full p-1 flex items-center shadow-inner overflow-hidden">

          {/* 🔥 Sliding Background */}
          <div
            className={`absolute top-1 left-1 h-10 w-[calc(50%-4px)] bg-orange-500 rounded-full shadow-md transition-all duration-300 ${
              billing === "annual" ? "translate-x-full" : "translate-x-0"
            }`}
          />

          {/* Monthly */}
          <button
            onClick={() => setBilling("monthly")}
            className={`w-1/2 z-10 text-[16px] font-semibold transition ${
              billing === "monthly"
                ? "text-white"
                : "text-orange-600"
            }`}
          >
            Monthly
          </button>

          {/* Annual */}
          <button
            onClick={() => setBilling("annual")}
            className={`w-1/2 z-10 text-[16px] font-semibold transition ${
              billing === "annual"
                ? "text-white"
                : "text-orange-600"
            }`}
          >
            Annual
          </button>
        </div>

        {/* 💰 Savings Text */}
        <p className="text-green-600 text-sm font-medium">
          Save up to 20% with annual plans
        </p>

      </div>
      
      {/* Current Plan */}
      <div className="text-center mb-8 space-y-2">
        <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-[16px] inline-block shadow-md">
          Current Plan: {currentPlan}
        </div>

        {currentPlan !== "Basic" && timeLeft && (
          <div className="flex items-center justify-center gap-2 text-orange-600 text-[16px] animate-pulse">
            <FaHourglassHalf className="text-orange-500 animate-swing" />
            Plan expires in {timeLeft}
          </div>
        )}
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => {
          const isCurrent = currentPlan === plan.name;
          const isDowngradeBlocked =
            (currentPlan === "Premium" && plan.name !== "Premium") ||
            (currentPlan === "Standard" && plan.name === "Basic");

          const isBasicAlwaysDisabled = plan.name === "Basic";

          return (
            <div
              key={index}
              className={`relative bg-white rounded-3xl p-6 transform transition duration-300 hover:scale-110 hover:-translate-y-2 shadow-[0_0_25px_rgba(255,115,0,0.3)] ${
                isCurrent ? "border-4 border-orange-500 shadow-[0_0_35px_rgba(255,115,0,0.6)]" : ""
              }`}
            >
              {/* Most Popular */}
              {plan.name === "Standard" && (
                <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 text-xs rounded-bl-xl rounded-tr-[18px]">
                  Most Popular
                </div>
              )}

              {billing === "annual" && plan.price > 0 && (
                <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 text-xs rounded-br-xl rounded-tl-[18px]">
                  20% OFF
                </div>
              )}

              <h2 className="text-xl font-bold mb-2 text-center">
                {plan.name}
              </h2>

              {(() => {
                const isAnnual = billing === "annual";
                const originalPrice = plan.price;
                const discountedPrice = getDiscountedPrice(plan.price, isAnnual);

                return (
                  <div className="text-center mb-4">

                    {/* 🔥 Discounted Price */}
                    <p className="text-4xl font-bold text-orange-600">
                      ₹{discountedPrice.toLocaleString()}
                      <span className="text-sm font-normal text-gray-600">
                        /{billing === "monthly" ? "mo" : "yr"}
                      </span>
                    </p>

                    {/* ❌ Original Price (only annual & paid plans) */}
                    {isAnnual && originalPrice > 0 && (
                      <p className="text-gray-400 line-through text-[20px]">
                        ₹{originalPrice.toLocaleString()}
                      </p>
                    )}

                    {/* 💰 Savings */}
                    {isAnnual && originalPrice > 0 && (
                      <p className="text-green-600 text-[14px] font-medium">
                        Save ₹{(originalPrice - discountedPrice).toLocaleString()}
                      </p>
                    )}
                  </div>
                );
              })()}

              <button
                onClick={() => {
                  if (isDowngradeBlocked || isBasicAlwaysDisabled) return;

                  const token = localStorage.getItem("token");

                  if (!token) {
                    localStorage.setItem("redirectAfterLogin", "/pricing"); // 🔥 SAVE INTENT
                    navigate("/login");
                    return;
                  }

                  setSelectedPlan(plan);
                  setShowModal(true);
                }}
                disabled={isCurrent || isDowngradeBlocked || isBasicAlwaysDisabled}
                className={`w-full py-2 rounded-lg font-semibold mb-4 transition ${
                  isCurrent
                    ? "bg-gray-300 cursor-not-allowed"
                    : isDowngradeBlocked || isBasicAlwaysDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {isCurrent
                  ? "Current Plan"
                  : isBasicAlwaysDisabled
                  ? "Basic Plan"
                  : isDowngradeBlocked
                  ? "Not Available"
                  : "Upgrade"}
              </button>

              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FaCheckCircle className="text-orange-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="max-w-6xl mx-auto mt-16">

      {/* TITLE */}
      <h2 className="text-5xl font-black text-center mb-7 text-orange-500">
        Compare Plans
      </h2>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-3xl 
        shadow-[0_10px_30px_rgba(255,115,0,0.15)] 
        hover:shadow-[0_20px_50px_rgba(255,115,0,0.25)] 
        transition duration-300 border border-orange-200">

        <table className="w-full text-sm border-collapse">

          {/* HEADER */}
          <thead className="bg-orange-400 text-gray-800 text-[18px]">
            <tr>
              <th className="p-5 text-left font-semibold">Features</th>
              <th className="p-5 text-center font-semibold">Basic</th>
              <th className="p-5 text-center font-semibold">Standard</th>
              <th className="p-5 text-center font-semibold">Premium</th>
            </tr>
          </thead>

          <tbody>

            {/* ROW */}
            <tr className="border-t hover:bg-orange-50 transition duration-200">
              <td className="p-5 text-[18px]">Unlimited Bookings</td>

              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-red-100 p-2 rounded-full">
                    <FaTimesCircle className="text-red-500 text-lg" />
                  </div>
                </div>
              </td>

              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCheckCircle className="text-green-600 text-lg" />
                  </div>
                </div>
              </td>

              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCheckCircle className="text-green-600 text-lg" />
                  </div>
                </div>
              </td>
            </tr>

            {/* ROW */}
            <tr className="border-t hover:bg-orange-50 transition duration-200">
              <td className="p-5 text-[18px]">Premium Car Access</td>

              {/* Basic */}
              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-red-100 p-2 rounded-full">
                    <FaTimesCircle className="text-red-500 text-lg" />
                  </div>
                </div>
              </td>

              {/* Standard */}
              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCheckCircle className="text-green-600 text-lg" />
                  </div>
                </div>
              </td>

              {/* Premium */}
              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCheckCircle className="text-green-600 text-lg" />
                  </div>
                </div>
              </td>
            </tr>

            {/* ROW */}
            <tr className="border-t hover:bg-orange-50 transition duration-200">
              <td className="p-5 text-[18px]">Customer Support</td>

              {/* Basic */}
              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCheckCircle className="text-green-600 text-lg" />
                  </div>
                </div>
              </td>

              {/* Standard */}
              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCheckCircle className="text-green-600 text-lg" />
                  </div>
                </div>
              </td>

              {/* Premium */}
              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCheckCircle className="text-green-600 text-lg" />
                  </div>
                </div>
              </td>
            </tr>

            {/* ROW */}
            <tr className="border-t hover:bg-orange-50 transition duration-200">
              <td className="p-5 text-[18px]">Analytics Dashboard</td>

              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-red-100 p-2 rounded-full">
                    <FaTimesCircle className="text-red-500 text-lg" />
                  </div>
                </div>
              </td>

              <td className="p-5 text-center font-semibold text-black text-[16px]">
                Basic
              </td>

              <td className="p-5 text-center text-black font-semibold text-[16px]">
                Advanced
              </td>
            </tr>

            {/* ROW */}
            <tr className="border-t hover:bg-orange-50 transition duration-200">
              <td className="p-5 text-[18px]">Cancel & Reschedule</td>

              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-red-100 p-2 rounded-full">
                    <FaTimesCircle className="text-red-500 text-lg" />
                  </div>
                </div>
              </td>

              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCheckCircle className="text-green-600 text-lg" />
                  </div>
                </div>
              </td>

              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCheckCircle className="text-green-600 text-lg" />
                  </div>
                </div>
              </td>
            </tr>

            {/* ROW */}
            <tr className="border-t hover:bg-orange-50 transition duration-200">
              <td className="p-5 text-[18px]">Early Access to New Cars</td>

              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-red-100 p-2 rounded-full">
                    <FaTimesCircle className="text-red-500 text-lg" />
                  </div>
                </div>
              </td>

              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-red-100 p-2 rounded-full">
                    <FaTimesCircle className="text-red-500 text-lg" />
                  </div>
                </div>
              </td>

              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCheckCircle className="text-green-600 text-lg" />
                  </div>
                </div>
              </td>
            </tr>

            {/* ROW */}
            <tr className="border-t hover:bg-orange-50 transition duration-200">
              <td className="p-5 text-[18px]">Custom Booking Preferences</td>

              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-red-100 p-2 rounded-full">
                    <FaTimesCircle className="text-red-500 text-lg" />
                  </div>
                </div>
              </td>

              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-red-100 p-2 rounded-full">
                    <FaTimesCircle className="text-red-500 text-lg" />
                  </div>
                </div>
              </td>

              <td className="p-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCheckCircle className="text-green-600 text-lg" />
                  </div>
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>

    <FAQ />
      
      {/* 🔥 PAYMENT MODAL */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[450px] shadow-xl relative">

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">
              Confirm Plan Changes
            </h2>

            {(() => {
                const isAnnual = billing === "annual";
                const original = selectedPlan.price;
                const payable = getDiscountedPrice(original, isAnnual);

                const tax = Math.round(payable * 0.18);
                const total = payable + tax;

                return (
                  <>
                    {/* 🔥 YOUR EXISTING MODAL CONTENT HERE */}
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="font-semibold">
                          {selectedPlan.name} Plan
                        </p>
                        <p className="text-sm text-gray-500">
                          Billed {billing}, starting today
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-[18px]">
                          ₹{payable.toLocaleString()}
                        </p>

                        {isAnnual && original > 0 && (
                          <p className="text-gray-400 line-through text-[14px]">
                            ₹{original.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="flex justify-between text-sm mb-2">
                      <span>Subtotal</span>
                      <span>₹{payable.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm mb-2">
                      <span>Tax (18%)</span>
                      <span>₹{tax.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between font-bold text-lg mt-3">
                      <span>Total due today</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>

                    {/* 🔥 Buttons */}
                    <div className="flex justify-end gap-3 mt-3 -mb-2">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 rounded-3xl border bg-gray-200 hover:bg-gray-300"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={async () => {
                          try {
                            setIsPaying(true);

                            const token = localStorage.getItem("token");
                            if (!token) {
                              navigate("/login");
                              return;
                            }
                            const res = await fetch(`${API_URL}/plans/upgrade`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                planName: selectedPlan.name,
                                billingType: billing,
                                price: selectedPlan.price,
                              }),
                            });

                            const data = await res.json();

                            setCurrentPlan(data.planName);

                            if (data.expiryDate) {
                              startTimer(data.expiryDate);
                            }

                            setShowModal(false);
                            setShowFullScreenSuccess(true);

                            // setTimeout(() => {
                            //   setShowFullScreenSuccess(false);
                            //   // 🔥 REFRESH PAGE
                            //   window.location.reload();
                            // }, 2000);

                            setTimeout(() => {
                              setShowFullScreenSuccess(false);

                              // 🔥 UPDATE USER IN LOCAL STORAGE
                              const storedUser = JSON.parse(
                                localStorage.getItem("user")
                              );

                              if (storedUser) {

                                storedUser.currentPlan = data.planName;

                                localStorage.setItem(
                                  "user",
                                  JSON.stringify(storedUser)
                                );
                              }

                              // 🔥 RELOAD PROFILE PAGE INTERNALLY
                              window.dispatchEvent(
                                new Event("membershipUpdated")
                              );

                              // 🔥 REFRESH CURRENT PAGE
                              window.location.reload();

                            }, 2000);

                          } catch (err) {
                            console.error("Upgrade failed", err);
                          } finally {
                            setIsPaying(false);
                          }
                        }}
                        disabled={isPaying}
                        className={`px-4 py-2 rounded-3xl flex items-center justify-center gap-2 ${
                          isPaying
                            ? "bg-orange-400 cursor-not-allowed"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                      >
                        {isPaying ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          "Pay now"
                        )}
                      </button>
                    </div>
                  </>
                );
              })()}

          </div>
        </div>
      )}

      {/* 🔥 FULL SCREEN SUCCESS */}
      {showFullScreenSuccess && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">

          {/* Big Check */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-16 h-16 text-green-600"
              viewBox="0 0 52 52"
            >
              <circle
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l7 7 16-16"
                className="tick-path"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold">
            Payment Successful 🎉
          </h2>

          <p className="text-gray-600 mt-2 text-[16px]">
            Your plan has been upgraded
          </p>

        </div>
      )}

    </div>
  );
}

export default Pricing;