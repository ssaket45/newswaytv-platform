const express = require('express');
const router = express.Router();
const { getArticles, getArticleBySlug } = require('../controllers/articlesController');

router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);

module.exports = router;
