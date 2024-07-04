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
    console.log(newItem);

    const addItemsMonth = new Date(newItem.createdAt).toLocaleString("en-US", {
      month: "long",
    });
    const addItemsYear = new Date(newItem.createdAt).getFullYear();

    const findExpensesByMonthAndYear = await ProfitReport.findOne({
      month: addItemsMonth,
      year: addItemsYear,
    });

    if (!findExpensesByMonthAndYear) {
      const newProfitReport = new ProfitReport({
        month: addItemsMonth,
        year: addItemsYear,
        expenses: newItem.price * newItem.quantity,
        revenue: 0,
        profit: 0,
      });
      await newProfitReport.save();
      console.log(newProfitReport);
      return res.status(201).send(`Item added successfully`);
    }

    //update expenses
    findExpensesByMonthAndYear.expenses += newItem.price * newItem.quantity;
    //update profit
    findExpensesByMonthAndYear.profit =
      findExpensesByMonthAndYear.revenue - findExpensesByMonthAndYear.expenses;

    await findExpensesByMonthAndYear.save();

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
    const updatedStockItem = await itemModel.findOne({ _id: itemId });
    updatedStockItem.name = req.body.name;
    updatedStockItem.price = req.body.price;
    updatedStockItem.newPrice = req.body.newPrice;
    updatedStockItem.quantity =
      Number(updatedStockItem.quantity) + Number(req.body.quantity);
    updatedStockItem.category = req.body.category;
    await updatedStockItem.save();

    // update profit report
    const updatedItemsMonth = new Date(
      updatedStockItem.updatedAt
    ).toLocaleString("en-US", {
      month: "long",
    });
    const updatedItemsYear = new Date(updatedStockItem.updatedAt).getFullYear();

    const findExpensesByMonthAndYear = await ProfitReport.findOne({
      month: updatedItemsMonth,
      year: updatedItemsYear,
    });

    //update expenses
    findExpensesByMonthAndYear.expenses +=
      updatedStockItem.price * updatedStockItem.quantity;
    //update profit
    findExpensesByMonthAndYear.profit =
      findExpensesByMonthAndYear.revenue - findExpensesByMonthAndYear.expenses;
    await findExpensesByMonthAndYear.save();

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
    const deletedItem = await itemModel.findOne({ _id: itemId });
    console.log(deletedItem);

    const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
    const currentYear = new Date().getFullYear();

    const findExpensesByMonthAndYear = await ProfitReport.findOne({
      month: currentMonth,
      year: currentYear,
    });

    //update expenses
    findExpensesByMonthAndYear.expenses -=
      deletedItem.price * deletedItem.quantity;
    //update profit
    findExpensesByMonthAndYear.profit =
      findExpensesByMonthAndYear.revenue - findExpensesByMonthAndYear.expenses;
    await findExpensesByMonthAndYear.save();
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
