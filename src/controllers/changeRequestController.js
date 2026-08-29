const ChangeRequest = require('../models/ChangeRequest');
const asyncHandler = require('../middleware/asyncHandler');

const getChangeRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const requests = await ChangeRequest.find(filter).sort({ createdAt: -1 }).lean();
  const mapped = requests.map((r) => ({ ...r, id: r._id.toString() }));
  res.status(200).json({ success: true, count: mapped.length, data: mapped });
});

const createChangeRequest = asyncHandler(async (req, res) => {
  const cr = await ChangeRequest.create({
    ...req.body,
    timestamp: new Date().toISOString(),
  });
  res.status(201).json({ success: true, data: { ...cr.toObject(), id: cr._id.toString() } });
});

const resolveChangeRequest = asyncHandler(async (req, res) => {
  const cr = await ChangeRequest.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true });
  if (!cr) return res.status(404).json({ success: false, message: 'Change request not found' });
  res.status(200).json({ success: true, data: { ...cr.toObject(), id: cr._id.toString() } });
});

const deleteChangeRequest = asyncHandler(async (req, res) => {
  const cr = await ChangeRequest.findByIdAndDelete(req.params.id);
  if (!cr) return res.status(404).json({ success: false, message: 'Change request not found' });
  res.status(200).json({ success: true, message: 'Change request deleted' });
});

module.exports = { getChangeRequests, createChangeRequest, resolveChangeRequest, deleteChangeRequest };
