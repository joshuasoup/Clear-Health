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

    // Check if the 'tokensUsed' field exists, otherwise set it to 0
    const usedTokens = user.tokensUsed !== undefined ? user.tokensUsed : 0;
    const maxTokens = user.maxTokens !== undefined ? user.maxTokens : 0;

    res.status(200).json({ usedTokens, maxTokens });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Failed to fetch token usage" });
  }
}
