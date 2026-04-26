const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getMyRooms
} = require('../controllers/roomController');

// Public routes
router.get('/', getRooms);
router.get('/:id', getRoomById);

// Broker only routes
router.post('/', protect, restrictTo('broker'), createRoom);
router.put('/:id', protect, restrictTo('broker'), updateRoom);
router.delete('/:id', protect, restrictTo('broker'), deleteRoom);
router.get('/broker/myrooms', protect, restrictTo('broker'), getMyRooms);

module.exports = router;