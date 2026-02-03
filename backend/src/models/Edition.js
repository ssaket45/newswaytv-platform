const mongoose = require('mongoose');

const editionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Edition', editionSchema);
