const mongoose = require("mongoose");

const userAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ["ADMIN", "EMPLOYEE"],
    required: true
  },
  department: {
    type: String,
    enum: ["HR", "FINANCE", "IT", "MARKETING", "OPERATIONS", "LEGAL"],
    required: true
  },
  queriesCount: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("UserAnalytics", userAnalyticsSchema);
