const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const { roleTarget, read, limit = 50 } = req.query;
  const filter = {};
  if (roleTarget) filter.roleTarget = { $in: [roleTarget, 'all'] };
  if (read !== undefined) filter.read = read === 'true';

  const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(parseInt(limit)).lean();
  const mapped = notifications.map((n) => ({ ...n, id: n._id.toString() }));
  res.status(200).json({ success: true, count: mapped.length, data: mapped });
});

const markRead = asyncHandler(async (req, res) => {
  const notif = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
  res.status(200).json({ success: true, data: { ...notif.toObject(), id: notif._id.toString() } });
});

const clearAll = asyncHandler(async (req, res) => {
  const { roleTarget } = req.query;
  const filter = {};
  if (roleTarget) filter.roleTarget = { $in: [roleTarget, 'all'] };
  await Notification.deleteMany(filter);
  res.status(200).json({ success: true, message: 'Notifications cleared' });
});

module.exports = { getNotifications, markRead, clearAll };
