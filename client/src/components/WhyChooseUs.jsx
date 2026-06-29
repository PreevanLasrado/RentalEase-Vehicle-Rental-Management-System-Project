import { ShieldCheck, MapPin, DollarSign, Star, Car, Headphones } from "lucide-react";
import carImage from "../assets/car_whychooseus.png";

export default function WhyChooseUs() {
  return (
    <div className="py-4 mb-0 bg-gray-100">
      
      <div className="grid md:grid-cols-2 items-center">
        
        {/* 🚗 Left Image */}
        <div className="w-full">
            <img
                src={carImage}
                alt="car"
                className="
                w-60% h-60% object-contain

                transition duration-500 ease-in-out
                hover:scale-110

                drop-shadow-[0_20px_30px_rgba(255,140,0,0.35)]
                hover:drop-shadow-[0_30px_50px_rgba(255,140,0,0.6)]
                "
            />
        </div>

        {/* 📋 Right Content */}
        <div className="w-full text-left">
          <h2 className="text-[45px] font-black mb-2">
            Why Choose <span className="text-orange-500">Us</span>?
          </h2>

          <p className="text-gray-500 mx-auto mb-4 text-lg">
            We offer the best car rental experience with top-quality vehicles, 
            affordable <br></br>pricing, and excellent customer support.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-10 justify-start">

            {/* Item */}
            <div className="flex gap-5 items-start p-4 rounded-xl">
                <ShieldCheck size={40} className="text-orange-500" />
                <div>
                <h4 className="font-semibold text-[20px]">Customer Support</h4>
                <p className="text-base text-gray-500">24/7 support for all customers</p>
                </div>
            </div>

            <div className="flex gap-5 items-start p-4 rounded-xl">
                <MapPin size={40} className="text-orange-500" />
                <div>
                <h4 className="font-semibold text-[20px]">Many Locations</h4>
                <p className="text-base text-gray-500">Available in multiple cities</p>
                </div>
            </div>

            <div className="flex gap-5 items-start p-4 rounded-xl">
                <DollarSign size={40} className="text-orange-500" />
                <div>
                <h4 className="font-semibold text-[20px]">Best Price</h4>
                <p className="text-base text-gray-500">Affordable pricing guaranteed</p>
                </div>
            </div>

            <div className="flex gap-5 items-start p-4 rounded-xl">
                <Star size={40} className="text-orange-500" />
                <div>
                <h4 className="font-semibold text-[20px]">Experience Driver</h4>
                <p className="text-base text-gray-500">Professional drivers available</p>
                </div>
            </div>

            <div className="flex gap-5 items-start p-4 rounded-xl">
                <Car size={40} className="text-orange-500" />
                <div>
                <h4 className="font-semibold text-[20px]">Verified Cars</h4>
                <p className="text-base text-gray-500">All cars are quality checked</p>
                </div>
            </div>

            <div className="flex gap-5 items-start p-4 rounded-xl">
                <Headphones size={40} className="text-orange-500" />
                <div>
                <h4 className="font-semibold text-[20px]">Free Consultation</h4>
                <p className="text-base text-gray-500">Expert guidance anytime</p>
                </div>
            </div>

            </div>
        </div>
      </div>
    </div>
  );
}