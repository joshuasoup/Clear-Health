import { buffer } from "micro";
import clientPromise from "../../../lib/mongo/db";
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
import { getAuth } from "@clerk/nextjs/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const endpointSecret =
  "whsec_0de0cc9a66ef5893c69c6bfb877fb36fa7f733770b60f04301b7a2da17b1ec85"; // Your Stripe webhook secret

export default async (req, res) => {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];
  const { userId } = getAuth(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // Check if the session has a subscription
    const subscriptionId = session.id; // This is the newly created subscriptionId

    if (subscriptionId && session.payment_status === "paid") {
      // Connect to MongoDB and update the user's record
      const client = await clientPromise;
      const database = client.db("userdata");
      const usersCollection = database.collection("Users");

      // Update the user's record with the subscriptionId and set subscription status to true
      await usersCollection.updateOne(
        { clerkUserId: userId },
        {
          $set: {
            subscriptionId: subscriptionId,
            subscriptionStatus: true, // Assume this is how you're tracking the active subscription
            maxTokens: 10000,
          },
        }
      );
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    const subscriptionId = subscription.id;
    console.log(`Subscription canceled: ${subscriptionId}`);

    // Connect to MongoDB and update the user's record
    const client = await clientPromise;
    const database = client.db("userdata");
    const usersCollection = database.collection("Users");

    // Update the user's record to set subscription status to false and clear the subscriptionId
    await usersCollection.updateOne(
      { subscriptionId: subscriptionId },
      {
        $set: {
          subscriptionStatus: false,
        },
        $unset: {
          subscriptionId: "",
        },
      }
    );
  }

  res.status(200).json({ received: true });
};
