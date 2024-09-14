import { buffer } from "micro";
import clientPromise from "../../../lib/mongo/db";
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);

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
    const subscriptionId = session.subscription; // This is the newly created subscriptionId
    const { userId } = session.metadata; // Assuming userId was added in metadata during session creation

    if (subscriptionId) {
      // Connect to MongoDB and update the user's record
      const client = await clientPromise;
      const database = client.db("userdata");
      const usersCollection = database.collection("Users");

      // Update the user's record with the subscriptionId and set subscription status to true
      await usersCollection.updateOne(
        { clerkUserId: "user_2e17DrC085doD5ruhobkq3pWuDM" },
        {
          $upsert: {
            subscriptionId: subscriptionId,
            subscriptionStatus: true, // Assume this is how you're tracking the active subscription
          },
        }
      );
    }
  }

  res.status(200).json({ received: true });
};
