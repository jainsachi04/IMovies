const Movie = require('../models/Movie');
exports.list = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.genre && req.query.genre !== 'All') filter.genre = req.query.genre;
    if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };
    const movies = await Movie.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json({ movies });
  } catch (e) { next(e); }
};
exports.get = async (req, res, next) => {
  try { const movie = await Movie.findById(req.params.id); if (!movie) return res.status(404).json({ message: 'Movie not found.' }); res.json({ movie }); }
  catch (e) { next(e); }
};
exports.create = async (req, res, next) => { try { res.status(201).json({ movie: await Movie.create(req.body) }); } catch (e) { next(e); } };
exports.update = async (req, res, next) => { try { const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!movie) return res.status(404).json({ message: 'Movie not found.' }); res.json({ movie }); } catch (e) { next(e); } };
exports.remove = async (req, res, next) => { try { const movie = await Movie.findByIdAndDelete(req.params.id); if (!movie) return res.status(404).json({ message: 'Movie not found.' }); res.json({ message: 'Movie deleted.' }); } catch (e) { next(e); } };
