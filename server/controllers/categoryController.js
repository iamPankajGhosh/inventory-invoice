const categoryModel = require("../models/categoryModel");

// get category
const getCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    categories.sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).send(categories);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

//add category
const addCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new categoryModel({
      name,
    });

    await category.save();
    res.status(201).send("Category Created Successfully");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

//delete category
const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.body;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send("Category Deleted Successfully");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports = {
  getCategoryController,
  addCategoryController,
  deleteCategoryController,
};
