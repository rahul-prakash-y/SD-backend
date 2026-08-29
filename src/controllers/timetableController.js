const TimetableSlot = require('../models/TimetableSlot');
const asyncHandler = require('../middleware/asyncHandler');

const getTimetable = asyncHandler(async (req, res) => {
  const { day, teacher } = req.query;
  const filter = {};
  if (day) filter.day = day;
  if (teacher) filter.teacher = { $regex: teacher, $options: 'i' };

  const slots = await TimetableSlot.find(filter).sort({ day: 1, startTime: 1 }).lean();
  const mapped = slots.map((s) => ({ ...s, id: s._id.toString() }));

  res.status(200).json({ success: true, count: mapped.length, data: mapped });
});

const createSlot = asyncHandler(async (req, res) => {
  const slot = await TimetableSlot.create(req.body);
  res.status(201).json({ success: true, data: { ...slot.toObject(), id: slot._id.toString() } });
});

const updateSlot = asyncHandler(async (req, res) => {
  const slot = await TimetableSlot.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
  res.status(200).json({ success: true, data: { ...slot.toObject(), id: slot._id.toString() } });
});

const deleteSlot = asyncHandler(async (req, res) => {
  const slot = await TimetableSlot.findByIdAndDelete(req.params.id);
  if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
  res.status(200).json({ success: true, message: `Slot deleted` });
});

module.exports = { getTimetable, createSlot, updateSlot, deleteSlot };
