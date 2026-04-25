const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

<<<<<<< HEAD
const authRoutes = require('./routes/auth');
const { protect, restrictTo } = require('./middleware/auth');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
=======
const app = express();
app.use(cors());
>>>>>>> feature/db-schema
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Error:', err));

<<<<<<< HEAD
// Auth routes
app.use('/api/auth', authRoutes);

// Test protected routes
app.get('/api/test/user', protect, restrictTo('user'), (req, res) => {
  res.json({ message: `Hello User! Your ID is ${req.user.id}` });
});

app.get('/api/test/broker', protect, restrictTo('broker'), (req, res) => {
  res.json({ message: `Hello Broker! Your ID is ${req.user.id}` });
});

app.get('/api/test/admin', protect, restrictTo('admin'), (req, res) => {
  res.json({ message: `Hello Admin! Your ID is ${req.user.id}` });
});

=======
>>>>>>> feature/db-schema
app.get('/', (req, res) => {
  res.json({ message: 'AI Room Rental API running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));