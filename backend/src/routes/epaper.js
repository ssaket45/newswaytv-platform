const express = require('express');
const router = express.Router();
const {
  getEditions,
  getEpapers,
  getEpaperById,
  createEpaper,
  uploadPdf
} = require('../controllers/epaperController');
const { upload } = require('../uploads');

router.get('/editions', getEditions);
router.get('/', getEpapers);
router.get('/:id', getEpaperById);
router.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err.message || err);
      res.status(400).json({ message: err.message || 'Upload failed' });
      return;
    }
    next();
  });
}, uploadPdf);
router.post('/', createEpaper);

module.exports = router;
