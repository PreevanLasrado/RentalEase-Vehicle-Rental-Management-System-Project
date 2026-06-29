import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
        name: "Rahul Sharma",
        rating: 5,
        text: "Amazing service! The car was in perfect condition and the booking process was extremely smooth. Pickup and drop were hassle-free, and the staff was very professional throughout the experience.",
    },
    {
        name: "Amit Verma",
        rating: 4,
        text: "Very affordable and reliable service. The vehicle was clean and well-maintained. I really appreciated the quick support and easy booking system. Will definitely use this again in the future.",
    },
    {
        name: "Neha Kapoor",
        rating: 5,
        text: "Loved the entire experience! The car quality was excellent and customer support was very responsive. Everything was well organized and made my trip completely stress-free and enjoyable.",
    },
    {
        name: "Priya Mehta",
        rating: 4,
        text: "Great service with reasonable pricing. The booking was simple and the car was delivered on time. Overall, a very smooth experience and I would highly recommend it to others.",
    },
    {
        name: "Karan Singh",
        rating: 5,
        text: "Professional drivers and top-notch vehicles. The ride was smooth and comfortable, and everything was managed very efficiently. One of the best rental services I’ve used so far.",
    },
    {
        name: "Anjali Gupta",
        rating: 4,
        text: "Best rental experience ever! The entire process was seamless and very convenient. The team was supportive and vehicle exceeded my expectations in terms of quality and comfort.",
    },
    ];

  return (
    <div className="py-16 bg-gray-50">

      {/* 🔥 Heading */}
      <div className="text-center mb-4">
        <h2 className="text-[45px] font-black">
          What{" "}
          <span className="text-orange-500">People</span> Say About{" "}
          <span className="text-orange-500">Us</span>?
        </h2>

        <p className="text-gray-500 mx-auto mt-2 mb-4 text-lg">
          Hear what our customers have to say about their experience with our
          car rental service.
        </p>
      </div>

      {/* 🔥 Slider */}
      <div className="px-6 md:px-16">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={3}
          navigation
          autoplay={{ delay: 3000 }}
          loop={true}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              
              {/* Card */}
              <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition h-full max-w-[300px] mx-20 mb-1">

                {/* Name */}
                <h3 className="font-semibold text-[20px] mb-1">
                    {review.name}
                </h3>

                {/* Stars */}
                <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className={
                        i < review.rating
                            ? "text-orange-500 fill-orange-500"
                            : "text-gray-300"
                        }
                    />
                    ))}
                </div>

                {/* Review */}
                <p className="text-gray-500 text-[14px] leading-relaxed min-h-[80px]">
                    {review.text}
                </p>

              </div>

            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </div>
  );
}