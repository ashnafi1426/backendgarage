const supabase = require('../../config/supabaseClient');
const bcrypt = require('bcryptjs');

async function getEmployeeByEmail(email) {
  const { data, error } = await supabase
    .from('employee')
    .select(`
      employee_id,
      employee_email,
      employee_active_status,
      employee_info (
        employee_first_name
      ),
      employee_pass (
        employee_password_hashed
      ),
      employee_role (
        company_role_id
      )
    `)
    .eq('employee_email', email)
    .single();

  if (error || !data) return null;
  return data;
}

async function logIn({ employee_email, employee_password }) {
  const employee = await getEmployeeByEmail(employee_email);

  if (!employee) {
    return { status: 'fail', message: 'Employee not found' };
  }
  if (!employee.employee_pass?.employee_password_hashed) {
    return { status: 'fail', message: 'Password not set for employee' };
  }

  const match = await bcrypt.compare(
    employee_password,
    employee.employee_pass.employee_password_hashed
  );

  if (!match) {
    return { status: 'fail', message: 'Incorrect password' };
  }

  if (!employee.employee_role?.company_role_id) {
    return { status: 'fail', message: 'Employee role not assigned' };
  }

  return {
    status: 'success',
    data: employee,
  };
}

module.exports = { logIn };
