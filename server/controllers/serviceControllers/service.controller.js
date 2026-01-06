const serviceService = require("../../services/serviceServices/service.service");

async function getAllServices(req, res) {
  try {
    const services = await serviceService.getAllServices();
    res.status(200).json({ status: "success", data: services });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "fail", message: "Failed to get services" });
  }
}

async function getServiceById(req, res) {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ status: "fail", message: "Service not found" });
    }
    res.status(200).json({ status: "success", data: service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "fail", message: "Failed to get service" });
  }
}

async function addService(req, res) {
  try {
    const service = await serviceService.addService(req.body);
    res.status(201).json({ status: "success", data: service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "fail", message: "Failed to add service" });
  }
}

async function updateService(req, res) {
  try {
    const updated = await serviceService.updateService(req.params.id, req.body);
    res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "fail", message: "Failed to update service" });
  }
}

async function deleteService(req, res) {
  try {
    await serviceService.deleteService(req.params.id);
    res.status(200).json({ status: "success", message: "Service deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "fail", message: "Failed to delete service" });
  }
}

module.exports = {
  getAllServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
};
