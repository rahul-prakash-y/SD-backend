const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAnnouncements)
  .post(authorize('admin', 'teacher'), createAnnouncement);

router.delete('/:id', authorize('admin', 'teacher'), deleteAnnouncement);

module.exports = router;
