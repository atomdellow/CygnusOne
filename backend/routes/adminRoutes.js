const express = require('express');
const {
  getUsers,
  getUser,
  updateUserRole,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes use the protect middleware and require admin role
router.use(protect);
router.use(authorize('admin'));

router.route('/users').get(getUsers);

router
  .route('/users/:id')
  .get(getUser);
  
router.route('/users/:id/role').put(updateUserRole);

module.exports = router;
