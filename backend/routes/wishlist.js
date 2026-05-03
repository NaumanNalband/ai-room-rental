const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  isInWishlist,
  getWishlistCount
} = require('../controllers/wishlistController');

// All routes require user authentication
router.use(protect, restrictTo('user'));

// Add to wishlist
router.post('/', addToWishlist);

// Get user's wishlist
router.get('/', getWishlist);

// Get wishlist count
router.get('/count', getWishlistCount);

// Check if room is in wishlist
router.get('/check/:room_id', isInWishlist);

// Remove from wishlist
router.delete('/:room_id', removeFromWishlist);

module.exports = router;