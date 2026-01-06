const loginService = require('../../services/loginServices/login.service');
const jwt = require('jsonwebtoken');

async function logIn(req, res) {
  try {
    const result = await loginService.logIn(req.body);

    if (result.status === 'fail') {
      console.log('Login Failed:', result.message);
      return res.status(403).json(result);
    }

    const employee = result.data;
    
    console.log('Login Success - Employee Data:', {
      employee_id: employee.employee_id,
      employee_email: employee.employee_email,
      company_role_id: employee.employee_role?.company_role_id,
    });

    const payload = {
      employee_id: employee.employee_id,
      employee_email: employee.employee_email,
      employee_role: employee.employee_role.company_role_id,
      company_role_id: employee.employee_role.company_role_id,
      employee_first_name: employee.employee_info.employee_first_name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    const responseData = {
      employee_token: token,
      employee_id: employee.employee_id,
      employee_email: employee.employee_email,
      employee_first_name: employee.employee_info?.employee_first_name,
      company_role_id: employee.employee_role?.company_role_id,
      employee_role: employee.employee_role?.company_role_id, // Add for compatibility
    };
    
    console.log('Login Response Data:', responseData);

    return res.status(200).json({
      status: 'success',
      data: responseData,
    });
  } catch (err) {
    console.error('Login Controller Error:', err);
    return res.status(500).json({
      status: 'fail',
      message: 'Login failed',
    });
  }
}

module.exports = { logIn };
