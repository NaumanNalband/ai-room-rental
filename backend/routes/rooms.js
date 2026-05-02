const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getMyRooms,
  uploadRoomImages,
  nlpSearch,
  mlRecommendations,
  collabRecommendations
} = require('../controllers/roomController');

// Public routes
router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/search/nlp', nlpSearch);
router.post('/recommend/ml', mlRecommendations);
router.post('/recommend/collab', collabRecommendations);

// Broker only routes
router.post('/', protect, restrictTo('broker'), createRoom);
router.put('/:id', protect, restrictTo('broker'), updateRoom);
router.delete('/:id', protect, restrictTo('broker'), deleteRoom);
router.get('/broker/myrooms', protect, restrictTo('broker'), getMyRooms);
router.post('/:id/images', protect, restrictTo('broker'), upload.array('images', 5), uploadRoomImages);

module.exports = router;