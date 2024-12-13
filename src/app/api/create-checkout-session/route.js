import clientPromise from "../../../lib/mongo/db";
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);

export async function POST(req) {
  try {
    // Parse the JSON body
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const database = client.db("userdata");
    const usersCollection = database.collection("Users");

    const user = await usersCollection.findOne({ clerkUserId: userId });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.log(userId);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1Q581YRquv3tbGOmCIk9o926", // Your Stripe Price ID
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      metadata: { userId },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create Stripe session" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
