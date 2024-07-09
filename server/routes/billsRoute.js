const express = require("express");
const {
  addBillsController,
  getBillsController,
  deleteBillsController,
  getLastBill,
} = require("./../controllers/billsController");

const router = express.Router();

//routes

//MEthod - POST
router.post("/add-bills", addBillsController);
router.post("/delete-bills", deleteBillsController);

//MEthod - GET
router.get("/get-bills", getBillsController);
router.get("/get-last-bill", getLastBill);

module.exports = router;
