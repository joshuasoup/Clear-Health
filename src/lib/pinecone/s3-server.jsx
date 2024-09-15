import s3Client from "../aws/db";
import { GetObjectCommand } from "@aws-sdk/client-s3";

// Function to download PDF from S3
export const downloadFromS3 = async (fileKey) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
  };

  try {
    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);

    const streamToBuffer = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });

    return await streamToBuffer(data.Body);
  } catch (err) {
    console.error("Error downloading from S3:", err);
    return null;
  }
};
