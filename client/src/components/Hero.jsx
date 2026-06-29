const Hero = () => {
  return (
    <div className="max-w-xxl">

      {/* MAIN HEADING */}
      <h1 className="text-5xl font-bold leading-tight text-black mt-3 text-[47px]">
        Ride Smarter with <span className="text-orange-500">RentalEase</span> 
      </h1>

      <h1 className="text-5xl font-bold leading-tight text-black mt-3 text-[47px]">Your Ride, Your Way</h1>

      {/* SUB TEXT */}
      <p className="mt-4 text-black-1000 text-[23px]">
        Fast, reliable, and affordable rental services available 24/7.
      </p>

      {/* NEW TAGLINE */}
      <p className="mt-2 text-black-1000 text-[22px]">
        Choose from a wide range of vehicles tailored to your journey — anytime, anywhere.
      </p>

      {/* TRUST POINTS */}
      <div className="mt-4 flex gap-6 text-[17px] text-black/80">
        <span className="cursor-pointer transition duration-300 hover:text-orange-500 hover:-translate-y-1">
            ✔ No hidden charges
        </span>

        <span className="cursor-pointer transition duration-300 hover:text-orange-500 hover:-translate-y-1">
            ✔ Instant booking
        </span>

        <span className="cursor-pointer transition duration-300 hover:text-orange-500 hover:-translate-y-1">
            ✔ Verified vehicles
        </span>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 flex gap-4">
        <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition">
          Book Now
        </button>

        <button className="border px-6 py-3 rounded-lg hover:border-orange-500 hover:text-orange-500 transition">
          View Services
        </button>
      </div>

    </div>
  );
};

export default Hero;