const express = require('express');
const cors = require('cors');
const categoriesRouter = require('./routes/categories');
const articlesRouter = require('./routes/articles');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/categories', categoriesRouter);
app.use('/api/articles', articlesRouter);

// Future: Add admin authentication middleware here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
