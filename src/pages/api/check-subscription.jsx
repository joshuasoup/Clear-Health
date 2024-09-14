const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { subscriptionId } = req.body;

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      res.status(200).json({ status: subscription.status });
    } catch (error) {
      res.status(500).json({ error: "Unable to retrieve subscription" });
    }
  } else {
    res.status(405).end("Method Not Allowed");
  }
}
