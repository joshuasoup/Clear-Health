import { getAuth } from "@clerk/nextjs/server";
import clientPromise from "../../../lib/mongo/db";

export async function POST(req) {
  try {
    const { tokenCount } = await req.json(); // Parse JSON body
    const { userId } = getAuth(req);

    if (!tokenCount || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing tokenCount or userId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const database = client.db("userdata");
    const usersCollection = database.collection("Users");

    await usersCollection.updateOne(
      { clerkUserId: userId },
      { $inc: { tokensUsed: tokenCount } },
      { upsert: true }
    );

    return new Response(
      JSON.stringify({ message: "Tokens Updated Successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to handle the request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
