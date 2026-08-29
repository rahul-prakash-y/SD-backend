const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @route   GET /api/announcements
 * @desc    Get all announcements (newest first)
 * @access  Private
 */
const getAnnouncements = asyncHandler(async (req, res) => {
  const { priority, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (priority) filter.priority = priority;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [announcements, total] = await Promise.all([
    Announcement.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Announcement.countDocuments(filter),
  ]);

  const mapped = announcements.map((a) => ({ ...a, id: a._id.toString() }));

  res.status(200).json({
    success: true,
    count: mapped.length,
    total,
    page: parseInt(page),
    data: mapped,
  });
});

/**
 * @route   POST /api/announcements
 * @desc    Create a new announcement (auto-creates notification)
 * @access  Private (Teacher/Admin)
 */
const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, content, priority, targetCourse } = req.body;

  const announcement = await Announcement.create({
    authorId: req.user.id,
    authorName: req.user.name,
    authorRole: req.user.title || req.user.role,
    authorAvatar: req.user.avatar,
    title,
    content,
    priority: priority || 'normal',
    targetCourse,
    date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  });

  // Auto-create notification for students
  await Notification.create({
    title: `📢 ${title}`,
    message: `${req.user.name} posted an announcement for ${targetCourse || 'All Students'}`,
    timestamp: 'Just now',
    read: false,
    type: 'announcement',
    roleTarget: 'student',
  });

  res.status(201).json({
    success: true,
    data: { ...announcement.toObject(), id: announcement._id.toString() },
  });
});

/**
 * @route   DELETE /api/announcements/:id
 * @desc    Delete an announcement
 * @access  Private (Author/Admin)
 */
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }

  // Only author or admin can delete
  if (announcement.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this announcement' });
  }

  await Announcement.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Announcement deleted',
  });
});

module.exports = {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
};
