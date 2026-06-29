import carImage from "../assets/car_ready.png";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

export default function GetStartedCTA() {
  return (
    <div className="py-0 mt-0 mb-8 bg-white flex justify-center">

      {/* 🔵 BLUE CONTAINER */}
      <div className="w-full mx-auto px-3 relative max-w-6xl">

        {/* 🟠 ORANGE BOX */}
        <div className="
          bg-gradient-to-r from-orange-500 to-orange-600
          rounded-3xl
          px-10 md:px-14
          py-12 md:py-12
          w-full md:w-[75%]
          flex items-center
          relative overflow-visible
        ">

          {/* TEXT */}
          <div className="text-white max-w-md z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Ready To Get Started?
            </h2>

            <p className="text-base opacity-90 mb-6">
              Book your perfect car today and enjoy a seamless 
              rental experience with comfort and convenience.
            </p>

            <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2
                    bg-white text-orange-600
                    px-6 py-2.5 rounded-lg
                    font-semibold text-base
                    hover:scale-105 hover:shadow-lg
                    transition"
            >
                <Phone size={18} className="inline-block" />
                <span className="inline-block">Contact Us</span>
            </Link>
          </div>

          {/* 🚗 CAR IMAGE (OVERFLOW MAGIC) */}
          <div className="
            absolute right-[-180px] md:right-[-330px]
            top-1/2 -translate-y-1/2
          ">
            <img
              src={carImage}
              alt="car"
              className="
                w-[380px] md:w-[750px]   /* 🔥 INCREASE SIZE */
                object-contain
                drop-shadow-[0_0_80px_rgba(255,90,0,0.9)]  
                hover:scale-105 transition duration-300
              "
            />
          </div>

        </div>

      </div>
    </div>
  );
}