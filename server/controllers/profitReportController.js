// controllers/profitReportController.js
const ProfitReport = require("../models/ProfitReport");

exports.getAllReports = async (req, res) => {
  try {
    const reports = await ProfitReport.find().sort({ month: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
