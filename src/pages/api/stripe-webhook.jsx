// import clientPromise from "../../lib/mongo/db";
// import getRawBody from "raw-body";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_TEST_KEY);

// export const config = {
//   api: {
//     bodyParser: false, // We disable Next.js body parsing because Stripe needs the raw body
//   },
// };

// export default async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

//   let event;

//   try {
//     const rawBody = await getRawBody(req); // Get the raw body
//     event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Now handle the event types as needed, same as before:
//   const client = await clientPromise;
//   const database = client.db("userdata");
//   const usersCollection = database.collection("Users");

//   switch (event.type) {
//     case "checkout.session.completed": {
//       const session = event.data.object;
//       const userId = session.metadata.userId;

//       await usersCollection.updateOne(
//         { clerkUserId: userId },
//         { $set: { subscriptionStatus: "active" } }
//       );
//       break;
//     }

//     case "invoice.payment_failed": {
//       const subscription = event.data.object;
//       const userId = subscription.customer;

//       await usersCollection.updateOne(
//         { clerkUserId: userId },
//         { $set: { subscriptionStatus: "payment_failed" } }
//       );
//       break;
//     }

//     case "customer.subscription.deleted": {
//       const subscription = event.data.object;
//       const userId = subscription.customer;

//       await usersCollection.updateOne(
//         { clerkUserId: userId },
//         { $set: { subscriptionStatus: "canceled" } }
//       );
//       break;
//     }

//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   res.json({ received: true });
// };
