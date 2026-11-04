const express = require('express');
const mongoose = require('mongoose');
const Donation = require('../models/Donation');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Get donations
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find({
      deadline: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add donation - Donor only
router.post('/', protect, authorizeRoles('donor'), async (req, res) => {
  try {
    const { foodName, quantity, location, category, deadline } = req.body;

    if (!foodName || !quantity || !location || !category || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all donation fields',
      });
    }

    const donation = await Donation.create({
      foodName,
      quantity,
      location,
      category,
      deadline,
      donorId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Donation added successfully',
      data: donation,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Donor's own donations
router.get('/my', protect, authorizeRoles('donor'), async (req, res) => {
  try {
    const donations = await Donation.find({
      donorId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete own donation
router.delete('/:id', protect, authorizeRoles('donor'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid donation ID' });
    }

    const donation = await Donation.findOneAndDelete({
      _id: req.params.id,
      donorId: req.user._id,
      status: 'Available',
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found or cannot be deleted',
      });
    }

    res.json({ success: true, message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;