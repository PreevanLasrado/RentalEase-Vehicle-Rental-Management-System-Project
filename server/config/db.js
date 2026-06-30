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

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;