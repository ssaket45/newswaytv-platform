const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const categoriesRouter = require('./routes/categories');
const articlesRouter = require('./routes/articles');
const epaperRouter = require('./routes/epaper');
const { connectToDatabase } = require('./db');
const { uploadsDir } = require('./uploads');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.use('/api/categories', categoriesRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/epaper', epaperRouter);

// Future: Add admin authentication middleware here

const PORT = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });
