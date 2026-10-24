const mongoose = require('mongoose');
const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  status: { type: String, enum: ['available', 'booked'], default: 'available' },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { _id: false });
const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  cinema: { type: String, required: true },
  city: { type: String, default: 'Indore' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  seats: { type: [seatSchema], default: [] }
}, { timestamps: true });
showSchema.index({ movie: 1, date: 1, time: 1, cinema: 1 }, { unique: true });
module.exports = mongoose.model('Show', showSchema);
