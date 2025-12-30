const express = require("express");
const router = express.Router();
const { scanUploadsDirectory, startFileMonitoring } = require("../services/fileMonitorService");
const authMiddleware = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

// Manual trigger to scan uploads directory (admin only)
router.post("/scan", authMiddleware, role(["ADMIN"]), async (req, res) => {
  try {
    await scanUploadsDirectory();
    res.json({
      success: true,
      message: "Uploads directory scanned successfully"
    });
  } catch (error) {
    console.error("Manual scan error:", error);
    res.status(500).json({ error: "Failed to scan uploads directory" });
  }
});

// Get scan status (admin only)
router.get("/status", authMiddleware, role(["ADMIN"]), async (req, res) => {
  try {
    // This could return information about last scan time, etc.
    res.json({
      message: "File monitoring service is active",
      lastScan: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get scan status" });
  }
});

module.exports = router;
