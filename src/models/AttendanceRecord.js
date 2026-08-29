const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema(
  {
    date: {
      type: String, // YYYY-MM-DD format
      required: [true, 'Date is required'],
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentName: { type: String, required: true },
    studentRoll: { type: String, required: true },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      required: true,
    },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookup: one record per student per course per day
attendanceRecordSchema.index({ date: 1, courseId: 1, studentId: 1 }, { unique: true });
// Index for student attendance history
attendanceRecordSchema.index({ studentId: 1, date: -1 });

module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);
