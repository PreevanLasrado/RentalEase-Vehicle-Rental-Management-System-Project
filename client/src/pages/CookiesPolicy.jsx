import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function CookiesPolicyPage() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fff8f2] text-[#2b0d00]">

      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden pt-24 pb-10 border-b border-orange-300 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 px-6 py-20">

        <div className="absolute top-0 left-1/2 h-[280px] w-[500px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">

          {/* BADGE */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3 shadow-2xl animate-pulse">

            <span className="material-symbols-outlined text-white text-[20px]">
              cookie
            </span>

            <span className="text-sm font-black text-white tracking-[2px] uppercase">
              RentalEase Cookies Policy
            </span>
          </div>

          {/* TITLE */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-white drop-shadow-2xl">
            Cookies Policy
          </h1>

          {/* SUBTITLE */}
          <p className="mt-6 text-xl text-orange-50 leading-9 max-w-3xl mx-auto">
            Learn how RentalEase uses cookies and tracking technologies to improve your browsing experience, personalize services, and keep the platform secure.
          </p>

          {/* UPDATED */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-4 py-3 border border-white/20 shadow-2xl">

            <span className="material-symbols-outlined text-black">
              calendar_month
            </span>

            <p className="font-bold text-black">
              Last Updated: January 2026
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 py-16 -mt-8 -mb-8">

        <div className="mx-auto max-w-5xl space-y-5">

          {/* WHAT ARE COOKIES */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">

            <div className="flex items-center gap-4 mb-5">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  info
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  What Are Cookies?
                </h2>

                <p className="text-gray-500 mt-1">
                  Understanding how cookies work on RentalEase.
                </p>
              </div>
            </div>

            <p className="text-gray-700 text-justify leading-8">
              Cookies are small text files stored on your device when you visit a website. They help websites remember user preferences, improve performance, analyze traffic, and provide a more personalized browsing experience.
            </p>
          </div>

          {/* HOW WE USE */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">

            <div className="flex items-center gap-4 mb-2">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  settings
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  How RentalEase Uses Cookies
                </h2>

                <p className="text-gray-500 mt-1">
                  Enhancing performance, security, and personalization.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-10">

              {[
                "Remember login sessions and user preferences",
                "Improve website speed and performance",
                "Analyze traffic and platform usage",
                "Provide personalized rental recommendations",
                "Maintain account security and fraud prevention",
                "Enhance booking and payment experiences",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 -mt-8 rounded-2xl border border-orange-100 bg-orange-50/50 p-5"
                >
                  <div className="mt-2 h-3 w-3 rounded-full bg-orange-500" />

                  <p className="text-gray-700 font-medium leading-7 -mb-4">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TYPES */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">

            <div className="flex items-center gap-4 mb-5">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  category
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Types Of Cookies We Use
                </h2>

                <p className="text-gray-500 mt-1">
                  Different cookies used across the platform.
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-2">

              {[
                {
                  title: "Essential Cookies",
                  desc: "Required for core website functionality such as authentication, bookings, and secure navigation.",
                },
                {
                  title: "Performance Cookies",
                  desc: "Help us understand user behavior and improve speed, responsiveness, and usability.",
                },
                {
                  title: "Analytics Cookies",
                  desc: "Allow us to analyze traffic and understand how visitors interact with RentalEase.",
                },
                {
                  title: "Preference Cookies",
                  desc: "Remember your selected language, location, and browsing preferences.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-3xl p-6 pt-4"
                >
                  <h3 className="text-2xl font-black text-[#2b0d00]">
                    {item.title}
                  </h3>

                  <p className="mt-1 -mb-7 text-gray-700 text-justify leading-8">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* THIRD PARTY */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">

            <div className="flex items-center gap-4 mb-5">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  public
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Third-Party Cookies
                </h2>

                <p className="text-gray-500 mt-1">
                  Services integrated with RentalEase.
                </p>
              </div>
            </div>

            <p className="text-gray-700 text-justify leading-8">
              RentalEase may use trusted third-party services such as analytics providers, payment gateways, and advertising platforms that may place cookies on your device to support functionality and improve services.
            </p>
          </div>

          {/* MANAGE */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">

            <div className="flex items-center gap-4 mb-5">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  tune
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Managing Your Cookie Preferences
                </h2>

                <p className="text-gray-500 mt-1">
                  Control how cookies are used on your device.
                </p>
              </div>
            </div>

            <p className="text-gray-700 text-justify leading-8">
              Most web browsers allow users to control or disable cookies through browser settings. Please note that disabling certain cookies may affect the functionality and performance of RentalEase.
            </p>
          </div>

          {/* SUPPORT CARD */}
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-orange-500 to-orange-400 p-10 text-white shadow-2xl shadow-orange-500/20 mb-2">

            <div className="absolute right-0 top-0 h-full w-[300px] bg-white/10 blur-3xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

              <div>

                <div className="flex items-center gap-3 mb-4">

                  <span className="material-symbols-outlined text-[34px]">
                    support_agent
                  </span>

                  <h2 className="text-4xl font-black">
                    Questions About Cookies?
                  </h2>
                </div>

                <p className="max-w-2xl text-orange-50 leading-8 text-lg">
                  If you have questions regarding how RentalEase uses cookies or manages user data, our support team is always ready to help.
                </p>
              </div>

              <button
                onClick={() => {
                  navigate("/contact");

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="h-14 whitespace-nowrap rounded-full bg-white px-4 text-lg font-black text-orange-500 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-orange-50"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
