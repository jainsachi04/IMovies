const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
function makeToken(user) { return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'development_only_change_me', { expiresIn: '7d' }); }
function publicUser(user) { return { id: user._id, name: user.name, email: user.email, role: user.role }; }
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    const normalizedEmail = String(email).toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (e) { next(e); }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase().trim() }).select('+password');
    if (!user || !await bcrypt.compare(password || '', user.password)) return res.status(401).json({ message: 'Email or password is incorrect.' });
    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (e) { next(e); }
};
exports.me = (req, res) => res.json({ user: publicUser(req.user) });
