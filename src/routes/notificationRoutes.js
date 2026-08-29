const express = require('express');
const router = express.Router();
const { getNotifications, markRead, clearAll } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getNotifications);
router.put('/:id/read', markRead);
router.delete('/clear', clearAll);

module.exports = router;
