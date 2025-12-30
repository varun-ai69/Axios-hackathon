const express = require("express");
const router = express.Router();
const QueryLogs = require("../models/queryLogs");
const UserAnalytics = require("../models/userAnalytics");
const DocumentMetadata = require("../models/documentMetadata");
const RejectionLogs = require("../models/rejectionLogs");
const authMiddleware = require("../middlewares/authMiddleware");

// Get user analytics
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const analytics = await UserAnalytics.findOne({ userId: req.params.userId });
    if (!analytics) {
      return res.status(404).json({ error: "User analytics not found" });
    }
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user analytics" });
  }
});

// Get system analytics (admin only)
router.get("/system", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const totalQueries = await QueryLogs.countDocuments();
    const totalDocuments = await DocumentMetadata.countDocuments();
    const totalRejections = await RejectionLogs.countDocuments();
    const avgResponseTime = await QueryLogs.aggregate([
      { $group: { _id: null, avgTime: { $avg: "$responseTimeMs" } } }
    ]);

    res.json({
      totalQueries,
      totalDocuments,
      totalRejections,
      avgResponseTime: avgResponseTime[0]?.avgTime || 0
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch system analytics" });
  }
});

// Get recent queries
router.get("/queries/recent", authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const queries = await QueryLogs.find()
      .sort({ timestamp: -1 })
      .limit(limit);
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recent queries" });
  }
});

module.exports = router;
