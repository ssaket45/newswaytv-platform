const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const categoriesRouter = require('./routes/categories');
const articlesRouter = require('./routes/articles');
const epaperRouter = require('./routes/epaper');
const { connectToDatabase } = require('./db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
if (!process.env.R2_PUBLIC_BASE_URL) {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

app.use('/api/categories', categoriesRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/epaper', epaperRouter);

// Future: Add admin authentication middleware here

const PORT = process.env.PORT || 3000;

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

connectToDatabase()
  .then(() => {
    // Run cleanup after DB is connected and models are loaded
    const { cleanupOldEpapers } = require('./controllers/epaperController');
    cleanupOldEpapers().catch(console.error);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Startup error:', err);
    process.exit(1);
  });
