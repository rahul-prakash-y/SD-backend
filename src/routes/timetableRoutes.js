const express = require('express');
const router = express.Router();
const { getTimetable, createSlot, updateSlot, deleteSlot } = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getTimetable)
  .post(authorize('admin'), createSlot);

router.route('/:id')
  .put(authorize('admin'), updateSlot)
  .delete(authorize('admin'), deleteSlot);

module.exports = router;
