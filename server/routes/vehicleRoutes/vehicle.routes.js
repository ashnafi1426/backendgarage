const express = require("express");
const { verifyToken, isAdmin } = require("../../middlewares/auth.middleware");
const {
  getAllVehicles,
  getVehicle,
  getVehiclesByCustomer,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../../controllers/vehicleControllers/vehicle.controller");

const router = express.Router();

// All vehicle routes require admin access
router.get("/api/vehicle", [verifyToken, isAdmin], getAllVehicles);
router.get("/api/vehicle/customer/:customer_id", [verifyToken, isAdmin], getVehiclesByCustomer);
router.get("/api/vehicle/:id", [verifyToken, isAdmin], getVehicle);
router.post("/api/vehicle", [verifyToken, isAdmin], addVehicle);
router.put("/api/vehicle/:id", [verifyToken, isAdmin], updateVehicle);
router.delete("/api/vehicle/:id", [verifyToken, isAdmin], deleteVehicle);

module.exports = router;
