const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    authorName: { type: String, required: true },
    authorRole: { type: String, required: true },
    authorAvatar: { type: String },
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Announcement content is required'],
    },
    date: { type: String },
    priority: {
      type: String,
      enum: ['normal', 'important', 'urgent'],
      default: 'normal',
      index: true,
    },
    targetCourse: { type: String },
  },
  {
    timestamps: true,
  }
);

// Most recent first, filterable by priority
announcementSchema.index({ createdAt: -1, priority: 1 });

module.exports = mongoose.model('Announcement', announcementSchema);
