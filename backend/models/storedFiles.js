const mongoose = require("mongoose");

const storedFilesSchema = new mongoose.Schema({
  fileId: {
    type: String,
    required: true,
    unique: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  storedFilename: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  documentId: {
    type: String,
    required: true,
    ref: "DocumentMetadata"
  },
  uploadedBy: {
    type: String,
    required: true
  },
  uploadedByRole: {
    type: String,
    enum: ["ADMIN", "EMPLOYEE"],
    required: true
  },
  status: {
    type: String,
    enum: ["ACTIVE", "DELETED", "CORRUPTED"],
    default: "ACTIVE"
  },
  ingestionStatus: {
    type: String,
    enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
    default: "PENDING"
  },
  chunksGenerated: {
    type: Number,
    default: 0
  },
  embeddingGenerated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("StoredFiles", storedFilesSchema);
