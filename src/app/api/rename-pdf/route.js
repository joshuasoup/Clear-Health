import clientPromise from "../../../lib/mongo/db";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { fileId, newName } = await req.json(); // Parse JSON body

    if (!fileId || !newName) {
      return new Response(
        JSON.stringify({ error: "File ID and new name must be provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const database = client.db("userdata");
    const usersCollection = database.collection("Users");

    // Update the name of the file in the PDFs collection
    const result = await usersCollection.updateOne(
      { clerkUserId: userId, "pdfs.key": fileId },
      { $set: { "pdfs.$.name": newName } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "File not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "File name updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating file name:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update file name" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
