const express = require("express");
const { verifyToken, isAdmin } = require("../../middlewares/auth.middleware");
const {
  getAllCustomersController,
  getCustomerByIdController,
  addCustomerController,
  updateCustomerController,
  deleteCustomerController,
} = require("../../controllers/customerControllers/customer.controller");

const router = express.Router();

// All customer routes require admin access
router.get("/api/customers", [verifyToken, isAdmin], getAllCustomersController);
router.get("/api/customers/:id", [verifyToken, isAdmin], getCustomerByIdController);
router.post("/api/customers", [verifyToken, isAdmin], addCustomerController);
router.put("/api/customers/:id", [verifyToken, isAdmin], updateCustomerController);
router.delete("/api/customers/:id", [verifyToken, isAdmin], deleteCustomerController);

module.exports = router;
