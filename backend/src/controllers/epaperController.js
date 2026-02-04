// Automatically delete epapers older than 45 days
const DAY_MS = 24 * 60 * 60 * 1000;
const RETENTION_DAYS = 45;
async function cleanupOldEpapers() {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * DAY_MS);
  const oldEpapers = await Epaper.find({ date: { $lt: cutoff.toISOString().slice(0, 10) } });
  for (const epaper of oldEpapers) {
    // Optionally: delete file from storage (Firebase/R2) if needed
    // For now, just remove DB record
    await Epaper.deleteOne({ _id: epaper._id });
    console.log('Deleted old epaper:', epaper.title, epaper.date);
  }
}
exports.cleanupOldEpapers = cleanupOldEpapers;

const path = require('path');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
const Epaper = require('../models/Epaper');
const Edition = require('../models/Edition');
const { uploadToR2 } = require('../r2');
const { uploadToFirebase } = require('../firebase');

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
      const dateStr = String(date);
      const monthPrefix = dateStr.slice(0, 7);
      const start = `${monthPrefix}-01`;
      const end = dateStr;
      query.date = { $gte: start, $lte: end };
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

exports.updateEpaper = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, editionId, pdfUrl, thumbnailUrl } = req.body;
    const normalizedDate = normalizeDate(date);

    if (!title || !normalizedDate || !editionId || !pdfUrl) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const epaper = await Epaper.findByIdAndUpdate(
      id,
      {
        title,
        date: normalizedDate,
        editionId,
        pdfUrl,
        thumbnailUrl: thumbnailUrl || ''
      },
      { new: true }
    );

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
    console.error('Failed to update epaper', error);
    res.status(500).json({ message: 'Failed to update epaper' });
  }
};

exports.deleteEpaper = async (req, res) => {
  try {
    const { id } = req.params;
    const epaper = await Epaper.findByIdAndDelete(id);
    if (!epaper) {
      res.status(404).json({ message: 'Epaper not found' });
      return;
    }
    res.json({ message: 'Epaper deleted' });
  } catch (error) {
    console.error('Failed to delete epaper', error);
    res.status(500).json({ message: 'Failed to delete epaper' });
  }
};

exports.downloadEpaper = async (req, res) => {
  try {
    const { id } = req.params;
    const epaper = await Epaper.findById(id);
    if (!epaper) {
      res.status(404).json({ message: 'Epaper not found' });
      return;
    }

    const response = await fetch(epaper.pdfUrl);
    if (!response.ok) {
      res.status(502).json({ message: 'Failed to fetch PDF' });
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/pdf');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Content-Disposition', `attachment; filename=\"${epaper.title || 'epaper'}.pdf\"`);
    res.status(200).send(buffer);
  } catch (error) {
    console.error('Failed to download epaper', error);
    res.status(500).json({ message: 'Failed to download epaper' });
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

    const originalName = req.file.originalname || 'epaper.pdf';
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `epaper/${Date.now()}_${safeName}`;

    const firebaseUrl = await uploadToFirebase({
      key,
      body: req.file.buffer,
      contentType: req.file.mimetype
    });

    if (firebaseUrl) {
      console.log('PDF uploaded to Firebase Storage:', firebaseUrl);
      res.status(201).json({ pdfUrl: firebaseUrl });
      return;
    }

    const r2Url = await uploadToR2({
      key,
      body: req.file.buffer,
      contentType: req.file.mimetype
    });

    if (r2Url) {
      console.log('PDF uploaded to R2:', r2Url);
      res.status(201).json({ pdfUrl: r2Url });
      return;
    }

    // Fallback: local disk (dev only)
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filename = `${Date.now()}_${safeName}`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, req.file.buffer);

    const forwardedProto = req.headers['x-forwarded-proto'];
    const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
    const safeProtocol = protocol || req.protocol || 'https';
    const baseUrl = process.env.UPLOADS_PUBLIC_BASE_URL || `${safeProtocol}://${req.get('host')}`;
    const pdfUrl = `${baseUrl.replace(/\/$/, '')}/uploads/${filename}`;
    console.log('PDF uploaded locally:', pdfUrl);
    res.status(201).json({ pdfUrl });
  } catch (error) {
    console.error('Failed to upload PDF', error);
    res.status(500).json({ message: 'Failed to upload PDF' });
  }
};
