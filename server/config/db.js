// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("Database connection error:", error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;



// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     console.log("Connecting to MongoDB...");

//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 10000,
//       family: 4, // Force IPv4
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("Database connection error:");
//     console.error(error);

//     // Exit only when running locally
//     if (process.env.NODE_ENV !== "production") {
//       process.exit(1);
//     }
//   }
// };

// module.exports = connectDB;


const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  // Reuse existing connection
  if (isConnected) {
    return;
  }

  try {
    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });

    isConnected = conn.connection.readyState === 1;

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:");
    console.error(error);

    throw error; // Let Vercel return a proper 500 response
  }
};

module.exports = connectDB;