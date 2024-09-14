import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import clientPromise from '../../../lib/mongo/db';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, as the raw body is needed for verification
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    // Ensure you return a response for methods other than POST
    return res.setHeader('Allow', ['POST']).status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Ensure WEBHOOK_SECRET is set
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get Svix headers for verification
  const svix_id = req.headers['svix-id'] as string;
  const svix_timestamp = req.headers['svix-timestamp'] as string;
  const svix_signature = req.headers['svix-signature'] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    // If headers are missing, return an error response
    return res.status(400).json({ error: 'Missing Svix headers' });
  }

  // Read the request body as raw buffer
  const body = (await buffer(req)).toString();

  // Create a new Svix instance for webhook verification
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    // Verify the webhook
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).json({ error: 'Webhook verification failed' });
  }

  // Handle the event after successful verification
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    try {
      console.log('User Created - Clerk ID:', evt.data.id);

      // Connect to MongoDB
      const client = await clientPromise;
      const database = client.db('userdata');
      const usersCollection = database.collection('Users');

      // Insert the new user into the MongoDB collection
      await usersCollection.insertOne({
        clerkUserId: evt.data.id, // Add Clerk user ID
        pdfs: [],                 // Initialize with an empty PDF array
        tokensUsed: 0,            // Initialize tokens used
        subscriptionStatus: false // Initialize subscription status
      });
      
      console.log('User inserted into MongoDB:', evt.data.id);

    } catch (error) {
      console.error('Error inserting user into MongoDB:', error);
      return res.status(500).json({ error: 'Error saving user data' });
    }
  }

  // Return success response
  return res.status(200).json({ response: 'Success' });
}
