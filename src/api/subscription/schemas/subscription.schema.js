const mongoose = require('mongoose');

const SubscriptionCardSchema = new mongoose.Schema({
  cardType: {
    type: String,
    required: true,
    enum: ['Basic', 'Standard', 'Premium', 'Custom'], // You can modify as needed
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  duration: {
    type: Number, // In days
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  perks: {
    type: [String], // Array of strings, like ['Ad-free', 'HD Quality', 'Download Access']
    default: [],
  },
  isRecurring: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active',
  },
  maxUsers: {
    type: Number,
    default: 1,
  },
  trialAvailable: {
    type: Boolean,
    default: false,
  },
  trialDuration: {
    type: Number, // In days
    default: 0,
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const SubscriptionCard = mongoose.model('SubscriptionCard', SubscriptionCardSchema);

module.exports = SubscriptionCard;
