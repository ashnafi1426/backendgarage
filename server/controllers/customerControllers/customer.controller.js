const customerService = require('../../services/customerServices/customer.service');

async function getAllCustomersController(req, res) {
  try {
    const customers = await customerService.getAllCustomers();
    res.status(200).json({
      status: 'success',
      data: customers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to get customers',
    });
  }
}

async function getCustomerByIdController(req, res) {
  const { id } = req.params;
  try {
    const customer = await customerService.getCustomerById(id);
    if (!customer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Customer not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: customer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to get customer',
    });
  }
}

async function addCustomerController(req, res) {
  try {
    const newCustomer = await customerService.addCustomer(req.body);
    res.status(201).json({
      status: 'success',
      data: newCustomer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to add customer',
    });
  }
}

async function updateCustomerController(req, res) {
  const { id } = req.params;
  try {
    const updatedCustomer = await customerService.updateCustomer(id, req.body);
    res.status(200).json({
      status: 'success',
      data: updatedCustomer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to update customer',
    });
  }
}

async function deleteCustomerController(req, res) {
  const { id } = req.params;
  try {
    const deleted = await customerService.deleteCustomer(id);
    if (!deleted) {
      return res.status(400).json({
        status: 'fail',
        message: 'Failed to delete customer',
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Customer deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to delete customer',
    });
  }
}

module.exports = {
  getAllCustomersController,
  getCustomerByIdController,
  addCustomerController,
  updateCustomerController,
  deleteCustomerController,
};
