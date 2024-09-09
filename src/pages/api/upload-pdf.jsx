import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getAuth } from "@clerk/nextjs/server";
import { IncomingForm } from "formidable";
import clientPromise from "../../lib/mongo/db";
import fs from "fs";

// Initialize the S3 client with AWS SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function uploadFileToS3(file) {
  const fileContent = fs.readFileSync(file[0].filepath);
  const key = file[0].originalFilename; // Ensure this is unique if necessary

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

export default async function handler(req, res) {
  const { userId } = getAuth(req);

  const form = new IncomingForm({ keepExtensions: true });

  const parseForm = () =>
    new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

  try {
    const { fields, files } = await parseForm();
    const pdfFile = files.file;
    if (!pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    // Step 1: Upload the file to S3 and get the key
    const fileKey = await uploadFileToS3(pdfFile);

    const pdfMetadata = {
      name: pdfFile[0].originalFilename,
      key: fileKey, // Store the S3 key instead of the URL
    };

    // Step 2: Update MongoDB with the metadata including the S3 key
    const client = await clientPromise;
    const database = client.db("userdata");
    const usersCollection = database.collection("Users");

    await usersCollection.updateOne(
      { clerkUserId: userId },
      { $push: { pdfs: pdfMetadata } },
      { upsert: true }
    );

    res.status(200).json({
      message: "PDF uploaded and metadata added successfully",
      userId: userId,
      fileKey,
    });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ error: "Failed to upload PDF" });
  }
}
