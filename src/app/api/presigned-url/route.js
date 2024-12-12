import s3Client from "../../../lib/aws/db";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key"); // Extract the 'key' query parameter

    if (!key) {
      return new Response(
        JSON.stringify({ error: "File key must be provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL expiration in seconds (1 hour)
    });

    return new Response(JSON.stringify({ presignedUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate pre-signed URL" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
