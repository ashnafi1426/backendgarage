const supabase = require('../../config/supabaseClient');

async function getAllVehicles() {
  const { data, error } = await supabase
    .from('customer_vehicle_info')
    .select('*')
    .order('vehicle_id', { ascending: false });

  if (error) throw error;
  return data;
}

async function getVehicleById(vehicle_id) {
  const { data, error } = await supabase
    .from('customer_vehicle_info')
    .select('*')
    .eq('vehicle_id', vehicle_id)
    .single();

  if (error) return null;
  return data;
}

async function getVehiclesByCustomerId(customer_id) {
  const { data, error} = await supabase
    .from('customer_vehicle_info')
    .select('*')
    .eq('customer_id', customer_id);

  if (error) throw error;
  return data;
}

async function addVehicle(vehicle) {
  const { data, error } = await supabase
    .from('customer_vehicle_info')
    .insert(vehicle)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateVehicle(id, vehicle) {
  const { data, error } = await supabase
    .from('customer_vehicle_info')
    .update(vehicle)
    .eq('vehicle_id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function deleteVehicle(id) {
  const { error } = await supabase
    .from('customer_vehicle_info')
    .delete()
    .eq('vehicle_id', id);

  if (error) throw error;
  return true;
}

module.exports = {
  getAllVehicles,
  getVehicleById,
  getVehiclesByCustomerId,
  addVehicle,
  updateVehicle,
  deleteVehicle,
};
