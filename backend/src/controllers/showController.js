const Show = require('../models/Show');
const SEATS = Array.from({ length: 6 }, (_, r) => Array.from({ length: 8 }, (_, c) => `${String.fromCharCode(65 + r)}${c + 1}`)).flat();
exports.list = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.movieId) filter.movie = req.query.movieId;
    if (req.query.city) filter.city = new RegExp(`^${req.query.city}$`, 'i');
    if (req.query.date) { const start = new Date(req.query.date); start.setHours(0,0,0,0); const end = new Date(start); end.setDate(end.getDate()+1); filter.date = { $gte: start, $lt: end }; }
    const shows = await Show.find(filter).populate('movie', 'title posterUrl genre duration language').sort({ date: 1, time: 1 });
    res.json({ shows });
  } catch (e) { next(e); }
};
exports.get = async (req, res, next) => { try { const show = await Show.findById(req.params.id).populate('movie'); if (!show) return res.status(404).json({ message: 'Show not found.' }); res.json({ show }); } catch (e) { next(e); } };
exports.create = async (req, res, next) => {
  try {
    const { movie, cinema, city, date, time, price } = req.body;
    if (!movie || !cinema || !date || !time || price == null) return res.status(400).json({ message: 'Movie, cinema, date, time and price are required.' });
    const show = await Show.create({ movie, cinema, city: city || 'Indore', date, time, price, seats: SEATS.map(seatNumber => ({ seatNumber, status: 'available' })) });
    res.status(201).json({ show });
  } catch (e) { next(e); }
};
module.exports.SEATS = SEATS;
