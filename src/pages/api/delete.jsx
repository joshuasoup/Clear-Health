import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import clientPromise from "../../lib/mongo/db";
import { getAuth } from '@clerk/nextjs/server';

// Initialize the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, only POST requests are accepted' });
  }

  const { userId } = getAuth(req);
  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ error: 'File key must be provided' });
  }

  try {
    // Delete the file from S3
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };
    await s3Client.send(new DeleteObjectCommand(deleteParams));

    // Delete the file metadata from MongoDB
    const client = await clientPromise;
    const database = client.db("userdata");
    const usersCollection = database.collection("PDFs");
    await usersCollection.updateOne(
      { clerkUserId: userId },
      { $pull: { pdfs: { key: key } } }
    );

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
}
