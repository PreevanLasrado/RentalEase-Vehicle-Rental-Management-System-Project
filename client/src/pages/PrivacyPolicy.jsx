import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#fff8f2] text-[#2b0d00]">

      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden pt-24 pb-10 border-b border-orange-300 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 px-6 py-20">
        <div className="absolute top-0 left-1/2 h-[280px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3 shadow-2xl animate-pulse">
            <span className="material-symbols-outlined text-white text-[20px]">
              shield
            </span>

            <span className="text-sm font-black text-white tracking-[2px] uppercase">
              RentalEase Privacy Policy
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-white drop-shadow-2xl">
            Your Privacy Matters
          </h1>

          <p className="mt-6 text-xl text-orange-50 leading-9 max-w-3xl mx-auto">
            At RentalEase, we are committed to protecting your personal information and ensuring complete transparency about how your data is collected, used, and stored.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-4 py-3 border border-white/20 shadow-2xl">
            <span className="material-symbols-outlined text-black">
              calendar_month
            </span>

            <p className="font-semibold text-black">
              Last Updated: January 2026
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 py-16 -mt-8 -mb-8">
        <div className="mx-auto max-w-5xl space-y-5">

          {/* SECTION */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  info
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Information We Collect
                </h2>

                <p className="text-gray-500 mt-1">
                  Data collected to provide secure and seamless rentals.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 text-justify leading-8">
              <p>
                RentalEase may collect personal details such as your full name, email address, phone number, billing information, driving license details, and booking preferences when you use our platform.
              </p>

              <p>
                We also collect technical information including browser type, IP address, device information, and usage activity to improve user experience and maintain platform security.
              </p>
            </div>
          </div>

          {/* SECTION */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  lock
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  How We Use Your Information
                </h2>

                <p className="text-gray-500 mt-1">
                  Ensuring secure transactions and better customer experience.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-10">

              {[
                "Process vehicle bookings and payments",
                "Verify customer identity and eligibility",
                "Improve website functionality and security",
                "Provide customer support and notifications",
                "Prevent fraudulent or unauthorized activity",
                "Offer personalized recommendations and deals",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 -mt-8 rounded-2xl p-5"
                >
                  <div className="mt-2 h-3 w-3 rounded-full bg-orange-500" />

                  <p className="text-gray-700 font-medium leading-7 -mb-4">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  security
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Data Protection & Security
                </h2>

                <p className="text-gray-500 mt-1">
                  Protecting your information with advanced security measures.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 text-justify leading-8">
              <p>
                RentalEase uses industry-standard security technologies and encrypted systems to protect your personal information against unauthorized access, disclosure, or misuse.
              </p>

              <p>
                While we strive to maintain complete security, users are also encouraged to keep their account credentials confidential and avoid sharing login information with others.
              </p>
            </div>
          </div>

          {/* SECTION */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  cookie
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Cookies & Tracking Technologies
                </h2>

                <p className="text-gray-500 mt-1">
                  Enhancing website performance and personalization.
                </p>
              </div>
            </div>

            <p className="text-gray-700 text-justify leading-8">
              RentalEase may use cookies and analytics tools to understand user activity, remember preferences, and improve website functionality. By continuing to use our platform, you consent to our use of cookies.
            </p>
          </div>

          {/* SECTION */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  handshake
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Third-Party Services
                </h2>

                <p className="text-gray-500 mt-1">
                  Trusted services used for secure payments and operations.
                </p>
              </div>
            </div>

            <p className="text-gray-700 text-justify leading-8">
              We may work with trusted third-party providers for payment processing, analytics, customer communication, and technical services. These providers only receive the information necessary to perform their services securely.
            </p>
          </div>

          {/* SECTION */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  gavel
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Your Rights
                </h2>

                <p className="text-gray-500 mt-1">
                  Giving you full control over your personal information.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 text-justify leading-8">
              <p>
                You may request access, correction, or deletion of your personal information by contacting RentalEase support.
                Users may also choose to unsubscribe from promotional communications at any time through account settings or email preferences.
              </p>
            </div>
          </div>

          {/* CONTACT CARD */}
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-orange-500 to-orange-400 p-10 text-white shadow-2xl shadow-orange-500/20">
            <div className="absolute right-0 top-0 h-full w-[300px] bg-white/10 blur-3xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-[34px]">
                    support_agent
                  </span>

                  <h2 className="text-4xl font-black">
                    Need Help?
                  </h2>
                </div>

                <p className="max-w-2xl text-orange-50 leading-8 text-lg">
                  If you have any questions regarding our privacy policy or how your information is handled, feel free to contact the RentalEase support team anytime.
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
