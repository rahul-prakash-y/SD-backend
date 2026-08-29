const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Generate JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { usernameOrEmail, password, intendedRole } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide username/email and password',
    });
  }

  const cleanQuery = usernameOrEmail.trim().toLowerCase();

  // Build query: match by username or email, optionally filter by role
  const query = {
    $or: [
      { email: cleanQuery },
      { username: { $regex: new RegExp(`^${cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
    ],
  };
  if (intendedRole) {
    query.role = intendedRole;
  }

  // Include password field for comparison
  const user = await User.findOne(query).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  const token = generateToken(user._id, user.role);
  const userData = user.toSafeJSON();

  res.status(200).json({
    success: true,
    token,
    user: userData,
  });
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public (can be restricted later)
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password, name, role, ...rest } = req.body;

  if (!username || !email || !password || !name || !role) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: username, email, password, name, role',
    });
  }

  // Check for existing user
  const exists = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: { $regex: new RegExp(`^${username}$`, 'i') } }],
  });

  if (exists) {
    return res.status(409).json({
      success: false,
      message: 'User with this email or username already exists',
    });
  }

  // Set default avatar based on role
  const avatars = {
    student: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    teacher: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    admin: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  };

  const user = await User.create({
    username,
    email,
    password,
    name,
    role,
    avatar: rest.avatar || avatars[role] || avatars.student,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    ...(role === 'student' && { gpa: rest.gpa || 0, attendanceRate: rest.attendanceRate || 0 }),
    ...rest,
  });

  const token = generateToken(user._id, user.role);
  const userData = user.toSafeJSON();

  res.status(201).json({
    success: true,
    token,
    user: userData,
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user profile
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).lean();

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  user.id = user._id.toString();
  delete user._id;
  delete user.__v;
  delete user.password;

  res.status(200).json({ success: true, user });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user's profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  // Prevent role and password changes through this endpoint
  const { role, password, ...updateData } = req.body;

  const user = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    user: user.toSafeJSON(),
  });
});

module.exports = { login, register, getMe, updateProfile };
