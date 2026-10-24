const crypto = require('crypto');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
exports.create = async (req, res, next) => {
  try {
    const { showId, seats } = req.body;
    if (!showId || !Array.isArray(seats) || seats.length === 0) return res.status(400).json({ message: 'Choose a show and at least one seat.' });
    const chosen = [...new Set(seats.map(String))];
    if (chosen.length !== seats.length) return res.status(400).json({ message: 'Duplicate seats were selected.' });
    // One atomic MongoDB update ensures two users cannot book the same seat simultaneously.
    const show = await Show.findOneAndUpdate(
      { _id: showId, seats: { $all: chosen.map(seatNumber => ({ $elemMatch: { seatNumber, status: 'available' } })) } },
      { $set: { 'seats.$[seat].status': 'booked', 'seats.$[seat].bookedBy': req.user._id } },
      { new: true, arrayFilters: [{ 'seat.seatNumber': { $in: chosen }, 'seat.status': 'available' }] }
    );
    if (!show) return res.status(409).json({ message: 'One or more selected seats are no longer available. Refresh and choose again.' });
    const booking = await Booking.create({ user: req.user._id, show: show._id, movie: show.movie, seats: chosen, totalAmount: show.price * chosen.length, bookingCode: `IM-${crypto.randomBytes(4).toString('hex').toUpperCase()}` });
    res.status(201).json({ booking: await booking.populate([{ path: 'movie', select: 'title posterUrl' }, { path: 'show', select: 'cinema city date time price' }]) });
  } catch (e) { next(e); }
};
exports.mine = async (req, res, next) => { try { const bookings = await Booking.find({ user: req.user._id }).populate('movie', 'title posterUrl').populate('show', 'cinema city date time price').sort({ createdAt: -1 }); res.json({ bookings }); } catch (e) { next(e); } };
exports.cancel = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    if (booking.status === 'cancelled') return res.status(400).json({ message: 'Booking is already cancelled.' });
    const show = await Show.findById(booking.show);
    if (show) { for (const seat of show.seats) if (booking.seats.includes(seat.seatNumber) && String(seat.bookedBy) === String(req.user._id)) { seat.status = 'available'; seat.bookedBy = null; } await show.save(); }
    booking.status = 'cancelled'; await booking.save(); res.json({ booking, message: 'Booking cancelled.' });
  } catch (e) { next(e); }
};
