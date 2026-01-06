const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../../middlewares/auth.middleware");
const employeeController = require("../../controllers/employeeControllers/employee.controller");

router.post("/api/employee", [verifyToken, isAdmin], employeeController.createEmployee);
router.get("/api/employees", [verifyToken, isAdmin], employeeController.getAllEmployees);
router.get("/api/employee/:id", [verifyToken, isAdmin], employeeController.getEmployeeById);
router.put("/api/employee/:id", [verifyToken, isAdmin], employeeController.updateEmployee);
router.delete("/api/employee/:id", [verifyToken, isAdmin], employeeController.deleteEmployee);

module.exports = router;
