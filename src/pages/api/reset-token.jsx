import clientPromise from "../../lib/mongo/db";

const resetTokenUsage = async () => {
  try {
    const client = await clientPromise;
    const database = client.db("userdata");
    const usersCollection = database.collection("Users");

    await usersCollection.updateMany(
      {}, // This targets all documents in the collection
      { $set: { tokensUsed: 0 } }
    );

    return "Token usage reset for all users";
  } catch (error) {
    return `Failed to reset token usage:, ${error}`;
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = req.body;
  if (apiKey !== process.env.VALIDATION_API_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const response = await resetTokenUsage();
  try {
    res.status(200).json({ message: response });
  } catch (error) {
    res.status(500).json({ error: response });
  }
}
