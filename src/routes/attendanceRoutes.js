const express = require('express');
const router = express.Router();
const { getAttendance, markBatchAttendance, getStudentAttendanceStats } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getAttendance);
router.post('/batch', authorize('admin', 'teacher'), markBatchAttendance);
router.get('/stats/:studentId', getStudentAttendanceStats);

module.exports = router;
