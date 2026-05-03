const Wishlist = require('../models/Wishlist');
const Room = require('../models/Room');

// ADD room to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { room_id } = req.body;

    if (!room_id) {
      return res.status(400).json({ message: 'Room ID required' });
    }

    // Check if room exists
    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      user: req.user.id,
      room: room_id
    });

    if (existing) {
      return res.status(400).json({ message: 'Room already in wishlist' });
    }

    // Add to wishlist
    const wishlist = await Wishlist.create({
      user: req.user.id,
      room: room_id
    });

    const populated = await wishlist.populate([
      { path: 'room', select: 'title city price type images' },
      { path: 'user', select: 'name email' }
    ]);

    res.status(201).json({
      message: 'Room added to wishlist',
      wishlist: populated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET user's wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id })
      .populate('room', 'title city price type amenities images broker')
      .populate('room.broker', 'name email')
      .sort({ savedAt: -1 });

    res.status(200).json({
      total: wishlist.length,
      wishlist
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REMOVE room from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { room_id } = req.params;

    const wishlist = await Wishlist.findOneAndDelete({
      user: req.user.id,
      room: room_id
    });

    if (!wishlist) {
      return res.status(404).json({ message: 'Item not in wishlist' });
    }

    res.status(200).json({ message: 'Room removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CHECK if room is in wishlist
const isInWishlist = async (req, res) => {
  try {
    const { room_id } = req.params;

    const exists = await Wishlist.findOne({
      user: req.user.id,
      room: room_id
    });

    res.status(200).json({
      inWishlist: !!exists,
      room_id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET wishlist count
const getWishlistCount = async (req, res) => {
  try {
    const count = await Wishlist.countDocuments({ user: req.user.id });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  isInWishlist,
  getWishlistCount
};