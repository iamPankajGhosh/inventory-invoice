// routes/profitReports.js
const express = require("express");
const router = express.Router();
const profitReportController = require("../controllers/profitReportController");

// Get all profit reports
router.get("/all", profitReportController.getAllReports);

// Create a new profit report
// router.post("/", profitReportController.createReport);

module.exports = router;
