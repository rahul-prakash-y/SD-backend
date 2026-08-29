const mongoose = require('mongoose');

const changeRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentName: { type: String, required: true },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    teacherName: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'resolved'],
      default: 'pending',
      index: true,
    },
    timestamp: { type: String },
  },
  {
    timestamps: true,
  }
);

changeRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ChangeRequest', changeRequestSchema);
