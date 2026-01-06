const supabase = require('../../config/supabaseClient');
const bcrypt = require('bcryptjs');

async function checkIfEmployeeExists(email) {
  const { data, error } = await supabase
    .from('employee')
    .select('employee_id')
    .eq('employee_email', email)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  return !!data;
}

async function createEmployee(employee) {
  try {
    const { data: emp, error: empError } = await supabase
      .from('employee')
      .insert({
        employee_email: employee.employee_email,
        employee_active_status: 1,
      })
      .select()
      .single();

    if (empError) throw empError;
    const employee_id = emp.employee_id;

    const hashedPassword = await bcrypt.hash(employee.employee_password, 10);

    await supabase.from('employee_pass').insert({
      employee_id,
      employee_password_hashed: hashedPassword,
    });

    await supabase.from('employee_info').insert({
      employee_id,
      employee_first_name: employee.employee_first_name,
      employee_last_name: employee.employee_last_name,
      employee_phone: employee.employee_phone,
    });

    await supabase.from('employee_role').insert({
      employee_id,
      company_role_id: employee.company_role_id,
    });

    return { employee_id };
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getAllEmployees() {
  const { data, error } = await supabase
    .from('employee')
    .select(`
      employee_id,
      employee_email,
      employee_added_date,
      employee_active_status,
      employee_info (
        employee_first_name,
        employee_last_name,
        employee_phone
      ),
      employee_role (
        company_role_id
      )
    `)
    .order('employee_id', { ascending: false });

  if (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }

  // Map role IDs to role names (in case company_roles table doesn't exist or has wrong data)
  const roleMap = {
    1: 'Employee',
    2: 'Manager',
    3: 'Admin'
  };

  // Flatten the data structure and map role names
  const flattenedData = data.map(emp => {
    const roleId = emp.employee_role?.company_role_id || 0;
    const roleName = roleMap[roleId] || 'Unknown';
    
    console.log(`Employee ${emp.employee_id} (${emp.employee_email}) - Role ID: ${roleId}, Role Name: ${roleName}`);
    
    return {
      employee_id: emp.employee_id,
      employee_email: emp.employee_email,
      employee_added_date: emp.employee_added_date,
      employee_active_status: emp.employee_active_status,
      employee_info: emp.employee_info || {},
      employee_role: {
        company_role_id: roleId,
        company_roles: {
          company_role_name: roleName
        }
      }
    };
  });

  console.log(`Fetched ${flattenedData.length} employees`);
  return flattenedData;
}

async function getEmployeeById(id) {
  const { data, error } = await supabase
    .from('employee')
    .select(`
      employee_id,
      employee_email,
      employee_active_status,
      employee_added_date,
      employee_info (
        employee_first_name,
        employee_last_name,
        employee_phone
      ),
      employee_role (
        company_role_id
      )
    `)
    .eq('employee_id', id)
    .single();

  if (error) return null;

  return {
    employee_id: data.employee_id,
    employee_email: data.employee_email,
    employee_first_name: data.employee_info?.employee_first_name || '',
    employee_last_name: data.employee_info?.employee_last_name || '',
    employee_phone: data.employee_info?.employee_phone || '',
    active_employee: data.employee_active_status,
    company_role_id: data.employee_role?.company_role_id || 1,
  };
}

async function updateEmployee(id, employee) {
  try {
    await supabase
      .from('employee_info')
      .update({
        employee_first_name: employee.employee_first_name,
        employee_last_name: employee.employee_last_name,
        employee_phone: employee.employee_phone,
      })
      .eq('employee_id', id);

    await supabase
      .from('employee')
      .update({
        employee_active_status: employee.active_employee,
      })
      .eq('employee_id', id);

    await supabase
      .from('employee_role')
      .update({
        company_role_id: employee.company_role_id,
      })
      .eq('employee_id', id);

    return getEmployeeById(id);
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function deleteEmployee(id) {
  try {
    await supabase.from('employee_role').delete().eq('employee_id', id);
    await supabase.from('employee_pass').delete().eq('employee_id', id);
    await supabase.from('employee_info').delete().eq('employee_id', id);
    await supabase.from('employee').delete().eq('employee_id', id);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
