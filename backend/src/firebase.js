const admin = require('firebase-admin');

let initialized = false;

function initFirebase() {
  if (initialized) {
    return admin;
  }

  const projectId = process.env.FB_PROJECT_ID;
  const clientEmail = process.env.FB_CLIENT_EMAIL;
  let privateKey = process.env.FB_PRIVATE_KEY;
  const storageBucket = process.env.FB_STORAGE_BUCKET;

  if (!projectId || !clientEmail || !privateKey || !storageBucket) {
    return null;
  }

  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey
    }),
    storageBucket
  });

  initialized = true;
  return admin;
}

async function uploadToFirebase({ key, body, contentType }) {
  const sdk = initFirebase();
  if (!sdk) {
    return null;
  }

  const bucket = sdk.storage().bucket();
  const file = bucket.file(key);
  await file.save(body, {
    contentType,
    resumable: false,
    public: true
  });

  const publicBase = process.env.FB_PUBLIC_BASE_URL || `https://storage.googleapis.com/${bucket.name}`;
  return `${publicBase.replace(/\/$/, '')}/${key}`;
}

module.exports = { uploadToFirebase };
