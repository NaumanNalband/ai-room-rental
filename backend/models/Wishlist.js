const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    savedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Ensure unique wishlist entries (user can't save same room twice)
wishlistSchema.index({ user: 1, room: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);