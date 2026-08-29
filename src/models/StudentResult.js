const mongoose = require('mongoose');

const gradeItemSchema = new mongoose.Schema(
  {
    courseId: String,
    courseName: String,
    courseCode: String,
    credits: Number,
    gradeLetter: String,
    percentage: Number,
    gpaPoint: Number,
    teacherName: String,
    remarks: String,
  },
  { _id: false }
);

const semesterResultSchema = new mongoose.Schema(
  {
    semester: String,
    sgpa: Number,
    status: {
      type: String,
      enum: ['Pass', 'Fail'],
    },
    grades: [gradeItemSchema],
  },
  { _id: false }
);

const hallTicketSubjectSchema = new mongoose.Schema(
  {
    subjectCode: String,
    subjectName: String,
  },
  { _id: false }
);

const hallTicketSchema = new mongoose.Schema(
  {
    hallTicketNo: String,
    registerNumber: String,
    programme: String,
    semester: String,
    candidateName: String,
    dob: String,
    examCenter: String,
    seatNo: String,
    examDates: String,
    candidatePhoto: String,
    subjects: [hallTicketSubjectSchema],
    status: {
      type: String,
      enum: ['Issued', 'Pending'],
      default: 'Pending',
    },
    publishedDate: String,
  },
  { _id: false }
);

const studentResultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentName: { type: String, required: true },
    rollNo: { type: String, required: true, index: true },
    department: String,
    currentSemester: String,
    cgpa: { type: Number, min: 0, max: 10 },
    publishedDate: String,
    academicYear: String,
    semesters: {
      type: Map,
      of: semesterResultSchema,
    },
    hallTicket: hallTicketSchema,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

studentResultSchema.index({ studentId: 1, rollNo: 1 });

module.exports = mongoose.model('StudentResult', studentResultSchema);
