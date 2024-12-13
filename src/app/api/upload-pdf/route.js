import s3Client from "../../../lib/aws/db";
import { getAuth } from "@clerk/nextjs/server";
import { IncomingForm } from "formidable";
import clientPromise from "../../../lib/mongo/db";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function uploadFileToS3(file) {
  const fileContent = await file.arrayBuffer();
  const { v4: uuidv4 } = require("uuid");
  const key = `${uuidv4()}`; // Ensure this is unique if necessary

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: fileContent,
  };
  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return key; // Return the S3 key of the uploaded file
  } catch (err) {
    console.error("Error uploading file to S3:", err.message, err.stack);
    throw err;
  }
}

export async function POST(req) {
  const { userId } = getAuth(req);
  const client = await clientPromise;
  const database = client.db("userdata");
  const usersCollection = database.collection("Users");
  const user = await usersCollection.findOne({ clerkUserId: userId });
  const subscriptionStatus = user.subscriptionStatus;
  const pdfCount = user.pdfs ? user.pdfs.length : 0;

  if (subscriptionStatus === false && pdfCount >= 5) {
    return new Response(
      JSON.stringify({
        error: "Upload limit reached or inactive subscription",
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const formData = await req.formData();
    const pdfFile = formData.get("file");
    if (!pdfFile) {
      return new Response(JSON.stringify({ error: "No PDF file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Step 1: Upload the file to S3 and get the key
    const fileKey = await uploadFileToS3(pdfFile);

    const pdfMetadata = {
      name: pdfFile.name,
      key: fileKey, // Store the S3 key instead of the URL
    };

    // Step 2: Update MongoDB with the metadata including the S3 key
    await usersCollection.updateOne(
      { clerkUserId: userId },
      { $push: { pdfs: pdfMetadata } },
      { upsert: true }
    );

    return new Response(
      JSON.stringify({
        message: "PDF uploaded and metadata added successfully",
        userId: userId,
        fileKey,
        fileName: pdfFile.name,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Server error:", e);
    return new Response(JSON.stringify({ error: "Failed to upload PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
