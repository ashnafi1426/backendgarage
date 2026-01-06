const orderService = require('../../services/orderServices/order.service');

async function getAllOrders(req, res) {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ status: 'success', data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to get orders' });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ status: 'fail', message: 'Order not found' });
    }
    res.status(200).json({ status: 'success', data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to get order' });
  }
}

async function createOrder(req, res) {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ status: 'success', data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to create order' });
  }
}

async function updateOrder(req, res) {
  try {
    await orderService.updateOrder(req.params.id, req.body);
    res.status(200).json({ status: 'success', message: 'Order updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to update order' });
  }
}

async function deleteOrder(req, res) {
  try {
    await orderService.deleteOrder(req.params.id);
    res.status(200).json({ status: 'success', message: 'Order deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to delete order' });
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
