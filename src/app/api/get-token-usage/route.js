import { getAuth } from "@clerk/nextjs/server";
import clientPromise from "../../../lib/mongo/db";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    const client = await clientPromise;
    const database = client.db("userdata");
    const usersCollection = database.collection("Users");

    const user = await usersCollection.findOne({
      clerkUserId: userId,
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if the 'tokensUsed' field exists, otherwise set it to 0
    const usedTokens = user.tokensUsed !== undefined ? user.tokensUsed : 0;
    const maxTokens = user.maxTokens !== undefined ? user.maxTokens : 0;

    return new Response(JSON.stringify({ usedTokens, maxTokens }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Server error:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch token usage" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
