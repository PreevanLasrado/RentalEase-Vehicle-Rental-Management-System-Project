import { Car, MapPin, Clock, ShieldCheck, Users, Headphones } from "lucide-react";

export default function OurServices() {
  return (
    <div id="services" className="py-0 bg-gray-100 scroll-mt-28">

      {/* 🔥 Heading */}
      <div className="text-center mb-4">
        <h2 className="text-[45px] font-black mb-2">
          What{" "}
          <span className="text-orange-500">Services</span> We{" "}
          <span className="text-orange-500">Provide</span>?
        </h2>

        <p className="text-gray-500 mt-2 max-w-xl mx-auto text-base md:text-lg">
          Explore our wide range of services designed to make your car rental
          experience smooth and hassle-free.
        </p>
      </div>

      {/* 🔥 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 md:px-64">

        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition hover:-translate-y-1 w-full max-w-[340px] mx-auto border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Car size={26} className="text-orange-500" />
            <h3 className="text-[20px] font-semibold">Car Rental</h3>
          </div>
          <p className="text-gray-500 text-sm">
            Choose from a variety of cars at affordable daily rates.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition hover:-translate-y-1 w-full max-w-[340px] mx-auto border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <MapPin size={26} className="text-orange-500" />
            <h3 className="text-[20px] font-semibold">Multiple Locations</h3>
          </div>
          <p className="text-gray-500 text-sm">
            Pick up and drop off your car at convenient city locations.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition hover:-translate-y-1 w-full max-w-[340px] mx-auto border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Clock size={26} className="text-orange-500" />
            <h3 className="text-[20px] font-semibold">Flexible Timing</h3>
          </div>
          <p className="text-gray-500 text-sm">
            Book cars anytime with flexible pickup and drop timings.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition hover:-translate-y-1 w-full max-w-[340px] mx-auto border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck size={26} className="text-orange-500" />
            <h3 className="text-[20px] font-semibold">Secure Booking</h3>
          </div>
          <p className="text-gray-500 text-sm">
            Safe and secure booking with verified vehicles and drivers.
          </p>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition hover:-translate-y-1 w-full max-w-[340px] mx-auto border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Users size={26} className="text-orange-500" />
            <h3 className="text-[20px] font-semibold">Professional Drivers</h3>
          </div>
          <p className="text-gray-500 text-sm">
            Experienced drivers available for a comfortable journey.
          </p>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition hover:-translate-y-1 w-full max-w-[340px] mx-auto border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Headphones size={26} className="text-orange-500" />
            <h3 className="text-[20px] font-semibold">24/7 Support</h3>
          </div>
          <p className="text-gray-500 text-sm">
            Get assistance anytime with our dedicated support team.
          </p>
        </div>

      </div>
    </div>
  );
}