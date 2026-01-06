const employeeService = require('../../services/employeeServices/employee.service');

async function createEmployee(req, res) {
  try {
    const exists = await employeeService.checkIfEmployeeExists(req.body.employee_email);

    if (exists) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already exists',
      });
    }

    const employee = await employeeService.createEmployee(req.body);

    if (!employee) {
      return res.status(400).json({
        status: 'fail',
        message: 'Failed to create employee',
      });
    }

    res.status(201).json({
      status: 'success',
      data: employee,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Server error',
    });
  }
}

async function getAllEmployees(req, res) {
  try {
    const employees = await employeeService.getAllEmployees();

    res.status(200).json({
      status: 'success',
      data: employees,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to get employees',
    });
  }
}

async function getEmployeeById(req, res) {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeById(id);

    if (!employee) {
      return res.status(404).json({
        status: 'fail',
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: employee,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to get employee',
    });
  }
}

async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const updated = await employeeService.updateEmployee(id, req.body);

    if (!updated) {
      return res.status(400).json({
        status: 'fail',
        message: 'Failed to update employee',
      });
    }

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to update employee',
    });
  }
}

async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;
    const deleted = await employeeService.deleteEmployee(id);

    if (!deleted) {
      return res.status(400).json({
        status: 'fail',
        message: 'Failed to delete employee',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Employee deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to delete employee',
    });
  }
}

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
