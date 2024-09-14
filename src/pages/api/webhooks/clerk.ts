import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import clientPromise from "../../../lib/mongo/db"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405)
  }
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the Svix headers for verification
  const svix_id = req.headers['svix-id'] as string
  const svix_timestamp = req.headers['svix-timestamp'] as string
  const svix_signature = req.headers['svix-signature'] as string

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Error occured -- no svix headers' })
  }

  console.log('headers', req.headers, svix_id, svix_signature, svix_timestamp)
  // Get the body
  const body = (await buffer(req)).toString()

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If the verification fails, error out and  return error code
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return res.status(400).json({ Error: err })
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data
  const eventType = evt.type
  if (eventType === 'user.created') {
    console.log('userId:', evt.data.id)
    const client = await clientPromise
    const database = client.db("userdata");
    const usersCollection = database.collection("Users");
    await usersCollection.insertOne({
        clerkUserId: evt.data.id,       // Add the clerkUserId
        pdfs: [],                  // Initialize pdfs as an empty array
        tokensUsed: 0,             // Initialize tokensUsed to 0
        subscriptionStatus: false  // Initialize subscriptionStatus to false
    });

}

  return res.status(200).json({ response: 'Success' })
}