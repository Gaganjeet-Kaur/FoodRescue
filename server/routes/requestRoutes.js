const express = require('express');
const Request = require('../models/Request');

const router = express.Router();

// Get all requests
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create a request
router.post('/', async (req, res) => {
  try {
    const { foodName } = req.body;

    if (!foodName || !foodName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Food name is required',
      });
    }

    const existingRequest = await Request.findOne({
      foodName: foodName.trim(),
      status: 'Pending',
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: 'This food has already been requested',
      });
    }

    const request = await Request.create({
      foodName: foodName.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Food requested successfully',
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;