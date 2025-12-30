const mongoose = require("mongoose");

const rejectionLogsSchema = new mongoose.Schema({
  queryText: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    enum: ["ADMIN", "EMPLOYEE"],
    required: true
  },
  reasonCode: {
    type: String,
    enum: ["ROLE_RESTRICTED", "NO_DATA_FOUND"],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("RejectionLogs", rejectionLogsSchema);
