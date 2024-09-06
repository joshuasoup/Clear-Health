import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URL;
const options = {};

let client;
let clientPromise;

// Ensure MongoDB URI is set
if (!process.env.MONGODB_URL) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV == "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new connection instance
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    throw err; // Ensure any connection issues throw an error in production
  });
}

export default clientPromise;
