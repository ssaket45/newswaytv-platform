const mongoose = require('mongoose');

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI is not set. API will not connect to MongoDB.');
    return null;
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri, {
      autoIndex: true,
      tls: true,
      tlsAllowInvalidCertificates: true
    });
    console.log('MongoDB connected');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed', error);
    throw error;
  }
}

module.exports = { connectToDatabase };
