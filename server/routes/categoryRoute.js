const express = require("express");
const {
  getCategoryController,
  addCategoryController,
  deleteCategoryController,
} = require("./../controllers/categoryController");

const router = express.Router();

//routes
//Method - get
router.get("/get-category", getCategoryController);

//MEthod - POST
router.post("/add-category", addCategoryController);

//method - DELETE
router.post("/delete-category", deleteCategoryController);

module.exports = router;
