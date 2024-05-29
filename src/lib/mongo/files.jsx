import clientPromise from "./db";

let client;
let db;
let pdfs;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = await client.db("userdata");
    pdfs = await db.collection("PDFs");
    console.log("Connection secured");
  } catch (error) {
    console.log(error);
    throw new Error("Failure to connect to database");
  }
}

(async () => {
  await init();
})();

export async function getPDFs(clerkUserId) {
  try {
    if (!pdfs) await init();
    const result = await pdfs
      .find({ clerkUserId })
      .limit(20)
      .map((user) => ({ ...user, _id: user._id.toString() }))
      .toArray();
    return { pdfs: result };
  } catch (error) {
    return { error: "failed to fetch pdfs" };
  }
}
