import s3Client from "../../../lib/aws/db";
import {
  GetObjectTaggingCommand,
  PutObjectTaggingCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { fileId, newName } = await req.json(); // Parse JSON body

    if (!fileId || !newName) {
      return NextResponse.json(
        { error: "File ID and new name must be provided" },
        { status: 400 }
      );
    }

    const bucket = process.env.AWS_S3_BUCKET_NAME;

    if (!bucket) {
      throw new Error("AWS_S3_BUCKET_NAME is not configured");
    }

    const existingTags = await s3Client.send(
      new GetObjectTaggingCommand({
        Bucket: bucket,
        Key: fileId,
      })
    );

    const updatedTags =
      existingTags.TagSet?.map((tag) =>
        tag.Key === "name" ? { ...tag, Value: newName } : tag
      ) ?? [];

    const hasNameTag = updatedTags.some((tag) => tag.Key === "name");

    if (!hasNameTag) {
      updatedTags.push({ Key: "name", Value: newName });
    }

    await s3Client.send(
      new PutObjectTaggingCommand({
        Bucket: bucket,
        Key: fileId,
        Tagging: { TagSet: updatedTags },
      })
    );

    const response = NextResponse.json(
      { message: "File name updated successfully" },
      { status: 200 }
    );
    return response;
  } catch (error) {
    console.error("Error updating file name:", error);
    return NextResponse.json(
      { error: "Failed to update file name" },
      { status: 500 }
    );
  }
}
