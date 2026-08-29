const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password by default
    },
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      required: true,
      index: true,
    },
    avatar: { type: String, default: '' },
    phone: { type: String, trim: true },
    joinedDate: { type: String },

    // ─── Student-specific fields ────────────────────────
    studentId: { type: String, sparse: true, index: true },
    rollNo: { type: String, sparse: true },
    grade: String,
    section: String,
    semester: String,
    department: String,
    mentorName: String,
    mentorId: String,
    mentorPhone: String,
    residenceType: {
      type: String,
      enum: ['Day Scholar', 'Hosteler', null],
    },
    busRoute: String,
    busNumber: String,
    busStop: String,
    hostelName: String,
    roomNumber: String,
    gpa: { type: Number, min: 0, max: 10 },
    attendanceRate: { type: Number, min: 0, max: 100 },
    guardianName: String,
    guardianContact: String,
    bloodGroup: String,
    academicYear: String,

    // ─── Teacher-specific fields ────────────────────────
    title: String,
    subjectsTaught: [String],
    employeeId: { type: String, sparse: true },
    officeHours: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes for common queries ─────────────────────
userSchema.index({ role: 1, department: 1 });
userSchema.index({ email: 1, role: 1 });

// ─── Pre-save: hash password ────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance method: compare password ──────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Strip sensitive fields on JSON serialization ───
userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  // Map _id to id for frontend compatibility
  obj.id = obj._id.toString();
  delete obj._id;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
