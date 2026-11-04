const express = require('express');
const mongoose = require('mongoose');
const Request = require('../models/Request');
const Donation = require('../models/Donation');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Get requests according to logged-in role
router.get('/', protect, async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'receiver') {
      filter.receiverId = req.user._id;
    } else if (req.user.role === 'donor') {
      filter.donorId = req.user._id;
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const requests = await Request.find(filter)
      .populate('donationId')
      .populate('receiverId', 'name organizationName location')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Receiver requests food
router.post('/', protect, authorizeRoles('receiver'), async (req, res) => {
  try {
    const { donationId } = req.body;

    if (!mongoose.isValidObjectId(donationId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid donation ID is required',
      });
    }

    const donation = await Donation.findOne({
      _id: donationId,
      status: 'Available',
      deadline: { $gt: new Date() },
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Food is no longer available',
      });
    }

    const existingRequest = await Request.findOne({
      donationId,
      receiverId: req.user._id,
      status: { $in: ['Pending', 'Approved'] },
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: 'You have already requested this food',
      });
    }

    const request = await Request.create({
      foodName: donation.foodName,
      donationId: donation._id,
      receiverId: req.user._id,
      donorId: donation.donorId,
    });

    res.status(201).json({
      success: true,
      message: 'Food requested successfully',
      data: request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Donor approves or rejects a request
router.patch('/:id/status', protect, authorizeRoles('donor'), async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Approved', 'Rejected', 'Collected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request status',
      });
    }

    const request = await Request.findOne({
      _id: req.params.id,
      donorId: req.user._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (request.status !== 'Pending' && status !== 'Collected') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been processed',
      });
    }

    request.status = status;
    await request.save();

    if (request.donationId) {
      if (status === 'Approved') {
        await Donation.findByIdAndUpdate(request.donationId, {
          status: 'Requested',
        });
      } else if (status === 'Collected') {
        await Donation.findByIdAndUpdate(request.donationId, {
          status: 'Collected',
        });
      } else if (status === 'Rejected') {
        await Donation.findByIdAndUpdate(request.donationId, {
          status: 'Available',
        });
      }
    }

    res.json({
      success: true,
      message: `Request ${status.toLowerCase()} successfully`,
      data: request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;