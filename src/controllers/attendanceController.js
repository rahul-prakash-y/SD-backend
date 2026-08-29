const AttendanceRecord = require('../models/AttendanceRecord');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @route   GET /api/attendance
 * @desc    Get attendance records (filterable by date, courseId, studentId)
 * @access  Private
 */
const getAttendance = asyncHandler(async (req, res) => {
  const { date, courseId, studentId, page = 1, limit = 100 } = req.query;

  const filter = {};
  if (date) filter.date = date;
  if (courseId) filter.courseId = courseId;
  if (studentId) filter.studentId = studentId;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [records, total] = await Promise.all([
    AttendanceRecord.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    AttendanceRecord.countDocuments(filter),
  ]);

  const mapped = records.map((r) => ({ ...r, id: r._id.toString() }));

  res.status(200).json({
    success: true,
    count: mapped.length,
    total,
    page: parseInt(page),
    data: mapped,
  });
});

/**
 * @route   POST /api/attendance/batch
 * @desc    Mark attendance for multiple students at once (upsert)
 * @access  Private (Teacher/Admin)
 */
const markBatchAttendance = asyncHandler(async (req, res) => {
  const { date, courseId, records } = req.body;

  if (!date || !courseId || !Array.isArray(records) || records.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide date, courseId, and an array of records',
    });
  }

  // Use bulkWrite for atomic, efficient batch upserts
  const bulkOps = records.map((rec) => ({
    updateOne: {
      filter: { date, courseId, studentId: rec.studentId },
      update: {
        $set: {
          studentName: rec.studentName,
          studentRoll: rec.studentRoll,
          status: rec.status,
          notes: rec.notes || '',
        },
        $setOnInsert: { date, courseId, studentId: rec.studentId },
      },
      upsert: true,
    },
  }));

  const result = await AttendanceRecord.bulkWrite(bulkOps);

  res.status(200).json({
    success: true,
    message: `Attendance recorded for ${records.length} students`,
    modified: result.modifiedCount,
    upserted: result.upsertedCount,
  });
});

/**
 * @route   GET /api/attendance/stats/:studentId
 * @desc    Get attendance statistics for a student
 * @access  Private
 */
const getStudentAttendanceStats = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const stats = await AttendanceRecord.aggregate([
    { $match: { studentId: require('mongoose').Types.ObjectId.createFromHexString(studentId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const total = stats.reduce((sum, s) => sum + s.count, 0);
  const present = stats.find((s) => s._id === 'present')?.count || 0;
  const late = stats.find((s) => s._id === 'late')?.count || 0;
  const absent = stats.find((s) => s._id === 'absent')?.count || 0;
  const excused = stats.find((s) => s._id === 'excused')?.count || 0;

  const attendanceRate = total > 0 ? (((present + late) / total) * 100).toFixed(1) : 0;

  res.status(200).json({
    success: true,
    data: {
      total,
      present,
      late,
      absent,
      excused,
      attendanceRate: parseFloat(attendanceRate),
    },
  });
});

module.exports = {
  getAttendance,
  markBatchAttendance,
  getStudentAttendanceStats,
};
