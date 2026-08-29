const express = require('express');
const router = express.Router();
const { getChangeRequests, createChangeRequest, resolveChangeRequest, deleteChangeRequest } = require('../controllers/changeRequestController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(authorize('admin', 'teacher'), getChangeRequests)
  .post(authorize('teacher'), createChangeRequest);

router.put('/:id/resolve', authorize('admin'), resolveChangeRequest);
router.delete('/:id', authorize('admin'), deleteChangeRequest);

module.exports = router;
