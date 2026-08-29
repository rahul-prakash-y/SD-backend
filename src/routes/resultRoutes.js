const express = require('express');
const router = express.Router();
const { getResults, getResultById, saveResult, deleteResult } = require('../controllers/resultController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getResults)
  .post(authorize('admin'), saveResult);

router.route('/:id')
  .get(getResultById)
  .delete(authorize('admin'), deleteResult);

module.exports = router;
