const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  createInquiry,
  getBrokerInquiries,
  getUserInquiries,
  updateInquiryStatus
} = require('../controllers/inquiryController');

// User routes
router.post('/', protect, restrictTo('user'), createInquiry);
router.get('/user/my-inquiries', protect, restrictTo('user'), getUserInquiries);

// Broker routes
router.get('/broker/inquiries', protect, restrictTo('broker'), getBrokerInquiries);
router.put('/:id/status', protect, restrictTo('broker'), updateInquiryStatus);

module.exports = router;