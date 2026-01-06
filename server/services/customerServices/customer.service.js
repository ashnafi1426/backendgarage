const supabase = require('../../config/supabaseClient');
const { v4: uuidv4 } = require('uuid');

async function getAllCustomers() {
  const { data, error } = await supabase
    .from('customer_identifier')
    .select(`
      customer_id,
      customer_email,
      customer_phone_number,
      customer_hash,
      customer_added_date,
      customer_info (
        customer_first_name,
        customer_last_name,
        customer_active_status
      )
    `)
    .order('customer_id', { ascending: false });

  if (error) throw error;
  return data.map(c => ({
    customer_id: c.customer_id,
    customer_email: c.customer_email,
    customer_phone_number: c.customer_phone_number,
    customer_hash: c.customer_hash,
    customer_added_date: c.customer_added_date,
    customer_first_name: c.customer_info?.customer_first_name || '',
    customer_last_name: c.customer_info?.customer_last_name || '',
    active_customer_status: c.customer_info?.customer_active_status || 1,
  }));
}

async function getCustomerById(id) {
  const { data, error } = await supabase
    .from('customer_identifier')
    .select(`
      customer_id,
      customer_email,
      customer_phone_number,
      customer_hash,
      customer_added_date,
      customer_info (
        customer_first_name,
        customer_last_name,
        customer_active_status
      )
    `)
    .eq('customer_id', id)
    .single();

  if (error) return null;

  return {
    customer_id: data.customer_id,
    customer_email: data.customer_email,
    customer_phone_number: data.customer_phone_number,
    customer_hash: data.customer_hash,
    customer_added_date: data.customer_added_date,
    customer_first_name: data.customer_info?.customer_first_name || '',
    customer_last_name: data.customer_info?.customer_last_name || '',
    active_customer_status: data.customer_info?.customer_active_status || 1,
  };
}

async function addCustomer(customer) {
  const customer_hash = customer.customer_hash || uuidv4();

  const { data: custData, error: custError } = await supabase
    .from('customer_identifier')
    .insert({
      customer_email: customer.customer_email,
      customer_phone_number: customer.customer_phone_number,
      customer_hash,
    })
    .select()
    .single();

  if (custError) throw custError;

  await supabase.from('customer_info').insert({
    customer_id: custData.customer_id,
    customer_first_name: customer.customer_first_name,
    customer_last_name: customer.customer_last_name,
    customer_active_status: customer.active_customer_status || 1,
  });

  return getCustomerById(custData.customer_id);
}

async function updateCustomer(id, customer) {
  await supabase
    .from('customer_identifier')
    .update({
      customer_email: customer.customer_email,
      customer_phone_number: customer.customer_phone_number,
    })
    .eq('customer_id', id);

  await supabase
    .from('customer_info')
    .update({
      customer_first_name: customer.customer_first_name,
      customer_last_name: customer.customer_last_name,
      customer_active_status: customer.active_customer_status,
    })
    .eq('customer_id', id);

  return getCustomerById(id);
}

async function deleteCustomer(id) {
  try {
    await supabase.from('customer_vehicle_info').delete().eq('customer_id', id);
    await supabase.from('customer_info').delete().eq('customer_id', id);
    await supabase.from('customer_identifier').delete().eq('customer_id', id);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};
