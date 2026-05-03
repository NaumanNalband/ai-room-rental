const User = require('../models/User');
const Room = require('../models/Room');
const Inquiry = require('../models/Inquiry');

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      total: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Also delete user's inquiries
    await Inquiry.deleteMany({ user: req.params.id });
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE user role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'broker', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('broker', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      total: rooms.length,
      rooms
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE room (admin)
const deleteRoomAdmin = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    
    // Also delete related inquiries
    await Inquiry.deleteMany({ room: req.params.id });
    
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE room availability
const updateRoomAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true }
    ).populate('broker', 'name email');
    
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all inquiries
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('room', 'title city price')
      .populate('user', 'name email')
      .populate('broker', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      total: inquiries.length,
      inquiries
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBrokers = await User.countDocuments({ role: 'broker' });
    const totalRooms = await Room.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();
    const availableRooms = await Room.countDocuments({ isAvailable: true });
    
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    const inquiriesByStatus = await Inquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      users: {
        total: totalUsers,
        brokers: totalBrokers,
        regular: totalUsers - totalBrokers,
        byRole: usersByRole
      },
      rooms: {
        total: totalRooms,
        available: availableRooms,
        unavailable: totalRooms - availableRooms
      },
      inquiries: {
        total: totalInquiries,
        byStatus: inquiriesByStatus
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
  getAllRooms,
  deleteRoomAdmin,
  updateRoomAvailability,
  getAllInquiries,
  getDashboardStats
};