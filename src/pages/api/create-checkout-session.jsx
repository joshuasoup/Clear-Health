// pages/api/create-checkout-session.js
import clientPromise from "../../lib/mongo/db";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { userId } = req.body;

  const client = await clientPromise;
  const database = client.db("userdata");
  const usersCollection = database.collection("Users");

  const user = await usersCollection.findOne({ clerkUserId: userId });

  if (!user) {
    res.status(400).json({ error: "User not found" });
    return;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1P1FhzRquv3tbGOm5iZzT6A9", // Your Stripe Price ID
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    metadata: { userId },
  });

  res.status(200).json({ url: session.url });
};
