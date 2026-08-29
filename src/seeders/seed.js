/**
 * EduPortal Database Seeder
 * Seeds MongoDB with the same demo data used in the frontend localStorage.
 * Run: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const Course = require('../models/Course');
const AttendanceRecord = require('../models/AttendanceRecord');
const Announcement = require('../models/Announcement');
const TimetableSlot = require('../models/TimetableSlot');
const Notification = require('../models/Notification');
const StudentResult = require('../models/StudentResult');

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding database...\n');

  // Clear all collections
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    AttendanceRecord.deleteMany({}),
    Announcement.deleteMany({}),
    TimetableSlot.deleteMany({}),
    Notification.deleteMany({}),
    StudentResult.deleteMany({}),
  ]);
  console.log('  ✓ Cleared all collections');

  // ─── USERS ─────────────────────────────────────────
  const users = await User.create([
    {
      username: 'admin',
      email: 'admin@bitsathy.ac.in',
      password: 'admin@1234',
      name: 'Institutional Administrator',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+91 (04295) 226000',
      joinedDate: 'Jan 2018',
      department: 'Central Academic Administration & Operations',
      title: 'Chief Institutional Administrator',
      employeeId: 'ADM-BIT-01',
    },
    {
      username: 'MuratGursoy',
      email: 'murat.gursoy@school.edu',
      password: 'password123',
      name: 'Murat Gürsoy',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 349-8291',
      joinedDate: 'Sep 2024',
      studentId: 'STU-2024-418',
      rollNo: '2024-418',
      semester: '5th Semester',
      department: 'Computer Science & Engineering',
      mentorName: 'Dr. Sarah Jenkins',
      mentorId: 'FAC-7742',
      mentorPhone: '+1 (555) 782-9912',
      residenceType: 'Day Scholar',
      busRoute: 'Route #14 - North City Express',
      busNumber: 'BUS-042',
      busStop: 'Central Square Station (Stop #4)',
      hostelName: 'Emerald Heights Residence Block-B',
      roomNumber: 'Room 304-B',
      bloodGroup: 'O+ Positive',
      academicYear: '2024 - 2028',
      gpa: 3.85,
      attendanceRate: 94.8,
      guardianName: 'Selim Gürsoy',
      guardianContact: '+1 (555) 912-0044',
    },
    {
      username: 'SarahJenkins',
      email: 'sarah.jenkins@school.edu',
      password: 'password123',
      name: 'Dr. Sarah Jenkins',
      role: 'teacher',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 782-9912',
      joinedDate: 'Aug 2019',
      department: 'Department of Computer Science & Mathematics',
      title: 'Senior Professor & Department Chair',
      subjectsTaught: ['AP Calculus BC', 'Classical Mechanics & Physics', 'Advanced Algorithms'],
      employeeId: 'FAC-7742',
      officeHours: 'Mon & Thu 2:00 PM - 4:30 PM',
    },
    {
      username: 'AlanCooper',
      email: 'alan.cooper@school.edu',
      password: 'password123',
      name: 'Prof. Alan Cooper',
      role: 'teacher',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 819-3321',
      joinedDate: 'Jul 2020',
      department: 'Department of Computer Science & Engineering',
      title: 'Associate Professor - Software Systems',
      subjectsTaught: ['Advanced Computer Science', 'Data Structures', 'Database Systems'],
      employeeId: 'FAC-8819',
      officeHours: 'Tue & Fri 03:00 PM - 05:00 PM',
    },
    {
      username: 'ElenaVance',
      email: 'elena.vance@school.edu',
      password: 'password123',
      name: 'Prof. Elena Vance',
      role: 'teacher',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 902-1144',
      joinedDate: 'Jan 2021',
      department: 'Department of Humanities & Rhetoric',
      title: 'Faculty Lead - World Literature',
      subjectsTaught: ['World Literature & Rhetoric', 'Critical Communication'],
      employeeId: 'FAC-9021',
      officeHours: 'Mon & Wed 01:00 PM - 03:00 PM',
    },
    {
      username: 'EmmaWatson',
      email: 'emma.w@school.edu',
      password: 'password123',
      name: 'Emma Watson',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 441-2099',
      joinedDate: 'Sep 2024',
      studentId: 'STU-2024-419',
      rollNo: '2024-419',
      semester: '5th Semester',
      department: 'Computer Science & Engineering',
      mentorName: 'Dr. Sarah Jenkins',
      mentorId: 'FAC-7742',
      mentorPhone: '+1 (555) 782-9912',
      residenceType: 'Hosteler',
      hostelName: 'Sapphire Girls Residency Hall (Block A)',
      roomNumber: 'Room 214-A',
      bloodGroup: 'A+ Positive',
      academicYear: '2024 - 2028',
      gpa: 3.92,
      attendanceRate: 97.5,
    },
    {
      username: 'LucasVance',
      email: 'lucas.v@school.edu',
      password: 'password123',
      name: 'Lucas Vance',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 883-1142',
      joinedDate: 'Sep 2024',
      studentId: 'STU-2024-420',
      rollNo: '2024-420',
      semester: '5th Semester',
      department: 'Computer Science & Engineering',
      mentorName: 'Prof. Alan Cooper',
      mentorId: 'FAC-8819',
      mentorPhone: '+1 (555) 819-3321',
      residenceType: 'Day Scholar',
      busRoute: 'Route #08 - South Bay Line',
      busNumber: 'BUS-019',
      busStop: 'Riverside Avenue (Stop #2)',
      bloodGroup: 'B+ Positive',
      academicYear: '2024 - 2028',
      gpa: 3.65,
      attendanceRate: 91.2,
    },
  ]);
  console.log(`  ✓ Created ${users.length} users`);

  // Build lookup
  const userMap = {};
  users.forEach((u) => { userMap[u.username] = u; });

  // ─── COURSES ───────────────────────────────────────
  const courses = await Course.create([
    { code: 'MATH-401', title: 'AP Calculus BC', teacherId: userMap.SarahJenkins._id, teacherName: 'Dr. Sarah Jenkins', schedule: 'Mon, Wed, Fri • 09:00 AM - 10:15 AM', room: 'Room 304 (Math Hall)', credits: 4, color: 'emerald', iconName: 'Calculator', description: 'Differential and integral calculus with series analysis.', totalStudents: 28, syllabusProgress: 72, studyMaterialsCount: 14 },
    { code: 'PHYS-302', title: 'Classical & Modern Physics', teacherId: userMap.SarahJenkins._id, teacherName: 'Dr. Sarah Jenkins', schedule: 'Tue, Thu • 10:30 AM - 12:00 PM', room: 'Lab B (Physics Hall)', credits: 4, color: 'sky', iconName: 'Atom', description: 'Newtonian mechanics, thermodynamics, and electromagnetism.', totalStudents: 26, syllabusProgress: 65, studyMaterialsCount: 18 },
    { code: 'CS-205', title: 'Advanced Computer Science', teacherId: userMap.AlanCooper._id, teacherName: 'Prof. Alan Cooper', schedule: 'Mon, Wed • 01:15 PM - 02:30 PM', room: 'Lab 4 (Computer Center)', credits: 3, color: 'violet', iconName: 'Code2', description: 'Data structures, algorithms, and computational complexity.', totalStudents: 32, syllabusProgress: 80, studyMaterialsCount: 22 },
    { code: 'LIT-110', title: 'World Literature & Rhetoric', teacherId: userMap.ElenaVance._id, teacherName: 'Prof. Elena Vance', schedule: 'Tue, Fri • 01:00 PM - 02:15 PM', room: 'Room 201 (Humanities)', credits: 3, color: 'amber', iconName: 'BookOpen', description: 'Comparative global literature and rhetorical arguments.', totalStudents: 30, syllabusProgress: 60, studyMaterialsCount: 9 },
    { code: 'CHEM-202', title: 'Organic Chemistry & Biochemistry', teacherId: userMap.SarahJenkins._id, teacherName: 'Dr. Robert Shaw', schedule: 'Wed, Fri • 10:30 AM - 11:45 AM', room: 'Chem Lab 2', credits: 4, color: 'rose', iconName: 'FlaskConical', description: 'Structure, reactivity, synthesis of carbon compounds.', totalStudents: 25, syllabusProgress: 58, studyMaterialsCount: 16 },
    { code: 'HIST-304', title: 'World History & Modern Civics', teacherId: userMap.AlanCooper._id, teacherName: 'Prof. Marcus Aurel', schedule: 'Mon, Thu • 11:30 AM - 12:45 PM', room: 'Room 108 (Social Wing)', credits: 3, color: 'indigo', iconName: 'Landmark', description: 'Major global movements and constitutional systems.', totalStudents: 29, syllabusProgress: 75, studyMaterialsCount: 11 },
  ]);
  console.log(`  ✓ Created ${courses.length} courses`);

  // ─── ATTENDANCE ────────────────────────────────────
  const attendanceRecords = await AttendanceRecord.create([
    { date: '2026-08-28', courseId: courses[0]._id, studentId: userMap.MuratGursoy._id, studentName: 'Murat Gürsoy', studentRoll: 'STU-2024-418', status: 'present' },
    { date: '2026-08-28', courseId: courses[0]._id, studentId: userMap.EmmaWatson._id, studentName: 'Emma Watson', studentRoll: 'STU-2024-419', status: 'present' },
    { date: '2026-08-28', courseId: courses[0]._id, studentId: userMap.LucasVance._id, studentName: 'Lucas Vance', studentRoll: 'STU-2024-420', status: 'late', notes: 'Arrived 10 mins late' },
  ]);
  console.log(`  ✓ Created ${attendanceRecords.length} attendance records`);

  // ─── ANNOUNCEMENTS ────────────────────────────────
  const announcements = await Announcement.create([
    { authorId: userMap.SarahJenkins._id, authorName: 'Dr. Sarah Jenkins', authorRole: 'Mentor & Department Chair', authorAvatar: userMap.SarahJenkins.avatar, title: '📐 Department Mentorship & Semester Progress Review', content: 'All 5th Semester students under Dr. Sarah Jenkins mentorship are requested to attend the academic review meeting this Thursday in Room 304.', date: 'August 28, 2026', priority: 'important', targetCourse: 'Computer Science & Engineering' },
    { authorId: userMap.admin._id, authorName: 'Institutional Administrator', authorRole: 'Chief Institutional Administrator', authorAvatar: userMap.admin.avatar, title: '📢 Campus Master Schedule & Saturday Tutorial Timetable Activated', content: 'The Central Academic Administration has officially enabled the Monday through Saturday master timetable.', date: 'August 28, 2026', priority: 'urgent', targetCourse: 'All Students & Faculty' },
    { authorId: userMap.admin._id, authorName: 'Campus Transport Committee', authorRole: 'Transport Incharge', authorAvatar: userMap.AlanCooper.avatar, title: '🚌 Day Scholar Bus Route Schedule Update', content: 'All Day Scholar buses (Routes 01 to 24) will operate on the regular schedule including Saturday tutorial sessions.', date: 'August 27, 2026', priority: 'normal', targetCourse: 'All Day Scholars' },
  ]);
  console.log(`  ✓ Created ${announcements.length} announcements`);

  // ─── TIMETABLE ─────────────────────────────────────
  const timetableSlots = await TimetableSlot.create([
    { day: 'Monday', startTime: '09:00 AM', endTime: '10:15 AM', subject: 'AP Calculus BC', teacher: 'Dr. Sarah Jenkins', room: 'Room 304', color: 'bg-emerald-500/10 border-emerald-500 text-emerald-700' },
    { day: 'Monday', startTime: '10:30 AM', endTime: '11:45 AM', subject: 'World History & Civics', teacher: 'Prof. Marcus Aurel', room: 'Room 108', color: 'bg-indigo-500/10 border-indigo-500 text-indigo-700' },
    { day: 'Monday', startTime: '01:15 PM', endTime: '02:30 PM', subject: 'Advanced Computer Science', teacher: 'Prof. Alan Cooper', room: 'Lab 4', color: 'bg-purple-500/10 border-purple-500 text-purple-700' },
    { day: 'Tuesday', startTime: '10:30 AM', endTime: '12:00 PM', subject: 'Classical & Modern Physics', teacher: 'Dr. Sarah Jenkins', room: 'Lab B', color: 'bg-sky-500/10 border-sky-500 text-sky-700' },
    { day: 'Tuesday', startTime: '01:00 PM', endTime: '02:15 PM', subject: 'World Literature & Rhetoric', teacher: 'Prof. Elena Vance', room: 'Room 201', color: 'bg-amber-500/10 border-amber-500 text-amber-700' },
    { day: 'Wednesday', startTime: '09:00 AM', endTime: '10:15 AM', subject: 'AP Calculus BC', teacher: 'Dr. Sarah Jenkins', room: 'Room 304', color: 'bg-emerald-500/10 border-emerald-500 text-emerald-700' },
    { day: 'Wednesday', startTime: '10:30 AM', endTime: '11:45 AM', subject: 'Organic Chemistry', teacher: 'Dr. Robert Shaw', room: 'Chem Lab 2', color: 'bg-rose-500/10 border-rose-500 text-rose-700' },
    { day: 'Wednesday', startTime: '01:15 PM', endTime: '02:30 PM', subject: 'Advanced Computer Science', teacher: 'Prof. Alan Cooper', room: 'Lab 4', color: 'bg-purple-500/10 border-purple-500 text-purple-700' },
    { day: 'Thursday', startTime: '10:30 AM', endTime: '12:00 PM', subject: 'Classical & Modern Physics', teacher: 'Dr. Sarah Jenkins', room: 'Lab B', color: 'bg-sky-500/10 border-sky-500 text-sky-700' },
    { day: 'Thursday', startTime: '11:30 AM', endTime: '12:45 PM', subject: 'World History & Civics', teacher: 'Prof. Marcus Aurel', room: 'Room 108', color: 'bg-indigo-500/10 border-indigo-500 text-indigo-700' },
    { day: 'Friday', startTime: '09:00 AM', endTime: '10:15 AM', subject: 'AP Calculus BC', teacher: 'Dr. Sarah Jenkins', room: 'Room 304', color: 'bg-emerald-500/10 border-emerald-500 text-emerald-700' },
    { day: 'Friday', startTime: '10:30 AM', endTime: '11:45 AM', subject: 'Organic Chemistry', teacher: 'Dr. Robert Shaw', room: 'Chem Lab 2', color: 'bg-rose-500/10 border-rose-500 text-rose-700' },
    { day: 'Friday', startTime: '01:00 PM', endTime: '02:15 PM', subject: 'World Literature & Rhetoric', teacher: 'Prof. Elena Vance', room: 'Room 201', color: 'bg-amber-500/10 border-amber-500 text-amber-700' },
    { day: 'Saturday', startTime: '09:00 AM', endTime: '10:30 AM', subject: 'AP Calculus BC (Tutorial)', teacher: 'Dr. Sarah Jenkins', room: 'Room 304', color: 'bg-emerald-500/10 border-emerald-500 text-emerald-700' },
    { day: 'Saturday', startTime: '10:45 AM', endTime: '12:15 PM', subject: 'Advanced CS (Lab Project)', teacher: 'Prof. Alan Cooper', room: 'Lab 4', color: 'bg-purple-500/10 border-purple-500 text-purple-700' },
    { day: 'Saturday', startTime: '01:00 PM', endTime: '02:30 PM', subject: 'Physics & Engineering Practicum', teacher: 'Dr. Sarah Jenkins', room: 'Lab B', color: 'bg-sky-500/10 border-sky-500 text-sky-700' },
  ]);
  console.log(`  ✓ Created ${timetableSlots.length} timetable slots`);

  // ─── NOTIFICATIONS ─────────────────────────────────
  const notifications = await Notification.create([
    { title: 'Department Notice', message: 'Mentorship review schedule published by Dr. Sarah Jenkins', timestamp: '2 hours ago', read: false, type: 'announcement', roleTarget: 'student' },
    { title: 'Transport Update', message: 'Bus routes active on regular schedule including Saturday sessions', timestamp: '5 hours ago', read: false, type: 'announcement', roleTarget: 'student' },
  ]);
  console.log(`  ✓ Created ${notifications.length} notifications`);

  // ─── STUDENT RESULTS ───────────────────────────────
  const results = await StudentResult.create([
    {
      studentId: userMap.MuratGursoy._id,
      studentName: 'Murat Gürsoy',
      rollNo: '2024-418',
      department: 'Computer Science & Engineering',
      currentSemester: 'Semester 5',
      cgpa: 3.85,
      publishedDate: 'August 28, 2026',
      academicYear: '2024 - 2028',
      semesters: {
        'Semester 1': { semester: 'Semester 1', sgpa: 3.80, status: 'Pass', grades: [{ courseId: 'c101', courseName: 'Engineering Mathematics I', courseCode: 'MATH-101', credits: 4, gradeLetter: 'A', percentage: 94, gpaPoint: 4.0, teacherName: 'Dr. Sarah Jenkins', remarks: 'Excellent foundation.' }] },
        'Semester 5': { semester: 'Semester 5', sgpa: 3.85, status: 'Pass', grades: [{ courseId: 'c1', courseName: 'AP Calculus BC', courseCode: 'MATH-401', credits: 4, gradeLetter: 'A', percentage: 96, gpaPoint: 4.0, teacherName: 'Dr. Sarah Jenkins', remarks: 'High proficiency.' }] },
      },
      hallTicket: { hallTicketNo: 'CCAWBCM141', registerNumber: 'CCAWBCM141', programme: 'B.Com (Self Financing)', semester: 'V', candidateName: 'AMRITHA HARIDASAN', status: 'Issued', examDates: 'NOVEMBER - 2024' },
    },
    {
      studentId: userMap.EmmaWatson._id,
      studentName: 'Emma Watson',
      rollNo: '2024-419',
      department: 'Computer Science & Engineering',
      currentSemester: 'Semester 5',
      cgpa: 3.92,
      publishedDate: 'August 28, 2026',
      academicYear: '2024 - 2028',
      semesters: {
        'Semester 5': { semester: 'Semester 5', sgpa: 3.92, status: 'Pass', grades: [{ courseId: 'c1', courseName: 'AP Calculus BC', courseCode: 'MATH-401', credits: 4, gradeLetter: 'A+', percentage: 98, gpaPoint: 4.0, teacherName: 'Dr. Sarah Jenkins', remarks: 'Outstanding.' }] },
      },
      hallTicket: { hallTicketNo: 'HT-2026-4190', examCenter: 'Central Engineering Hall (Block B)', seatNo: 'Seat B-08', examDates: 'Sept 15 - Sept 25, 2026', status: 'Issued' },
    },
  ]);
  console.log(`  ✓ Created ${results.length} student results`);

  console.log('\n✅ Database seeded successfully!\n');
  console.log('Login credentials:');
  console.log('  Admin   : admin@bitsathy.ac.in / admin@1234');
  console.log('  Student : MuratGursoy / password123');
  console.log('  Teacher : SarahJenkins / password123\n');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
