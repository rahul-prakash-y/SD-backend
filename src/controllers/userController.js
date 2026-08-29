const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @route   GET /api/users
 * @desc    Get all users (with optional role filter)
 * @access  Private (Admin/Teacher)
 */
const getUsers = asyncHandler(async (req, res) => {
  const { role, department, search, page = 1, limit = 50 } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (department) filter.department = { $regex: department, $options: 'i' };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
      { rollNo: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password -__v')
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    User.countDocuments(filter),
  ]);

  // Map _id to id
  const mapped = users.map((u) => ({ ...u, id: u._id.toString() }));

  res.status(200).json({
    success: true,
    count: mapped.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: mapped,
  });
});

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by ID
 * @access  Private
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -__v').lean();

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  user.id = user._id.toString();

  res.status(200).json({ success: true, data: user });
});

/**
 * @route   POST /api/users
 * @desc    Create a new user (Admin)
 * @access  Private (Admin)
 */
const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user.toSafeJSON(),
  });
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user (Admin)
 * @access  Private (Admin)
 */
const updateUser = asyncHandler(async (req, res) => {
  // If password is being updated, handle it separately
  const { password, ...updateData } = req.body;

  let user;
  if (password) {
    user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.password = password;
    Object.assign(user, updateData);
    await user.save(); // Triggers pre-save hook for hashing
  } else {
    user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    data: user.toSafeJSON(),
  });
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user (Admin)
 * @access  Private (Admin)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    message: `User '${user.name}' deleted successfully`,
  });
});

/**
 * @route   PUT /api/users/:studentId/mentor
 * @desc    Assign/change mentor for a student (Admin)
 * @access  Private (Admin)
 */
const assignMentor = asyncHandler(async (req, res) => {
  const { mentorId, mentorName, mentorPhone } = req.body;

  const student = await User.findById(req.params.studentId);
  if (!student || student.role !== 'student') {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  student.mentorId = mentorId;
  student.mentorName = mentorName;
  student.mentorPhone = mentorPhone;
  await student.save();

  res.status(200).json({
    success: true,
    data: student.toSafeJSON(),
    message: `Mentor assigned: ${mentorName}`,
  });
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  assignMentor,
};
