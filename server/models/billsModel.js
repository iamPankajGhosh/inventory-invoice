const mongoose = require("mongoose");

const billSchema = mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerNumber: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    totalCostAmount: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      required: true,
    },
    billItems: {
      type: Array,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const Bills = mongoose.model("bills", billSchema);

module.exports = Bills;
