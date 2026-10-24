const router = require('express').Router();
const c = require('../controllers/showController');
const { protect, adminOnly } = require('../middleware/auth');
router.get('/', c.list); router.get('/:id', c.get); router.post('/', protect, adminOnly, c.create);
module.exports = router;
