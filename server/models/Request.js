const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    foodName: { type: String, required: true, trim: true },

    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      default: null,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Collected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);