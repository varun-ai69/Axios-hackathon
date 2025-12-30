const mongoose = require("mongoose");

const confidenceExplanationSchema = new mongoose.Schema({
  queryId: {
    type: String,
    required: true,
    unique: true
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  semanticSimilarity: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  supportingChunksCount: {
    type: Number,
    required: true
  },
  documentFreshness: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  authorityWeightAvg: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("ConfidenceExplanation", confidenceExplanationSchema);
