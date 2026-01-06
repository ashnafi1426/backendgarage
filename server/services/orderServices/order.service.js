const supabase = require('../../config/supabaseClient');
const { v4: uuidv4 } = require('uuid');

async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('order_id', { ascending: false });

  if (error) throw error;
  
  const ordersWithDetails = await Promise.all(data.map(async (order) => {
    let customerInfo = { customer_first_name: '', customer_last_name: '', customer_email: '' };
    if (order.customer_id) {
      const { data: customer } = await supabase
        .from('customer_identifier')
        .select(`
          customer_email,
          customer_info (customer_first_name, customer_last_name)
        `)
        .eq('customer_id', order.customer_id)
        .single();
      
      if (customer) {
        customerInfo = {
          customer_email: customer.customer_email || '',
          customer_first_name: customer.customer_info?.customer_first_name || '',
          customer_last_name: customer.customer_info?.customer_last_name || '',
        };
      }
    }

    let vehicleInfo = { vehicle_make: '', vehicle_model: '', vehicle_year: '', vehicle_tag: '' };
    if (order.customer_id) {
      const { data: vehicles } = await supabase
        .from('customer_vehicle_info')
        .select('vehicle_make, vehicle_model, vehicle_year, vehicle_tag')
        .eq('customer_id', order.customer_id)
        .limit(1);
      
      if (vehicles && vehicles.length > 0) vehicleInfo = vehicles[0];
    }

    let orderStatus = 0;
    const { data: status } = await supabase
      .from('order_status')
      .select('order_status')
      .eq('order_id', order.order_id)
      .single();
    if (status) orderStatus = status.order_status;

    return {
      ...order,
      ...customerInfo,
      ...vehicleInfo,
      order_status: orderStatus,
    };
  }));

  return ordersWithDetails;
}

async function getOrderById(order_id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', order_id)
    .single();

  if (error) return null;

  let customerInfo = {};
  if (data.customer_id) {
    const { data: customer } = await supabase
      .from('customer_identifier')
      .select(`customer_email, customer_info (customer_first_name, customer_last_name)`)
      .eq('customer_id', data.customer_id)
      .single();
    if (customer) customerInfo = customer;
  }

  let vehicleInfo = {};
  if (data.customer_id) {
    const { data: vehicles } = await supabase
      .from('customer_vehicle_info')
      .select('*')
      .eq('customer_id', data.customer_id)
      .limit(1);
    if (vehicles && vehicles.length > 0) vehicleInfo = vehicles[0];
  }

  const { data: orderInfo } = await supabase
    .from('order_info')
    .select('*')
    .eq('order_id', order_id)
    .single();

  const { data: orderStatus } = await supabase
    .from('order_status')
    .select('*')
    .eq('order_id', order_id)
    .single();

  const { data: orderServices } = await supabase
    .from('order_services')
    .select('*, common_services(service_name)')
    .eq('order_id', order_id);

  return {
    ...data,
    customer: customerInfo,
    vehicle: vehicleInfo,
    order_info: orderInfo,
    order_status: orderStatus,
    order_services: orderServices,
  };
}

async function createOrder(order) {
  const { customer_id, employee_id, services, order_total_price } = order;

  const { data: newOrder, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id,
      employee_id,
      order_hash: uuidv4(),
    })
    .select()
    .single();

  if (orderError) throw orderError;

  await supabase.from('order_info').insert({
    order_id: newOrder.order_id,
    order_total_price: order_total_price || 0,
  });

  await supabase.from('order_status').insert({
    order_id: newOrder.order_id,
    order_status: 0,
  });

  if (services?.length > 0) {
    const rows = services.map(service_id => ({
      order_id: newOrder.order_id,
      service_id,
      service_completed: 0,
    }));
    await supabase.from('order_services').insert(rows);
  }

  return newOrder;
}

async function updateOrder(id, order) {
  const { order_status } = order;

  if (order_status !== undefined) {
    await supabase
      .from('order_status')
      .update({ order_status })
      .eq('order_id', id);
  }

  return true;
}

async function deleteOrder(id) {
  await supabase.from('order_services').delete().eq('order_id', id);
  await supabase.from('order_status').delete().eq('order_id', id);
  await supabase.from('order_info').delete().eq('order_id', id);
  await supabase.from('orders').delete().eq('order_id', id);
  return true;
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
