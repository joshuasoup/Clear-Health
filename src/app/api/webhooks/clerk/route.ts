import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { buffer } from 'micro';
import clientPromise from '../../../../lib/mongo/db';
import s3Client from '../../../../lib/aws/db';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for raw body handling
  },
};

export async function POST(req: Request) {
  try {
    // Ensure WEBHOOK_SECRET is set
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Get Svix headers for verification
    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response(
        JSON.stringify({ error: 'Missing Svix headers' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Read the raw body as a buffer
    const body = await req.text();

    // Create a new Svix instance for webhook verification
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      // Verify the webhook
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response(
        JSON.stringify({ error: 'Webhook verification failed' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle the event after successful verification
    const eventType = evt.type;
    const clerkId = evt.data.id;

    // Connect to MongoDB
    const client = await clientPromise;
    const database = client.db('userdata');
    const usersCollection = database.collection('Users');

    if (eventType === 'user.created') {
      try {
        const email = evt.data.email_addresses[0].email_address;

        // Insert the new user into the MongoDB collection
        await usersCollection.insertOne({
          clerkUserId: clerkId, 
          pdfs: [],
          tokensUsed: 0,
          subscriptionStatus: false,
          email: email,
          maxTokens: 500,
        });

        console.log('User inserted into MongoDB:', clerkId);
      } catch (error) {
        console.error('Error inserting user into MongoDB:', error);
        return new Response(
          JSON.stringify({ error: 'Error saving user data' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else if (eventType === 'user.deleted') {
      try {
        // Fetch the user’s files from MongoDB
        const user = await usersCollection.findOne({ clerkUserId: clerkId });

        if (user?.pdfs) {
          // Loop through each file key and delete the file from S3
          for (const file of user.pdfs) {
            const deleteParams = {
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: file.key,
            };
            await s3Client.send(new DeleteObjectCommand(deleteParams));
            console.log(`Deleted file from S3: ${file.key}`);
          }
        }

        // Delete the user from MongoDB
        const deleteResult = await usersCollection.deleteOne({ clerkUserId: clerkId });

        if (deleteResult.deletedCount === 1) {
          console.log('User and files deleted from MongoDB:', clerkId);
        } else {
          console.error('User not found or already deleted from MongoDB:', clerkId);
        }
      } catch (error) {
        console.error('Error deleting user and files:', error);
        return new Response(
          JSON.stringify({ error: 'Error deleting user and files' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({ response: 'Success' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: 'POST, OPTIONS' },
  });
}
