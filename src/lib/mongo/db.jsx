import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URL;
const options = {};

let client;
let clientPromise;

// Ensure MongoDB URI is set
if (!process.env.MONGODB_URL) {
  throw new Error("Please add your Mongo URI to the environment variables");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client
      .connect()
      .then(() => {
        console.log("Successfully connected to MongoDB in development mode");
        return client;
      })
      .catch((err) => {
        console.error("Failed to connect to MongoDB in development", err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new connection instance
  client = new MongoClient(uri, options);
  clientPromise = client
    .connect()
    .then(() => {
      console.log("Successfully connected to MongoDB in production mode");
      return client;
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB in production", err);
      throw err; // Ensure connection issues throw an error in production
    });
}

export default clientPromise;
