const mongoose = require("mongoose");

const queryLogsSchema = new mongoose.Schema({
  queryText: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    enum: ["ADMIN", "EMPLOYEE"],
    required: true
  },
  retrievedChunksCount: {
    type: Number,
    required: true
  },
  filteredChunksCount: {
    type: Number,
    required: true
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  responseTimeMs: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("QueryLogs", queryLogsSchema);
