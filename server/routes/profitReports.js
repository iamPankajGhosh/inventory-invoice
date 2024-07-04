// routes/profitReports.js
const express = require("express");
const router = express.Router();
const profitReportController = require("../controllers/profitReportController");

// Get all profit reports
router.get("/all", profitReportController.getAllReports);

module.exports = router;
