const express = require("express");
const { uploadSingle } = require("../middlewares/uploadMiddleware");
const { ingestDocument } = require("../controllers/ingestionController");
const { askQuestion } = require("../controllers/retrievalController");
const authMiddleware = require("../middlewares/authMiddleware")
const role = require("../middlewares/roleMiddleware") //only ADMIN can upload the Documents 

const router = express.Router();

router.post("/ingestion", authMiddleware, role(["ADMIN"]), uploadSingle, ingestDocument); 

// Add retrieval endpoint for compatibility (redirects to search route)
router.post("/retrieval", authMiddleware, askQuestion);

module.exports = router;
