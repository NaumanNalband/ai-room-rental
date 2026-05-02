const Room = require('../models/Room');
const { cloudinary } = require('../config/cloudinary');
const axios = require('axios');

// GET all rooms with filters
const getRooms = async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice } = req.query;
    let filter = {};
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (type) filter.type = type;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const rooms = await Room.find(filter)
      .populate('broker', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single room
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('broker', 'name email');
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create room (broker only)
const createRoom = async (req, res) => {
  try {
    const { title, description, price, type, amenities, city, address, lat, lng } = req.body;
    const room = await Room.create({
      title, description, price, type,
      amenities: amenities || [],
      city, address, lat, lng,
      broker: req.user.id
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update room (broker only - own rooms)
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.broker.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to update this room' });
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE room (broker only - own rooms)
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.broker.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this room' });
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET broker's own rooms
const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ broker: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload images to room
const uploadRoomImages = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.broker.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });
    const imageUrls = req.files.map(file => file.path);
    const updated = await Room.findByIdAndUpdate(
      req.params.id,
      { $push: { images: { $each: imageUrls } } },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// NLP Search
const nlpSearch = async (req, res) => {
  try {
    const { query } = req.body;
    const aiResponse = await axios.post('http://localhost:5001/nlp/search', { query });
    const filters = aiResponse.data;
    let filter = {};
    if (filters.city) filter.city = { $regex: filters.city, $options: 'i' };
    if (filters.type) filter.type = filters.type;
    if (filters.maxPrice) filter.price = { ...filter.price, $lte: filters.maxPrice };
    if (filters.minPrice) filter.price = { ...filter.price, $gte: filters.minPrice };
    const rooms = await Room.find(filter).populate('broker', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ filters, rooms });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Collaborative Filtering Recommendations
const collabRecommendations = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID required' });
    }

    // Get all rooms
    const allRooms = await Room.find()
      .populate('broker', 'name email')
      .lean();

    if (allRooms.length === 0) {
      return res.status(200).json({ recommendations: [] });
    }

    // Get all inquiries to use as ratings
    const Inquiry = require('../models/Inquiry');
    const inquiries = await Inquiry.find()
      .select('user room')
      .lean();

    // Convert inquiries to ratings (1-5 scale)
    const ratings = inquiries.map(inq => ({
      user_id: inq.user.toString(),
      room_id: inq.room.toString(),
      rating: 4  // Default rating for inquiries
    }));

    if (ratings.length < 2) {
      // Not enough data, return all rooms
      return res.status(200).json({
        message: 'Not enough user data yet',
        recommendations: allRooms.slice(0, 5)
      });
    }

    // Train model
    await axios.post('http://localhost:5001/collab/train', { ratings });

    // Get recommendations
    const aiResponse = await axios.post('http://localhost:5001/collab/recommend', {
      user_id,
      rooms: allRooms,
      top_n: 5
    });

    const recommendations = aiResponse.data.recommendations;

    res.status(200).json({
      user_id,
      recommendations,
      method: 'collaborative_filtering'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ML Recommendations based on user preferences
const mlRecommendations = async (req, res) => {
  try {
    const { query } = req.body;

    // Get all rooms first
    const allRooms = await Room.find()
      .populate('broker', 'name email')
      .lean();

    if (allRooms.length === 0) {
      return res.status(200).json({ recommendations: [] });
    }

    // Train ML model with current rooms
    await axios.post('http://localhost:5001/ml/train', { rooms: allRooms });

    // Get recommendations
    const aiResponse = await axios.post('http://localhost:5001/ml/recommend', {
      query: query || 'good room with amenities',
      top_n: 5
    });

    const recommendations = aiResponse.data.recommendations;
    const roomDetails = await Room.find({
      _id: { $in: recommendations.map(r => r.room_id) }
    }).populate('broker', 'name email');

    res.status(200).json({
      query,
      recommendations: roomDetails.map((room, idx) => ({
        ...room.toObject(),
        ml_score: recommendations[idx]?.similarity_score || 0
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { 
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
};