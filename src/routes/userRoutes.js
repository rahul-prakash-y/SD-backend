const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser, deleteUser, assignMentor } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All user routes require auth

router.route('/')
  .get(authorize('admin', 'teacher'), getUsers)
  .post(authorize('admin'), createUser);

router.route('/:id')
  .get(getUserById)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

router.put('/:studentId/mentor', authorize('admin'), assignMentor);

module.exports = router;
