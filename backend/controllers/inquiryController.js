const Inquiry = require('../models/Inquiry');
const Room = require('../models/Room');

// POST create inquiry
const createInquiry = async (req, res) => {
  try {
    const { room, broker, message } = req.body;

    // Verify room exists
    const roomData = await Room.findById(room);
    if (!roomData) return res.status(404).json({ message: 'Room not found' });

    // Create inquiry
    const inquiry = await Inquiry.create({
      room,
      user: req.user.id,
      broker,
      message,
      status: 'pending'
    });

    const populatedInquiry = await inquiry.populate([
      { path: 'room', select: 'title city price' },
      { path: 'user', select: 'name email' },
      { path: 'broker', select: 'name email' }
    ]);

    res.status(201).json(populatedInquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all inquiries for broker
const getBrokerInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ broker: req.user.id })
      .populate('room', 'title city price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all inquiries for user
const getUserInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user.id })
      .populate('room', 'title city price')
      .populate('broker', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update inquiry status (broker only)
const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    if (inquiry.broker.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    inquiry.status = status;
    await inquiry.save();

    const updated = await inquiry.populate([
      { path: 'room', select: 'title city price' },
      { path: 'user', select: 'name email' },
      { path: 'broker', select: 'name email' }
    ]);

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createInquiry, getBrokerInquiries, getUserInquiries, updateInquiryStatus };