const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  duration: { type: Number, required: true, min: 1 },
  language: { type: String, default: 'Hindi' },
  rating: { type: Number, default: 0, min: 0, max: 10 },
  posterUrl: { type: String, default: '' },
  releaseDate: { type: Date },
  featured: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Movie', movieSchema);
