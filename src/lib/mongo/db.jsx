import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URL;
const options = {};

let client;
let clientPromise;

// Ensure MongoDB URI is provided
if (!process.env.MONGODB_URL) {
  throw new Error("Please add your MongoDB URI to the .env file");
}

// In development mode, use a global variable to preserve the client instance
// during hot reloads caused by HMR (Hot Module Replacement).
if (process.env.NODE_ENV) {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, avoid using a global variable and create a new client instance.
  client = new MongoClient(uri, options);
  clientPromise = client
    .connect()
    .then(() => {
      console.log("Successfully connected to MongoDB in production mode");
      return client;
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB in production", err);
      throw err;
    });
}
export default clientPromise;
