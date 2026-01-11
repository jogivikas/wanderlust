const mongoose = require("mongoose");
const dotenv = require("dotenv");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Load environment variables
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const OWNER_ID = process.env.OWNER_ID;

// Connecting to MongoDB
main()
  .then(() => {
    console.log("connected to DB");
    initDB();
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
    await Listing.deleteMany({});

    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: OWNER_ID,
    }));

    await Listing.insertMany(initData.data);
    console.log("Data was initialized successfully!");
  } catch (error) {
    console.error("Error initializing DB:", error);
  } finally {
    mongoose.connection.close();
  }
};
