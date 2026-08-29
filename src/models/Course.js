const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    teacherName: { type: String, required: true },
    schedule: { type: String },
    room: { type: String },
    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    color: { type: String, default: 'emerald' },
    iconName: { type: String, default: 'BookOpen' },
    description: { type: String },
    totalStudents: { type: Number, default: 0 },
    syllabusProgress: { type: Number, default: 0, min: 0, max: 100 },
    studyMaterialsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.index({ teacherId: 1, code: 1 });

module.exports = mongoose.model('Course', courseSchema);
