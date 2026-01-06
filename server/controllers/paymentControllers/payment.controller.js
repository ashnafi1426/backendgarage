const paymentService = require('../../services/paymentServices/payment.service');

async function getAllPayments(req, res) {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json({ status: 'success', data: payments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to get payments' });
  }
}

async function getPaymentById(req, res) {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({ status: 'fail', message: 'Payment not found' });
    }
    res.status(200).json({ status: 'success', data: payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to get payment' });
  }
}

async function getPaymentsByOrder(req, res) {
  try {
    const payments = await paymentService.getPaymentsByOrder(req.params.orderId);
    res.status(200).json({ status: 'success', data: payments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to get payments' });
  }
}

async function createPayment(req, res) {
  try {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json({ status: 'success', data: payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to create payment' });
  }
}

async function updatePayment(req, res) {
  try {
    const payment = await paymentService.updatePayment(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to update payment' });
  }
}

async function deletePayment(req, res) {
  try {
    await paymentService.deletePayment(req.params.id);
    res.status(200).json({ status: 'success', message: 'Payment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Failed to delete payment' });
  }
}

module.exports = {
  getAllPayments,
  getPaymentById,
  getPaymentsByOrder,
  createPayment,
  updatePayment,
  deletePayment,
};
