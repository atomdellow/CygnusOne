const express = require('express');
const {
  getSoftware,
  getSingleSoftware,
  createSoftware,
  updateSoftware,
  deleteSoftware,
} = require('../controllers/softwareController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getSoftware)
  .post(protect, authorize('admin', 'editor'), createSoftware);

router
  .route('/:id')
  .get(getSingleSoftware)
  .put(protect, authorize('admin', 'editor'), updateSoftware)
  .delete(protect, authorize('admin'), deleteSoftware);

module.exports = router;
