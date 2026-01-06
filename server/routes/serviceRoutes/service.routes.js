const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/auth.middleware");
const {
  getAllServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
} = require("../../controllers/serviceControllers/service.controller");

router.get("/api/service", getAllServices);
router.get("/api/service/:id", getServiceById);
router.post("/api/service", [verifyToken], addService);
router.put("/api/service/:id", [verifyToken], updateService);
router.delete("/api/service/:id", [verifyToken], deleteService);

module.exports = router;
