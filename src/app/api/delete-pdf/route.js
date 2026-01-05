import s3Client from "../../../lib/aws/db";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getPineconeClient } from "../../../lib/pinecone/pinecone";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { key } = await req.json(); // Parse the JSON body for the file key

    if (!key) {
      return NextResponse.json(
        { error: "File key must be provided" },
        { status: 400 }
      );
    }

    const bucket = process.env.AWS_S3_BUCKET_NAME;

    if (!bucket) {
      throw new Error("AWS_S3_BUCKET_NAME is not configured");
    }

    // Delete the file from S3
    const deleteParams = {
      Bucket: bucket,
      Key: key,
    };
    await s3Client.send(new DeleteObjectCommand(deleteParams));

    // Delete the vector from Pinecone
    const pineconeClient = getPineconeClient();

    const pineconeIndex = pineconeClient.Index(
      "clearhealth",
      "https://clearhealth-zuxt9ok.svc.aped-4627-b74a.pinecone.io"
    );

    await pineconeIndex.namespace(`${key}`).deleteAll();

    const response = NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
    return response;
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
