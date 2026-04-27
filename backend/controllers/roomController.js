const axios = require('axios');
const Room = require('../models/Room');
const { cloudinary } = require('../config/cloudinary');
const axios = require('axios');

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
    const rooms = await Room.find(filter).populate('broker', 'name email').sort({ createdAt: -1 });
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('broker', 'name email');
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ broker: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

// NLP Search
const nlpSearch = async (req, res) => {
  try {
    const { query } = req.body;

    // Call Flask AI service
    const aiResponse = await axios.post('http://localhost:5001/nlp/search', { query });
    const filters = aiResponse.data;

    // Build MongoDB filter from NLP results
    let filter = {};
    if (filters.city) filter.city = { $regex: filters.city, $options: 'i' };
    if (filters.type) filter.type = filters.type;
    if (filters.maxPrice) filter.price = { ...filter.price, $lte: filters.maxPrice };
    if (filters.minPrice) filter.price = { ...filter.price, $gte: filters.minPrice };

    const rooms = await Room.find(filter)
      .populate('broker', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      filters,
      rooms
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRooms, getRoomById, createRoom, updateRoom, deleteRoom, getMyRooms, uploadRoomImages, nlpSearch };