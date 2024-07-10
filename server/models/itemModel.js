const mongoose = require("mongoose");

const itemSchema = mongoose.Schema(
  {
    serialNo: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Items = mongoose.model("items", itemSchema);

module.exports = Items;
