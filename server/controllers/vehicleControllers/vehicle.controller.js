const vehicleService = require('../../services/vehicleServices/vehicle.service');

async function getAllVehicles(req, res) {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(200).json({ status: 'success', data: vehicles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to get vehicles' });
  }
}

async function getVehicle(req, res) {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    if (!vehicle) return res.status(404).json({ status: 'fail', message: 'Vehicle not found' });
    res.status(200).json({ status: 'success', data: vehicle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to get vehicle' });
  }
}

async function getVehiclesByCustomer(req, res) {
  try {
    const vehicles = await vehicleService.getVehiclesByCustomerId(req.params.customer_id);
    res.status(200).json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to get vehicles' });
  }
}

async function addVehicle(req, res) {
  try {
    const vehicle = await vehicleService.addVehicle(req.body);
    res.status(201).json({ status: 'success', vehicle });
  } catch (err) {
    console.error('Add vehicle error:', err);
    res.status(500).json({ status: 'fail', message: err.message || 'Failed to add vehicle' });
  }
}

async function updateVehicle(req, res) {
  try {
    const { id } = req.params;
    const updated = await vehicleService.updateVehicle(id, req.body);
    res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to update vehicle' });
  }
}

async function deleteVehicle(req, res) {
  try {
    const { id } = req.params;
    await vehicleService.deleteVehicle(id);
    res.status(200).json({ status: 'success', message: 'Vehicle deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to delete vehicle' });
  }
}

module.exports = {
  getAllVehicles,
  getVehicle,
  getVehiclesByCustomer,
  addVehicle,
  updateVehicle,
  deleteVehicle,
};
