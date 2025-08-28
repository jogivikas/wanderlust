const mongoose = require("mongoose");
const initData = require("./data.js");  // Ensure this path is correct
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connecting to MongoDB
main()
  .then(() => {
    console.log("connected to DB");
    initDB();  // After successful connection, initialize the DB
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Initialize the database with sample listings
const initDB = async () => {
  try {
    // Clear the existing listings (optional, to refresh the data)
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6863fd76493fbe6514fb70dd" }));
    // Insert new data from initData
    await Listing.insertMany(initData.data);

    console.log("Data was initialized successfully!");
  } catch (error) {
    console.error("Error initializing DB:", error);
  } finally {
    // Close the connection after the operation
    mongoose.connection.close();
  }
};
