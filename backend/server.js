const inquiryRoutes = require('./routes/inquiries');
const adminRoutes = require('./routes/admin');
const wishlistRoutes = require('./routes/wishlist');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const { protect, restrictTo } = require('./middleware/auth');

const app = express();

// ========== SIMPLE CORS - ALLOW ALL ORIGINS ==========
app.use(cors());  // ✅ SIMPLEST - allows all origins
app.use(express.json());

// ========== DATABASE CONNECTION ==========
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

// ========== API ROUTES ==========
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);

// ========== TEST ROUTES (Protected) ==========
app.get('/api/test/user', protect, restrictTo('user'), (req, res) => {
  res.json({ message: `Hello User! Your ID is ${req.user.id}` });
});

app.get('/api/test/broker', protect, restrictTo('broker'), (req, res) => {
  res.json({ message: `Hello Broker! Your ID is ${req.user.id}` });
});

app.get('/api/test/admin', protect, restrictTo('admin'), (req, res) => {
  res.json({ message: `Hello Admin! Your ID is ${req.user.id}` });
});

// ========== HEALTH CHECK ==========
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Room Rental API running',
    environment: process.env.NODE_ENV || 'development',
    allowedOrigins: allowedOrigins
  });
});

// ========== SERVER START ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ CORS enabled for: ${allowedOrigins.join(', ')}`);
  console.log(`✅ MongoDB URI: ${process.env.MONGO_URI ? '✓ Connected' : '✗ Not set'}`);
  console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL || 'Not set (using localhost)'}`);
});