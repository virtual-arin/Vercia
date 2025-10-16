const mongoose = require("mongoose");

const uri = process.env.MONGO_DB_URI;

async function connectToDb() {
  if (!uri) {
    console.error("FATAL ERROR: MONGO_DB_URI is not defined.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to database successfully!");
  } catch (error) {
    console.error("Could not connect to DB", error);
    process.exit(1);
  }
}

module.exports = { connectToDb };
