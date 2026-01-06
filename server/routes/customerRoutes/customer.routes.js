const express = require("express");
const { verifyToken } = require("../../middlewares/auth.middleware");
const {
  getAllCustomersController,
  getCustomerByIdController,
  addCustomerController,
  updateCustomerController,
  deleteCustomerController,
} = require("../../controllers/customerControllers/customer.controller");

const router = express.Router();

router.get("/api/customers", [verifyToken], getAllCustomersController);
router.get("/api/customers/:id", [verifyToken], getCustomerByIdController);
router.post("/api/customers", [verifyToken], addCustomerController);
router.put("/api/customers/:id", [verifyToken], updateCustomerController);
router.delete("/api/customers/:id", [verifyToken], deleteCustomerController);

module.exports = router;
