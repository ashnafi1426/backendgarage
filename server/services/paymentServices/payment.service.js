const supabase = require('../../config/supabaseClient');

async function getAllPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('payment_id', { ascending: false });

  if (error) throw error;

  const paymentsWithDetails = await Promise.all(data.map(async (payment) => {
    let orderInfo = {};
    let customerInfo = {};

    if (payment.order_id) {
      const { data: order } = await supabase
        .from('orders')
        .select('*, customer_id')
        .eq('order_id', payment.order_id)
        .single();

      if (order) {
        orderInfo = order;

        const { data: customer } = await supabase
          .from('customer_identifier')
          .select('customer_email, customer_info(customer_first_name, customer_last_name)')
          .eq('customer_id', order.customer_id)
          .single();

        if (customer) {
          customerInfo = {
            customer_email: customer.customer_email,
            customer_first_name: customer.customer_info?.customer_first_name,
            customer_last_name: customer.customer_info?.customer_last_name,
          };
        }
      }
    }

    return { ...payment, order: orderInfo, customer: customerInfo };
  }));

  return paymentsWithDetails;
}

async function getPaymentById(payment_id) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('payment_id', payment_id)
    .single();

  if (error) return null;
  return data;
}

async function getPaymentsByOrder(order_id) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', order_id)
    .order('payment_date', { ascending: false });

  if (error) throw error;
  return data;
}

async function createPayment(payment) {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      order_id: payment.order_id,
      amount: payment.amount,
      payment_method: payment.payment_method,
      payment_status: payment.payment_status || 'completed',
      notes: payment.notes || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updatePayment(id, payment) {
  const { data, error } = await supabase
    .from('payments')
    .update({
      amount: payment.amount,
      payment_method: payment.payment_method,
      payment_status: payment.payment_status,
      notes: payment.notes,
    })
    .eq('payment_id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function deletePayment(id) {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('payment_id', id);

  if (error) throw error;
  return true;
}

module.exports = {
  getAllPayments,
  getPaymentById,
  getPaymentsByOrder,
  createPayment,
  updatePayment,
  deletePayment,
};
