const express = require("express");
const { verifyToken } = require("../../middlewares/auth.middleware");
const {
  getAllVehicles,
  getVehicle,
  getVehiclesByCustomer,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../../controllers/vehicleControllers/vehicle.controller");

const router = express.Router();

router.get("/api/vehicle", [verifyToken], getAllVehicles);
router.get("/api/vehicle/customer/:customer_id", [verifyToken], getVehiclesByCustomer);
router.get("/api/vehicle/:id", [verifyToken], getVehicle);
router.post("/api/vehicle", [verifyToken], addVehicle);
router.put("/api/vehicle/:id", [verifyToken], updateVehicle);
router.delete("/api/vehicle/:id", [verifyToken], deleteVehicle);

module.exports = router;
