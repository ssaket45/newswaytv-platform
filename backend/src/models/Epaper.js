const mongoose = require('mongoose');

const epaperSchema = new mongoose.Schema(
  {
    epaperId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    editionId: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    pages: { type: Number, default: 0 }
  },
  { timestamps: true }
);

epaperSchema.index({ date: 1, editionId: 1 });

module.exports = mongoose.model('Epaper', epaperSchema);
