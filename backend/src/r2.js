const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

function getR2Client() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey }
  });
}

async function uploadToR2({
  key,
  body,
  contentType
}) {
  const client = getR2Client();
  if (!client) {
    return null;
  }

  const bucket = process.env.R2_BUCKET;
  if (!bucket) {
    throw new Error('R2_BUCKET is not set');
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType
    })
  );

  const publicBase = process.env.R2_PUBLIC_BASE_URL;
  if (!publicBase) {
    throw new Error('R2_PUBLIC_BASE_URL is not set');
  }

  return `${publicBase.replace(/\/$/, '')}/${key}`;
}

module.exports = { uploadToR2, getR2Client };
