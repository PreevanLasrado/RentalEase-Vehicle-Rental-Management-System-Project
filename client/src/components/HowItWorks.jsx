import { FaMapMarkerAlt, FaCalendarAlt, FaCar } from "react-icons/fa";

function HowItWorks() {
  const steps = [
    {
      icon: <FaMapMarkerAlt />,
      title: "Choose Location",
      desc: "Select your pickup city and preferred location easily.",
      color: "from-purple-400 to-purple-600",
      bg: "bg-purple-100",
    },
    {
      icon: <FaCalendarAlt />,
      title: "Pick-up Date",
      desc: "Choose date and time that fits your schedule.",
      color: "from-orange-400 to-orange-600",
      bg: "bg-orange-100",
    },
    {
      icon: <FaCar />,
      title: "Book your Car",
      desc: "Confirm your booking and enjoy your ride.",
      color: "from-pink-400 to-pink-600",
      bg: "bg-pink-100",
    },
  ];

  return (
    <section className="py-12 mt-3 bg-gradient-to-b from-white to-white text-center">

      {/* TITLE */}
      <h2 className="text-[45px] font-black mb-2">
        How it <span className="text-orange-500">works?</span>
      </h2>

      <p className="text-gray-500 max-w-xl mx-auto mb-7 text-lg">
        Book your ride in just a few simple steps and enjoy a seamless rental experience.
      </p>

      {/* STEPS */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 relative">
        <div className="hidden md:block absolute top-16 left-1/2 -translate-x-1/2 w-[45%] border-t-4 border-dashed border-gray-500"></div>

        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative group">

            {/* ICON CARD */}
            <div className={`relative p-8 rounded-2xl ${step.bg} shadow-lg 
            group-hover:shadow-2xl transition duration-300 group-hover:-translate-y-2`}>

              {/* GLOW EFFECT */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl bg-gradient-to-r ${step.color} transition duration-300`}></div>

              <div className="relative text-5xl md:text-6xl text-gray-700">
                {step.icon}
              </div>
            </div>

            {/* STEP NUMBER */}
            <div className="mt-4 text-xs text-gray-400 font-semibold tracking-widest">
              STEP {index + 1}
            </div>

            {/* TITLE */}
            <h3 className="mt-2 font-semibold text-lg">
              {step.title}
            </h3>

            {/* DESC */}
            <p className="text-gray-500 text-sm mt-2 max-w-[220px]">
              {step.desc}
            </p>

          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;