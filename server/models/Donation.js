const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    foodName: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Requested', 'Collected'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);