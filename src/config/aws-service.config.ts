import * as dotenv from 'dotenv';
dotenv.config();

export const awsConfig = {
  region: process.env.AWS_S3_REGION,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  bucket: process.env.AWS_S3_BUCKET,
};
