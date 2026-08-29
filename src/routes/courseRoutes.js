const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getCourses)
  .post(authorize('admin', 'teacher'), createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(authorize('admin', 'teacher'), updateCourse)
  .delete(authorize('admin'), deleteCourse);

module.exports = router;
