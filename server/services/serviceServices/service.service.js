const supabase = require('../../config/supabaseClient');

async function getAllServices() {
  const { data, error } = await supabase
    .from('common_services')
    .select('*')
    .order('service_id', { ascending: true });

  if (error) throw error;
  return data;
}

async function getServiceById(service_id) {
  const { data, error } = await supabase
    .from('common_services')
    .select('*')
    .eq('service_id', service_id)
    .single();

  if (error) return null;
  return data;
}

async function addService(service) {
  const { data, error } = await supabase
    .from('common_services')
    .insert(service)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateService(id, service) {
  const { data, error } = await supabase
    .from('common_services')
    .update({
      service_name: service.service_name,
      service_description: service.service_description,
    })
    .eq('service_id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function deleteService(id) {
  const { error } = await supabase
    .from('common_services')
    .delete()
    .eq('service_id', id);

  if (error) throw error;
  return true;
}

module.exports = {
  getAllServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
};
