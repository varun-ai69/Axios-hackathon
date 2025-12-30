const mongoose = require("mongoose");

const documentMetadataSchema = new mongoose.Schema({
  documentId: {
    type: String,
    required: true,
    unique: true
  },
  filename: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ["PDF", "DOCX", "XLSX", "TXT"],
    required: true
  },
  documentType: {
    type: String,
    enum: ["POLICY", "PROCEDURE", "GUIDELINE", "MANUAL", "REPORT"],
    required: true
  },
  department: {
    type: String,
    enum: ["HR", "FINANCE", "IT", "MARKETING", "OPERATIONS", "LEGAL"],
    required: true
  },
  version: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["ACTIVE", "DEPRECATED", "ARCHIVED"],
    default: "ACTIVE"
  },
  uploadedByRole: {
    type: String,
    enum: ["ADMIN", "EMPLOYEE"],
    required: true
  },
  allowedRoles: [{
    type: String,
    enum: ["ADMIN", "EMPLOYEE"]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("DocumentMetadata", documentMetadataSchema);
