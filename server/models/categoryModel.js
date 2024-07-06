const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Categories = mongoose.model("categories", categorySchema);

module.exports = Categories;
