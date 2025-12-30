const express = require("express");
const router = express.Router();
const StoredFiles = require("../models/storedFiles");
const DocumentMetadata = require("../models/documentMetadata");
const authMiddleware = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const fs = require("fs");
const path = require("path");

// Get all stored files (admin only)
router.get("/", authMiddleware, role(["ADMIN"]), async (req, res) => {
  try {
    const files = await StoredFiles.find({ status: "ACTIVE" })
      .sort({ createdAt: -1 })
      .populate('documentId', 'filename documentType department');
    
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

// Get file by ID
router.get("/:fileId", authMiddleware, async (req, res) => {
  try {
    const file = await StoredFiles.findOne({ 
      fileId: req.params.fileId,
      status: "ACTIVE" 
    }).populate('documentId');

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Check if user has permission to access this document
    if (req.user.role !== "ADMIN" && !file.documentId.allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch file" });
  }
});

// Download file by ID
router.get("/:fileId/download", authMiddleware, async (req, res) => {
  try {
    const file = await StoredFiles.findOne({ 
      fileId: req.params.fileId,
      status: "ACTIVE" 
    }).populate('documentId');

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Check if user has permission to access this document
    if (req.user.role !== "ADMIN" && !file.documentId.allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ error: "File not found on disk" });
    }

    // Set appropriate headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalFilename}"`);
    res.setHeader('Content-Type', file.mimeType);

    // Stream the file
    const fileStream = fs.createReadStream(file.filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download file" });
  }
});

// Delete file (admin only)
router.delete("/:fileId", authMiddleware, role(["ADMIN"]), async (req, res) => {
  try {
    const file = await StoredFiles.findOne({ 
      fileId: req.params.fileId 
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete file from disk
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    // Update file status in database
    await StoredFiles.updateOne(
      { fileId: req.params.fileId },
      { status: "DELETED" }
    );

    // Update document status
    await DocumentMetadata.updateOne(
      { documentId: file.documentId },
      { status: "DEPRECATED" }
    );

    res.json({ 
      success: true, 
      message: "File deleted successfully" 
    });
    
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

// Get file statistics (admin only)
router.get("/stats/overview", authMiddleware, role(["ADMIN"]), async (req, res) => {
  try {
    const totalFiles = await StoredFiles.countDocuments({ status: "ACTIVE" });
    const completedFiles = await StoredFiles.countDocuments({ 
      status: "ACTIVE", 
      ingestionStatus: "COMPLETED" 
    });
    const failedFiles = await StoredFiles.countDocuments({ 
      status: "ACTIVE", 
      ingestionStatus: "FAILED" 
    });
    
    const fileTypeStats = await StoredFiles.aggregate([
      { $match: { status: "ACTIVE" } },
      { $group: { _id: "$mimeType", count: { $sum: 1 } } }
    ]);

    const totalSize = await StoredFiles.aggregate([
      { $match: { status: "ACTIVE" } },
      { $group: { _id: null, totalSize: { $sum: "$fileSize" } } }
    ]);

    res.json({
      totalFiles,
      completedFiles,
      failedFiles,
      fileTypeStats,
      totalSize: totalSize[0]?.totalSize || 0
    });
    
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

module.exports = router;
