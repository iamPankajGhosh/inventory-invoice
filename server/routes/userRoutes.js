const express = require("express");
const {
  loginController,
  registerController,
  stockLoginController,
} = require("./../controllers/userController");

const router = express.Router();

//routes
//Method - get
router.post("/login", loginController);

//MEthod - POST
router.post("/register", registerController);
router.post("/stock/login", stockLoginController);

module.exports = router;
