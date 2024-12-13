import s3Client from "../../../lib/aws/db";
import clientPromise from "../../../lib/mongo/db";
import { getAuth } from "@clerk/nextjs/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getPineconeClient } from "../../../lib/pinecone/pinecone";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { key } = await req.json(); // Parse the JSON body for the file key

    if (!key) {
      return new Response(
        JSON.stringify({ error: "File key must be provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Delete the file from S3
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };
    await s3Client.send(new DeleteObjectCommand(deleteParams));

    // Delete the file metadata from MongoDB
    const client = await clientPromise;
    const database = client.db("userdata");
    const usersCollection = database.collection("Users");
    await usersCollection.updateOne(
      { clerkUserId: userId },
      { $pull: { pdfs: { key: key } } }
    );

    const pineconeClient = getPineconeClient();
    const pineconeIndex = await pineconeClient.index("clearhealth");
    await pineconeIndex.delete({ ids: [key] });

    return new Response(
      JSON.stringify({ message: "File deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return new Response(JSON.stringify({ error: "Failed to delete file" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
