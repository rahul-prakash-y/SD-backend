const Course = require('../models/Course');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @route   GET /api/courses
 * @desc    Get all courses (with optional teacherId filter)
 * @access  Private
 */
const getCourses = asyncHandler(async (req, res) => {
  const { teacherId, search } = req.query;

  const filter = {};
  if (teacherId) filter.teacherId = teacherId;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
    ];
  }

  const courses = await Course.find(filter).sort({ code: 1 }).lean();

  const mapped = courses.map((c) => ({ ...c, id: c._id.toString() }));

  res.status(200).json({
    success: true,
    count: mapped.length,
    data: mapped,
  });
});

/**
 * @route   GET /api/courses/:id
 * @desc    Get a single course
 * @access  Private
 */
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).lean();

  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  course.id = course._id.toString();

  res.status(200).json({ success: true, data: course });
});

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Private (Admin/Teacher)
 */
const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: { ...course.toObject(), id: course._id.toString() },
  });
});

/**
 * @route   PUT /api/courses/:id
 * @desc    Update a course
 * @access  Private (Admin/Teacher)
 */
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  res.status(200).json({
    success: true,
    data: { ...course.toObject(), id: course._id.toString() },
  });
});

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete a course
 * @access  Private (Admin)
 */
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  res.status(200).json({
    success: true,
    message: `Course '${course.title}' deleted`,
  });
});

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
