import { Bucket, Table } from "@serverless-stack/resources";

export function StorageStack({ stack, app }) {
  // Create an S3 bucket
  const bucket = new Bucket(stack, "Uploads", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
      },
    ],
  });

  // Create the DynamoDB table
  const table = new Table(stack, "Events", {
    fields: {
      userId: "string",
      eventId: "string",
    },
    primaryIndex: { partitionKey: "userId", sortKey: "eventId" },
  });

  return {
    table,
    bucket
  };
}