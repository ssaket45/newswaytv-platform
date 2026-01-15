exports.getArticles = (req, res) => {
  // TODO: Fetch articles from DB
  res.json([
    { title: 'AI Revolutionizes Smartphone Photography', slug: 'ai-smartphone-photography', date: '2026-01-12', author: 'Jane Reporter' },
    { title: 'Electric Bikes Set to Dominate 2026 Auto Expo', slug: 'electric-bikes-auto-expo', date: '2026-01-10', author: 'John Writer' }
  ]);
};

exports.getArticleBySlug = (req, res) => {
  // TODO: Fetch article by slug from DB
  const { slug } = req.params;
  res.json({
    title: 'AI Revolutionizes Smartphone Photography',
    slug,
    date: '2026-01-12',
    author: 'Jane Reporter',
    content: 'Full article content here.'
  });
};
