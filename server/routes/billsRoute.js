const express = require("express");
const {
  addBillsController,
  getBillsController,
  deleteBillsController,
} = require("./../controllers/billsController");

const router = express.Router();

//routes

//MEthod - POST
router.post("/add-bills", addBillsController);
router.post("/delete-bills", deleteBillsController);

//MEthod - GET
router.get("/get-bills", getBillsController);

module.exports = router;
