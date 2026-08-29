const mongoose = require('mongoose');

const timetableSlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
      index: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subject: { type: String, required: true },
    teacher: { type: String, required: true },
    room: { type: String, required: true },
    color: { type: String, default: 'bg-emerald-500/10 border-emerald-500 text-emerald-700' },
    badge: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

timetableSlotSchema.index({ day: 1, startTime: 1 });

module.exports = mongoose.model('TimetableSlot', timetableSlotSchema);
