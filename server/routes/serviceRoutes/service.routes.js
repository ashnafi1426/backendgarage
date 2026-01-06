const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../../middlewares/auth.middleware");
const {
  getAllServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
} = require("../../controllers/serviceControllers/service.controller");

// All service routes require admin access
router.get("/api/service", [verifyToken, isAdmin], getAllServices);
router.get("/api/service/:id", [verifyToken, isAdmin], getServiceById);
router.post("/api/service", [verifyToken, isAdmin], addService);
router.put("/api/service/:id", [verifyToken, isAdmin], updateService);
router.delete("/api/service/:id", [verifyToken, isAdmin], deleteService);

module.exports = router;
