const mongoose = require("mongoose");

const profitReportSchema = new mongoose.Schema(
  {
    month: { type: String, required: true },
    year: { type: Number, required: true },
    revenue: { type: Number, required: true, default: 0 },
    expenses: { type: Number, required: true, default: 0 },
    profit: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProfitReport", profitReportSchema);
