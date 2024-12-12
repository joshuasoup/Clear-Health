import clientPromise from "../../../../lib/mongo/db";
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
    
  try {
    const sig = req.headers.get("stripe-signature");
    
    if (!sig) {
      return new Response(
        JSON.stringify({ error: "Missing Stripe signature" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const buf = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook verification failed:", err.message);
      return new Response(
        JSON.stringify({ error: `Webhook Error: ${err.message}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const database = client.db("userdata");
    const usersCollection = database.collection("Users");

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.payment_status === "paid") {
            const userId = session.metadata.userId;
          await usersCollection.updateOne(
            { clerkUserId: userId},
            {
              $set: {
                subscriptionId: session.subscription,
                subscriptionStatus: true,
                subscriptionPlan: session.metadata.plan, // Example metadata for tracking plan
              },
            }
          );
        }
        break;
      }
      case "customer.subscription.created": {
        const subscription = event.data.object;
        await usersCollection.updateOne(
          { subscriptionId: subscription.id },
          {
            $set: {
              subscriptionStatus: true,
              subscriptionPlan: subscription.items.data[0].plan.id,
            },
          }
        );
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await usersCollection.updateOne(
          { subscriptionId: subscription.id },
          {
            $set: {
              subscriptionPlan: subscription.items.data[0].plan.id,
              subscriptionStatus: subscription.status === "active",
            },
          }
        );
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await usersCollection.updateOne(
          { subscriptionId: subscription.id },
          {
            $set: { subscriptionStatus: false },
            $unset: { subscriptionId: "", subscriptionPlan: "" },
          }
        );
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        await usersCollection.updateOne(
          { subscriptionId: invoice.subscription },
          {
            $set: { subscriptionStatus: false },
          }
        );
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        await usersCollection.updateOne(
          { subscriptionId: invoice.subscription },
          {
            $set: { subscriptionStatus: true },
          }
        );
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "POST, OPTIONS" },
  });
}
