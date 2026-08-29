const StudentResult = require('../models/StudentResult');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

const getResults = asyncHandler(async (req, res) => {
  const { studentId, rollNo } = req.query;
  const filter = {};
  if (studentId) filter.studentId = studentId;
  if (rollNo) filter.rollNo = rollNo;

  const results = await StudentResult.find(filter).sort({ createdAt: -1 }).lean();
  const mapped = results.map((r) => {
    // Convert Map to plain object for frontend compatibility
    const obj = { ...r, id: r._id.toString() };
    if (r.semesters instanceof Map) {
      obj.semesters = Object.fromEntries(r.semesters);
    }
    return obj;
  });

  res.status(200).json({ success: true, count: mapped.length, data: mapped });
});

const getResultById = asyncHandler(async (req, res) => {
  const result = await StudentResult.findById(req.params.id).lean();
  if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
  const obj = { ...result, id: result._id.toString() };
  if (result.semesters instanceof Map) {
    obj.semesters = Object.fromEntries(result.semesters);
  }
  res.status(200).json({ success: true, data: obj });
});

const saveResult = asyncHandler(async (req, res) => {
  const { studentId, rollNo } = req.body;

  // Upsert: update if exists, otherwise create
  let result = await StudentResult.findOne({
    $or: [
      ...(studentId ? [{ studentId }] : []),
      ...(rollNo ? [{ rollNo }] : []),
    ],
  });

  if (result) {
    Object.assign(result, req.body);
    await result.save();
  } else {
    result = await StudentResult.create(req.body);
  }

  // Sync CGPA to user profile
  if (req.body.cgpa !== undefined) {
    await User.findByIdAndUpdate(result.studentId, { gpa: req.body.cgpa });
  }

  const obj = result.toObject();
  obj.id = obj._id.toString();
  res.status(200).json({ success: true, data: obj });
});

const deleteResult = asyncHandler(async (req, res) => {
  const result = await StudentResult.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
  res.status(200).json({ success: true, message: 'Result deleted' });
});

module.exports = { getResults, getResultById, saveResult, deleteResult };
