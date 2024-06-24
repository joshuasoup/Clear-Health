import { getAuth } from "@clerk/nextjs/server";
import clientPromise from "../../lib/mongo/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { userId } = getAuth(req);
    const client = await clientPromise;
    const database = client.db("userdata");
    const usersCollection = database.collection("Users");

    const user = await usersCollection.findOne({ clerkUserId: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ usedTokens: user.tokensUsed, maxTokens: user.maxTokens });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Failed to fetch token usage" });
  }
}
