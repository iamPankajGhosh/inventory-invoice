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

exports.createReport = async (req, res) => {
  const report = new ProfitReport({
    month: req.body.month,
    revenue: req.body.revenue,
    expenses: req.body.expenses,
    profit: req.body.revenue - req.body.expenses,
  });

  try {
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
