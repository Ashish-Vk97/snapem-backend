const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["M", "F", "O"], default: "M" },
    role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
    phone: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    location: {
      type: {
        type: String, // 'Point'
        enum: ["Point"],
        // required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        // required: true,
      },
    },
    profileImage: { type: String, default: null },
    stripeCustomerId: {
      type: String,
      default: null,
    },
    address: {
      country: { type: String },
      state: { type: String },
      pincode: { type: String },
      city: { type: String },
    },
    subsciptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
    },
    subscription: {
      id: { type: String },
      status: { type: String },
      start_date: { type: String },

      cancellation_details: {
        comment: { type: String, default: null },
        feedback: { type: String, default: null },
        reason: { type: String, default: null },
      },
      canceled_at: { type: String, default: null },
      cancel_at_period_end: { type: Boolean, default: false },
      current_period_end: { type: String },
      current_period_start: { type: String },
      plan: {
        id: { type: String },

        currency: { type: String },
        interval: { type: String },
        interval_count: { type: Number },
        amount: { type: Number },
      },
    },

    screenshotsList: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Screenshot" },
    ],
    videosList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    emergencyContacts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Emergencycontact" },
    ],
    emergencyContactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Emergencycontact",
    },
    isSubscribed: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },

    created_at: Date,
    updated_at: Date,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports.UserSchema = userSchema;
module.exports = User;
