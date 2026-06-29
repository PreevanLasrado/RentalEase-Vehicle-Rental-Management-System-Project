import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-[#050505] border-t border-white/10 overflow-hidden">

      {/* GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-orange-500/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-14 pb-8">

        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">

          {/* BRAND */}
          <div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">

                <span className="material-symbols-outlined text-white text-[26px]">
                  directions_car
                </span>

              </div>

              <div>

                <h1 className="text-3xl font-black text-white tracking-tight">
                  RentalEase
                </h1>

                <p className="text-orange-400 text-sm font-medium">
                  Premium Car Rentals
                </p>

              </div>
            </div>

            <p className="text-gray-400 leading-7 mt-6 text-justify text-[15px]">
              Experience luxury and comfort with India’s
              premium car rental platform. From affordable
              daily rides to luxury supercars — drive your dream anywhere in India.
            </p>

            {/* SOCIALS */}
            <div className="flex items-center gap-4 mt-7">

              <button className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#1877F2] hover:border-[#1877F2] hover:scale-110 transition-all duration-300 flex items-center justify-center text-gray-300 hover:text-white">
                <FaFacebookF size={18} />
              </button>

              <button className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#E4405F] hover:border-[#E4405F] hover:scale-110 transition-all duration-300 flex items-center justify-center text-gray-300 hover:text-white">
                <FaInstagram size={18} />
              </button>

              <button className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:border-white hover:text-black hover:scale-110 transition-all duration-300 flex items-center justify-center text-gray-300">
                <FaXTwitter size={18} />
              </button>

              <button className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:scale-110 transition-all duration-300 flex items-center justify-center text-gray-300 hover:text-white">
                <FaLinkedinIn size={18} />
              </button>
            </div>

          </div>

          {/* QUICK LINKS */}
          <div>

            <h2 className="text-white font-black text-xl mb-6">
              Quick Links
            </h2>

            <div className="space-y-4">

              {[
                {
                  name: "Home",
                  path: "/",
                },

                {
                  name: "Rental Deals",
                  path: "/rentals",
                },

                {
                  name: "Our Plans",
                  path: "/pricing",
                },

                {
                  name: "About Us",
                  path: "/about",
                },

                {
                  name: "Contact Us",
                  path: "/contact",
                },
              ].map((item) => (

                <Link
                  key={item.name}
                  to={item.path}
                  className="group flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-all duration-300"
                >

                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-all"
                  />

                  {item.name}

                </Link>
              ))}
            </div>
          </div>

          {/* SERVICES */}
          <div>

            <h2 className="text-white font-black text-xl mb-6">
              Services
            </h2>

            <div className="space-y-4 text-gray-400">

              <p className="hover:text-orange-400 cursor-pointer transition-all">
                Premium Car Rentals
              </p>

              <p className="hover:text-orange-400 cursor-pointer transition-all">
                Multiple Locations
              </p>

              <p className="hover:text-orange-400 cursor-pointer transition-all">
                Flexible Timing
              </p>

              <p className="hover:text-orange-400 cursor-pointer transition-all">
                Secure Booking
              </p>

              <p className="hover:text-orange-400 cursor-pointer transition-all">
                24/7 Support
              </p>

            </div>
          </div>

          {/* CONTACT */}
          <div>

            <h2 className="text-white font-black text-xl mb-6">
              Contact Us
            </h2>

            <div className="space-y-5">

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Mail size={18} />
                </div>

                <div>
                  <p className="text-white font-semibold">
                    Email
                  </p>

                  <p className="text-gray-400 text-sm mt-1">
                    team@rentalease.in
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Phone size={18} />
                </div>

                <div>
                  <p className="text-white font-semibold">
                    Phone
                  </p>

                  <p className="text-gray-400 text-sm mt-1">
                    +91 12345 67890
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-white font-semibold">
                    Location
                  </p>

                  <p className="text-gray-400 text-sm mt-1">
                    Bangalore, India
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-5">

          <p className="text-gray-500 text-sm text-center md:text-left">
            © 2026 RentalEase. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">

            <Link
              to="/privacy-policy"
              className="hover:text-orange-400 transition-all"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms-of-service"
              className="hover:text-orange-400 transition-all"
            >
              Terms of Service
            </Link>

            <Link
              to="/cookies"
              className="hover:text-orange-400 transition-all"
            >
              Cookies
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;