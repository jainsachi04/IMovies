const jwt = require('jsonwebtoken');
const User = require('../models/User');
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Please log in to continue.' });
    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'development_only_change_me');
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Account not found.' });
    req.user = user;
    next();
  } catch (err) { return res.status(401).json({ message: 'Invalid or expired token.' }); }
}
function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Administrator access required.' });
  next();
}
module.exports = { protect, adminOnly };
