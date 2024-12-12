import clientPromise from "../../../lib/mongo/db";

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
    console.error("Error resetting token usage:", error);
    throw new Error("Failed to reset token usage");
  }
};

export async function POST(req) {
  try {
    const { apiKey } = await req.json(); // Parse JSON body
    if (apiKey !== process.env.VALIDATION_API_KEY) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const responseMessage = await resetTokenUsage();

    return new Response(JSON.stringify({ message: responseMessage }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
