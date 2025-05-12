const mongoose = require('mongoose');

const SubscriptionCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  cardType: {
    type: String,
    required: true,
    enum: ['basic', 'standard', 'premium'], // You can modify as needed
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stripeProductId: {
    type: String,
    default: "",
  },
  stripePriceId: {
    type: String,
    default: "",
   
  },
  stripePlanId: {
    type: String,
    default: "",
  },
  
  duration: {
    type: Number, // In days
    
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

const SubscriptionPlan = mongoose.models.SubscriptionPlan || mongoose.model('SubscriptionPlan', SubscriptionCardSchema);

module.exports.SubscriptionCardSchema = SubscriptionCardSchema; 
module.exports = SubscriptionPlan;
