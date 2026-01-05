import s3Client from "../../../lib/aws/db";
import { PutObjectCommand, PutObjectTaggingCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

async function uploadFileToS3(file) {
  const bucket = process.env.AWS_S3_BUCKET_NAME;

  if (!bucket) {
    throw new Error("AWS_S3_BUCKET_NAME is not configured");
  }

  const fileContent = await file.arrayBuffer();
  const { v4: uuidv4 } = require("uuid");
  const key = `${uuidv4()}`; // Ensure this is unique if necessary

  const params = {
    Bucket: bucket,
    Key: key,
    Body: fileContent,
    ContentType: file.type || "application/pdf",
  };
  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    await s3Client.send(
      new PutObjectTaggingCommand({
        Bucket: bucket,
        Key: key,
        Tagging: {
          TagSet: [{ Key: "name", Value: file.name }],
        },
      })
    );
    return key; // Return the S3 key of the uploaded file
  } catch (err) {
    console.error("Error uploading file to S3:", err.message, err.stack);
    throw err;
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const pdfFile = formData.get("file");
    if (!pdfFile) {
      return NextResponse.json(
        { error: "No PDF file uploaded" },
        { status: 400 }
      );
    }

    // Step 1: Upload the file to S3 and get the key
    const fileKey = await uploadFileToS3(pdfFile);

    const response = NextResponse.json(
      {
        message: "PDF uploaded and metadata added successfully",
        userId: "shared",
        fileKey,
        fileName: pdfFile.name,
      },
      { status: 200 }
    );
    return response;
  } catch (e) {
    console.error("Server error:", e);
    return NextResponse.json(
      { error: "Failed to upload PDF" },
      { status: 500 }
    );
  }
}
