const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
  getAllRooms,
  deleteRoomAdmin,
  updateRoomAvailability,
  getAllInquiries,
  getDashboardStats
} = require('../controllers/adminController');

// Middleware: only admins can access
router.use(protect, restrictTo('admin'));

// Dashboard stats
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

// Room management
router.get('/rooms', getAllRooms);
router.delete('/rooms/:id', deleteRoomAdmin);
router.put('/rooms/:id/availability', updateRoomAvailability);

// Inquiry management
router.get('/inquiries', getAllInquiries);

module.exports = router;