import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function TermsOfServicePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#fff8f2] text-[#2b0d00]">

      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden pt-24 pb-10 border-b border-orange-300 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 px-6 py-20">

        {/* GLOW */}
        <div className="absolute top-0 left-1/2 h-[280px] w-[500px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">

          {/* BADGE */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3 shadow-2xl animate-pulse">

            <span className="material-symbols-outlined text-white text-[20px]">
              gavel
            </span>

            <span className="text-sm font-black text-white tracking-[2px] uppercase">
              RentalEase Terms Of Service
            </span>
          </div>

          {/* TITLE */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-white drop-shadow-2xl">
            Terms & Conditions
          </h1>

          {/* SUBTITLE */}
          <p className="mt-6 text-xl text-orange-50 leading-9 max-w-3xl mx-auto">
            Please read these terms carefully before using RentalEase. By accessing our platform, you agree to comply with all policies, conditions, and rental guidelines.
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

          {/* INTRO */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">

            <div className="flex items-center gap-4 mb-5">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  description
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Acceptance Of Terms
                </h2>

                <p className="text-gray-500 mt-1">
                  Understanding your agreement with RentalEase.
                </p>
              </div>
            </div>

            <p className="text-gray-700 text-justify leading-8">
              By accessing or using RentalEase, you confirm that you have read, understood, and agreed to these Terms of Service. If you do not agree with any part of these terms, you should discontinue use of the platform immediately.
            </p>
          </div>

          {/* USER RESPONSIBILITIES */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  verified_user
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  User Responsibilities
                </h2>

                <p className="text-gray-500 mt-1">
                  Maintaining safe and lawful platform usage.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-10">

              {[
                "Provide accurate registration and booking information",
                "Maintain valid driving documents and licenses",
                "Use rented vehicles responsibly and legally",
                "Avoid fraudulent, harmful, or abusive activities",
                "Respect rental timelines and payment obligations",
                "Ensure account credentials remain secure",
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

          {/* BOOKINGS */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">

            <div className="flex items-center gap-4 mb-5">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  directions_car
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Vehicle Booking Policies
                </h2>

                <p className="text-gray-500 mt-1">
                  Rules related to rentals, cancellations, and usage.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 text-justify leading-8">

              <p>
                RentalEase allows users to browse and book vehicles listed on the platform based on availability, location, and rental duration.
              </p>

              <p>
                Users are responsible for returning vehicles in proper condition and within the agreed rental period. Additional charges may apply for damages, late returns, or policy violations.
                Cancellation and refund policies may vary depending on the booking type and vehicle provider.
              </p>
            </div>
          </div>

          {/* PAYMENTS */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">

            <div className="flex items-center gap-4 mb-5">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  payments
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Payments & Billing
                </h2>

                <p className="text-gray-500 mt-1">
                  Secure transactions and transparent pricing.
                </p>
              </div>
            </div>

            <p className="text-gray-700 text-justify leading-8">
              All bookings made through RentalEase are subject to applicable rental charges, taxes, security deposits, and service fees. Users agree to provide valid payment details and authorize transactions associated with bookings.
            </p>
          </div>

          {/* ACCOUNT */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">

            <div className="flex items-center gap-4 mb-5">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  manage_accounts
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Account Suspension & Termination
                </h2>

                <p className="text-gray-500 mt-1">
                  Protecting platform integrity and safety.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 text-justify leading-8">

              <p>
                RentalEase reserves the right to suspend or terminate user accounts involved in fraudulent activity, repeated policy violations, abusive behavior, or misuse of the platform.
              </p>

              <p>
                Users may also request account deletion by contacting customer support.
              </p>
            </div>
          </div>

          {/* LIABILITY */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">

            <div className="flex items-center gap-4 mb-5">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  warning
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Limitation Of Liability
                </h2>

                <p className="text-gray-500 mt-1">
                  Important legal limitations and disclaimers.
                </p>
              </div>
            </div>

            <p className="text-gray-700 text-justify leading-8">
              RentalEase shall not be held responsible for indirect losses, accidents, delays, or damages resulting from misuse of rented vehicles, third-party service interruptions, or unforeseen technical issues.
            </p>
          </div>

          {/* MODIFICATIONS */}
          <div className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-sm">

            <div className="flex items-center gap-4 mb-5">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-[28px]">
                  edit_document
                </span>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Changes To Terms
                </h2>

                <p className="text-gray-500 mt-1">
                  Keeping users informed about policy updates.
                </p>
              </div>
            </div>

            <p className="text-gray-700 text-justify leading-8">
              RentalEase may update or revise these Terms of Service periodically. Continued use of the platform after updates indicates acceptance of the revised terms.
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
                    Need Assistance?
                  </h2>
                </div>

                <p className="max-w-2xl text-orange-50 leading-8 text-lg">
                  If you have questions regarding our terms, bookings, or account policies, our RentalEase support team is always here to help.
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
