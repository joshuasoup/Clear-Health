// pages/api/create-checkout-session.js

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

export default async (req, res) => {
  const { userId } = req.body;

  await client.connect();
  const db = client.db("userdata");
  const users = db.collection("PDFs");

  const user = await users.findOne({ clerkUserId: userId });

  if (!user) {
    res.status(400).json({ error: "User not found" });
    return;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1JyXXXXXXXXXXXXX", // Your Stripe Price ID
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    metadata: { userId },
  });

  res.status(200).json({ url: session.url });
};
