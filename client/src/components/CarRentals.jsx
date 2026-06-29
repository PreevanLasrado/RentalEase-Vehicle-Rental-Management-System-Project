import { Star, Heart, Users, Settings, Fuel, Calendar, Gauge } from "lucide-react";
import { Link } from "react-router-dom";

const cars = [
  {
    id: 1,
    name: "Maruti Suzuki Swift",
    rating: 4.5,
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    year: 2022,
    price: 1800,
    mileage: 25,
    image: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/159231/swift-right-front-three-quarter.jpeg?isig=0&q=80"
  },
  {
    id: 2,
    name: "Hyundai Creta",
    rating: 4.7,
    seats: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    year: 2023,
    price: 3200,
    mileage: 35,
    image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter.jpeg"
  },
  {
    id: 3,
    name: "Toyota Innova Crysta",
    rating: 4.8,
    seats: 7,
    transmission: "Manual",
    fuel: "Diesel",
    year: 2021,
    price: 4500,
    mileage: 14,
    image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/51435/innova-crysta-exterior-right-front-three-quarter-3.jpeg?q=80"
  },
  {
    id: 4,
    name: "Honda City",
    rating: 4.6,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    year: 2022,
    price: 2800,
    mileage: 12,
    image: "https://imgd-ct.aeplcdn.com/664x374/n/cw/ec/143279/city-right-front-three-quarter-4.jpeg?isig=0&q=80"
  }
];

// ⭐ Star Rating
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          className={
            i <= Math.floor(rating)
              ? "text-yellow-500 fill-yellow-500"
              : "text-gray-300"
          }
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating}</span>
    </div>
  );
}

export default function CarRentals() {
  return (
    <div className="px-6 md:px-16 py-18 bg-gradient-to-b from-gray-50 to-gray-100">
      
      {/* Heading */}
      <h2 className="text-[45px] font-black mb-2 text-center mt-0">
        Most Popular <span className="text-orange-500">Car</span> Rental{" "}
        <span className="text-orange-500">Deals</span>
      </h2> 

      <p className="text-gray-500 mt-3 text-center mb-5 max-w-xl mx-auto text-lg">
        Choose from a wide range of cars at the best daily prices. 
        Reliable, affordable, and ready for your next journey.
      </p>

      {/* Centered Grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          
          {cars.map((car) => (
            <div
                key={car.id}
                className="
                    bg-amber-50 backdrop-blur-md
                    rounded-2xl p-3 w-[320px]

                    shadow-[0_10px_25px_rgba(255,120,0,0.25)]
                    hover:shadow-[0_30px_70px_rgba(255,100,0,0.6)]

                    transform hover:-translate-y-2 hover:scale-105
                    transition duration-300 ease-in-out

                    relative border border-orange-200
                "
            >
              
              {/* ❤️ Wishlist */}
              <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow">
                <Heart size={16} fill="red" color="red"/>
              </button>

              {/* 🚗 Image */}
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-40 object-contain rounded-lg"
              />

              {/* ⭐ Rating */}
              <div className="mt-3">
                <StarRating rating={car.rating} />
              </div>

              {/* 🚘 Name */}
              <h3 className="text-lg font-semibold mt-2">{car.name}</h3>

              {/* 📊 Details */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-700">
                
                <p className="flex items-center gap-2">
                  <Users size={16} className="text-black" />
                  {car.seats} Seats
                </p>

                <p className="flex items-center gap-2">
                  <Settings size={16} className="text-black" />
                  {car.transmission}
                </p>

                <p className="flex items-center gap-2">
                  <Fuel size={16} className="text-black" />
                  {car.fuel}
                </p>

                <p className="flex items-center gap-2">
                  <Calendar size={16} className="text-black" />
                  {car.year}
                </p>

              </div>

              {/* 💰 Bottom */}
              <div className="flex items-center justify-between mt-3">
                {/* <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition">
                  Book Now
                </button> */}

                <div className="flex items-center gap-1 text-l text-black mt-2 font-semibold">
                  <Gauge size={16} />
                  {car.mileage} 
                  <span className="text-[16px] text-gray-500"> km/rental</span>
                </div>

                <p className="text-lg font-bold pl-5">
                  ₹{car.price}
                  <span className="text-[16px] text-gray-500"> /day</span>
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>

      <div className="flex justify-center mt-5">
        <Link
            to="/rentals"
            className="
            bg-orange-500 text-white
            px-6 py-2.5 rounded-lg
            font-medium text-sm
            transition duration-300 ease-in-out
            shadow-md

            transform hover:scale-110 hover:-translate-y-1
            hover:bg-orange-600 hover:shadow-xl
            active:scale-95
            "
        >
            Explore More
        </Link>
      </div>

    </div>
  );
}