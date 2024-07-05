const ProfitReport = require("../models/ProfitReport");
const billsModel = require("../models/billsModel");
const itemModel = require("../models/itemModel");

//add items
const addBillsController = async (req, res) => {
  try {
    const newBill = new billsModel(req.body);
    await newBill.save();

    const timestamp = newBill.createdAt;
    const date = new Date(timestamp);
    const billMonth = date.toLocaleString("default", { month: "long" });
    const billYear = date.getFullYear();

    // update quantity in items
    await newBill.billItems.forEach(async (item) => {
      await itemModel.updateOne(
        {
          _id: item._id,
        },
        {
          $inc: {
            quantity: -item.billQuantity,
          },
        }
      );
    });

    // update profit report
    const profitReport = await ProfitReport.findOne({
      month: billMonth,
      year: billYear,
    });
    if (profitReport) {
      profitReport.revenue += newBill.totalAmount;
      profitReport.profit = Number(
        profitReport.revenue - profitReport.expenses
      ).toFixed(2);
      await profitReport.save();
    }

    res.send("Bill Created Successfully!");
  } catch (error) {
    res.send("something went wrong");
    console.log(error);
  }
};

//get blls data
const getBillsController = async (req, res) => {
  try {
    const bills = await billsModel.find();
    res.send(bills);
  } catch (error) {
    console.log(error);
  }
};

//delete bill data
const deleteBillsController = async (req, res) => {
  try {
    await billsModel.findByIdAndDelete(req.body.id);
    res.send("Bill Deleted Successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addBillsController,
  getBillsController,
  deleteBillsController,
};
