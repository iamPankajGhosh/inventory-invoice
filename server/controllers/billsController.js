const ProfitReport = require("../models/ProfitReport");
const billsModel = require("../models/billsModel");
const itemModel = require("../models/itemModel");

//add items
const addBillsController = async (req, res) => {
  try {
    const newBill = new billsModel(req.body);
    await newBill.save();

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
    console.log(newBill);
    const findProfitReportByMonthAndYear = await ProfitReport.findOne({
      month: new Date(newBill.createdAt)
        .toLocaleString("default", {
          month: "long",
        })
        .toLowerCase(),
      year: new Date(newBill.createdAt).getFullYear(),
    });

    if (!findProfitReportByMonthAndYear) {
      await ProfitReport.create({
        month: new Date(newBill.createdAt)
          .toLocaleString("default", {
            month: "long",
          })
          .toLowerCase(),
        year: new Date(newBill.createdAt).getFullYear(),
        revenue: newBill.totalAmount,
        expenses: 0,
        profit: newBill.totalAmount - newBill.totalCostAmount,
      });
    }

    findProfitReportByMonthAndYear.revenue += newBill.totalAmount;
    findProfitReportByMonthAndYear.profit +=
      newBill.totalAmount - newBill.totalCostAmount;
    await findProfitReportByMonthAndYear.save();

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
    bills.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.send(bills);
  } catch (error) {
    console.log(error);
  }
};

//get last bill
const getLastBill = async (req, res) => {
  try {
    const bills = await billsModel.find();
    bills.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.send(bills[0]);
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
  getLastBill,
};
