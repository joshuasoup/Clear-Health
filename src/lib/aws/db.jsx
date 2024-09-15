import { S3Client } from "@aws-sdk/client-s3";

// Ensure environment variables are present
const validateEnv = () => {
  const requiredEnvVars = [
    "AWS_S3_REGION",
    "AWS_S3_ACCESS_KEY_ID",
    "AWS_S3_SECRET_ACCESS_KEY",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable ${envVar} is missing`);
    }
  }
};

let s3Client;

try {
  // Validate the required environment variables
  validateEnv();

  // Initialize the S3 client
  s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
  });

  console.log("S3 client initialized successfully");
} catch (error) {
  console.error("Error initializing S3 client:", error);
  throw error; // Re-throw the error to stop the app if initialization fails
}

export default s3Client;
