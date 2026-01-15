exports.getCategories = (req, res) => {
  // TODO: Fetch categories from DB
  res.json([
    { name: 'Celebrity', slug: 'celebrity' },
    { name: 'Auto & Bike', slug: 'auto-bike' },
    { name: 'Tech', slug: 'tech' },
    { name: 'Festivals', slug: 'festivals' }
  ]);
};
