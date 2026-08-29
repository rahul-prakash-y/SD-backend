const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: String },
    read: { type: Boolean, default: false, index: true },
    type: {
      type: String,
      enum: ['grade', 'announcement', 'attendance'],
      required: true,
    },
    roleTarget: {
      type: String,
      enum: ['student', 'teacher', 'all'],
      required: true,
      index: true,
    },
    // Optional: target a specific user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      sparse: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ roleTarget: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
