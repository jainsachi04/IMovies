const router = require('express').Router();
const c = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
router.use(protect); router.post('/', c.create); router.get('/mine', c.mine); router.patch('/:id/cancel', c.cancel);
module.exports = router;
