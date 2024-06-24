import clientPromise from "./db";

let client;
let db;
let userCollection;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = await client.db("userdata");
    userCollection = await db.collection("Users");
    console.log("Connection secured");
  } catch (error) {
    console.log(error);
    throw new Error("Failure to connect to database");
  }
}

(async () => {
  await init();
})();

export async function getUserInfo(clerkUserId) {
  try {
    if (!userCollection) await init();
    const result = await userCollection
      .find({ clerkUserId })
      .limit(20)
      .map((user) => ({ ...user, _id: user._id.toString() }))
      .toArray();
    return { userCollection: result };
  } catch (error) {
    return { error: "failed to fetch userCollection" };
  }
}
