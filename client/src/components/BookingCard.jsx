const BookingCard = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-80 ml-36 mr-auto">
      <h2 className="font-semibold text-center text-[28px]"> Quick Booking </h2>

      <div className="w-14 h-1 bg-orange-500 mx-auto mt-2 mb-4 rounded"></div>

      <input className="input" placeholder="Your Full Name" />
      <input className="input" placeholder="Contact Number" />

      <select className="input">
        <option value="">Select Vehicle</option>
        <option value="car">Car</option>
        <option value="bike">Bike</option>
        <option value="scooter">Scooter</option>
        <option value="taxi">Taxi</option>
        <option value="electric">Electric Vehicle</option>
      </select>

      <input type="datetime-local" className="input" />

      <button className="bg-orange-500 text-white w-full py-3 rounded-lg mt-4 transition-all duration-300 hover:bg-orange-600 hover:shadow-lg hover:-translate-y-1 active:scale-95">
        Confirm Booking
      </button>
    </div>
  );
};

export default BookingCard;