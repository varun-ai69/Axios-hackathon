const mongoose = require("mongoose");

const chunkPermissionsSchema = new mongoose.Schema({
  chunkId: {
    type: String,
    required: true,
    unique: true
  },
  documentId: {
    type: String,
    required: true,
    ref: "DocumentMetadata"
  },
  sectionName: {
    type: String,
    required: true
  },
  allowedRoles: [{
    type: String,
    enum: ["ADMIN", "EMPLOYEE"]
  }],
  authorityWeight: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("ChunkPermissions", chunkPermissionsSchema);
