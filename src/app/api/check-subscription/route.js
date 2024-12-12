const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { subscriptionId } = await req.json(); // Extract subscriptionId from the request body

    if (!subscriptionId) {
      return new Response(JSON.stringify({ error: "Missing subscriptionId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    return new Response(JSON.stringify({ status: subscription.status }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error retrieving subscription:", error);
    return new Response(
      JSON.stringify({ error: "Unable to retrieve subscription" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
