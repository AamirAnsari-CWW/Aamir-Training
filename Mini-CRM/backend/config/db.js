const mongoose = require("mongoose");
const env = require("./env");

// Establish MongoDB connection
const connectDB = async () => {
  const conn = await mongoose.connect(env.mongoUri);

  console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;