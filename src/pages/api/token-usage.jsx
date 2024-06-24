import { getAuth } from "@clerk/nextjs/server";
import clientPromise from "../../lib/mongo/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { userId } = getAuth(req);
    const client = await clientPromise;
    const database = client.db("userdata");
    const usersCollection = database.collection("Users");

    // Extracting tokens from formData
    const formData = await req.formData();
    const tokens = parseInt(formData.get("tokens"), 10);

    // Update the user document with the new tokens
    await usersCollection.updateOne(
      { clerkUserId: userId },
      { $inc: { tokensUsed: tokens } }, // Using $inc to increment the tokens
      { upsert: true }
    );

    res.status(200).json({
      message: "Tokens Updated Successfully",
    });
  } catch (error) {
    console.log("Error updating tokens:", error);
    res.status(500).json({ error: "Failed to update tokens" });
  }
}
