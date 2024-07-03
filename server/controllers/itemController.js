const ProfitReport = require("../models/ProfitReport");
const itemModel = require("../models/itemModel");

// get items
const getItemController = async (req, res) => {
  try {
    const items = await itemModel.find();
    res.status(200).send(items);
  } catch (error) {
    console.log(error);
  }
};

//add items
const addItemController = async (req, res) => {
  try {
    const newItem = new itemModel(req.body);
    await newItem.save();

    const timestamp = newItem.createdAt;
    const date = new Date(timestamp);
    const monthName = date.toLocaleString("default", { month: "long" });
    const yearName = date.getFullYear();

    // update monthly expenses
    const findExpensesByMonth = await ProfitReport.findOne({
      $and: [{ month: monthName }, { year: yearName }],
    });

    if (!findExpensesByMonth) {
      const newProfitReport = await new ProfitReport({
        month: monthName,
        year: yearName,
        revenue: 0,
        expenses: newItem.price * newItem.quantity,
        profit: 0,
      });

      await newProfitReport.save();
      return res.status(201).send(`Item created`);
    }

    findExpensesByMonth.expenses += newItem.price * newItem.quantity;
    findExpensesByMonth.profit =
      findExpensesByMonth.revenue - findExpensesByMonth.expenses;
    await findExpensesByMonth.save();

    res.status(201).send(`Item created`);
  } catch (error) {
    res.status(400).send("error", error);
    console.log(error);
  }
};

//update item
const editItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log(itemId);
    await itemModel.findOneAndUpdate({ _id: itemId }, req.body, {
      new: true,
    });

    res.status(201).json("item Updated");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//delete item
const deleteItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log(itemId);
    await itemModel.findOneAndDelete({ _id: itemId });
    res.status(200).json("item Deleted");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports = {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
};
