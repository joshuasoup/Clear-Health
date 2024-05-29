// Assume this is inside your pages/api directory in a file like updateFileName.js
import clientPromise from "../../lib/mongo/db";
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, only POST requests are accepted' });
  }

  const { userId } = getAuth(req);
  const { fileId, newName } = req.body;

  if (!fileId || !newName) {
    return res.status(400).json({ error: 'File ID and new name must be provided' });
  }

  try {
    const client = await clientPromise;
    const database = client.db("userdata");
    const usersCollection = database.collection("PDFs");

    // Update the name of the file in the PDFs collection
    const result = await usersCollection.updateOne(
      { clerkUserId: userId, "pdfs.key": fileId },
      { $set: { "pdfs.$.name": newName } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.status(200).json({ message: 'File name updated successfully' });
  } catch (error) {
    console.error("Error updating file name:", error);
    res.status(500).json({ error: 'Failed to update file name' });
  }
}
