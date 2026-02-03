const Epaper = require('../models/Epaper');
const Edition = require('../models/Edition');

const defaultEditions = [
  { id: 'mumbai', name: 'Mumbai', slug: 'mumbai' },
  { id: 'delhi', name: 'Delhi', slug: 'delhi' },
  { id: 'pune', name: 'Pune', slug: 'pune' },
  { id: 'ideacity', name: 'Idea City', slug: 'ideacity' }
];

async function ensureEditions() {
  const count = await Edition.countDocuments();
  if (count === 0) {
    await Edition.insertMany(defaultEditions);
  }
}

exports.getEditions = async (req, res) => {
  try {
    await ensureEditions();
    const editions = await Edition.find().sort({ name: 1 });
    res.json(editions);
  } catch (error) {
    console.error('Failed to fetch editions', error);
    res.status(500).json({ message: 'Failed to fetch editions' });
  }
};

exports.getEpapers = async (req, res) => {
  try {
    const { date, editionId } = req.query;
    const query = {};

    if (date) {
      query.date = date;
    }
    if (editionId) {
      query.editionId = editionId;
    }

    const epapers = await Epaper.find(query).sort({ createdAt: -1 });
    res.json(epapers.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      date: item.date,
      editionId: item.editionId,
      pdfUrl: item.pdfUrl,
      thumbnailUrl: item.thumbnailUrl,
      pages: item.pages
    })));
  } catch (error) {
    console.error('Failed to fetch epapers', error);
    res.status(500).json({ message: 'Failed to fetch epapers' });
  }
};

exports.getEpaperById = async (req, res) => {
  try {
    const { id } = req.params;
    const epaper = await Epaper.findById(id);

    if (!epaper) {
      res.status(404).json({ message: 'Epaper not found' });
      return;
    }

    res.json({
      id: epaper._id.toString(),
      title: epaper.title,
      date: epaper.date,
      editionId: epaper.editionId,
      pdfUrl: epaper.pdfUrl,
      thumbnailUrl: epaper.thumbnailUrl,
      pages: epaper.pages
    });
  } catch (error) {
    console.error('Failed to fetch epaper', error);
    res.status(500).json({ message: 'Failed to fetch epaper' });
  }
};

exports.createEpaper = async (req, res) => {
  try {
    const { title, date, editionId, pdfUrl, thumbnailUrl } = req.body;
    const normalizedDate = normalizeDate(date);

    if (!title || !normalizedDate || !editionId || !pdfUrl) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const epaperId = `${editionId}-${normalizedDate}`;
    const epaper = await Epaper.findOneAndUpdate(
      { epaperId },
      {
        epaperId,
        title,
        date: normalizedDate,
        editionId,
        pdfUrl,
        thumbnailUrl: thumbnailUrl || ''
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      id: epaper._id.toString(),
      title: epaper.title,
      date: epaper.date,
      editionId: epaper.editionId,
      pdfUrl: epaper.pdfUrl,
      thumbnailUrl: epaper.thumbnailUrl,
      pages: epaper.pages
    });
  } catch (error) {
    console.error('Failed to create epaper', error);
    res.status(500).json({ message: 'Failed to create epaper' });
  }
};

function normalizeDate(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }
  const parts = value.split('-');
  if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return value;
}

exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const baseUrl = process.env.UPLOADS_PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const pdfUrl = `${baseUrl}/uploads/${req.file.filename}`;
    console.log('PDF uploaded:', req.file.originalname, '->', pdfUrl);
    res.status(201).json({ pdfUrl });
  } catch (error) {
    console.error('Failed to upload PDF', error);
    res.status(500).json({ message: 'Failed to upload PDF' });
  }
};
