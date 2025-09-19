const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_DB_URI;
let client;
let db;

async function connectToDb() {
  if (db) {
    return;
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("Vercia");
    console.log("Connected to database successfully!");
  } catch (error) {
    console.error("Could not connect to DB", error);
    process.exit(1);
  }
}

function getDb() {
  return db;
}

module.exports = { connectToDb, getDb };
