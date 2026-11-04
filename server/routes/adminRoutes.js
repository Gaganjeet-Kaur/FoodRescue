const express = require('express');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Request = require('../models/Request');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Admin dashboard statistics
router.get('/stats', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const [users, donations, requests, pendingNGOs] = await Promise.all([
      User.countDocuments(),
      Donation.countDocuments(),
      Request.countDocuments(),
      User.countDocuments({ role: 'receiver', isVerified: false }),
    ]);

    res.json({
      success: true,
      data: { users, donations, requests, pendingNGOs },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users
router.get('/users', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify or unverify an NGO
router.patch('/users/:id/verify', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: 'receiver',
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found',
      });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    res.json({
      success: true,
      message: user.isVerified ? 'NGO verified successfully' : 'NGO verification removed',
      data: { isVerified: user.isVerified },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;