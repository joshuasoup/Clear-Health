import s3Client from "../../../lib/aws/db";
import {
  GetObjectTaggingCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const bucket = process.env.AWS_S3_BUCKET_NAME;

    if (!bucket) {
      throw new Error("AWS_S3_BUCKET_NAME is not configured");
    }

    const listCommand = new ListObjectsV2Command({ Bucket: bucket });
    const { Contents = [] } = await s3Client.send(listCommand);

    const pdfs = await Promise.all(
      Contents.filter((object) => object.Key).map(async (object) => {
        try {
          const tags = await s3Client.send(
            new GetObjectTaggingCommand({
              Bucket: bucket,
              Key: object.Key,
            })
          );

          const nameTag =
            tags.TagSet?.find((tag) => tag.Key === "name") ?? null;

          return {
            key: object.Key,
            name: nameTag?.Value || object.Key,
          };
        } catch (tagError) {
          console.error(
            `Failed to load tags for object ${object.Key}:`,
            tagError
          );
          return { key: object.Key, name: object.Key };
        }
      })
    );

    const userCollection = [{ _id: "s3", sessionId: "shared", pdfs }];

    return NextResponse.json({ userCollection }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
