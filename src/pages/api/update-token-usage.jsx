import { getAuth } from "@clerk/nextjs/server";
import clientPromise from "../../lib/mongo/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { tokenCount } = req.body;
    const { userId } = getAuth(req);

    const client = await clientPromise;
    const database = client.db("userdata");
    const usersCollection = database.collection("Users");

    await usersCollection.updateOne(
      { clerkUserId: userId },
      { $inc: { tokensUsed: tokenCount } },
      { upsert: true }
    );

    res.status(200).json({
      message: "Tokens Updated Successfully",
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Failed to handle the request" });
  }
}
