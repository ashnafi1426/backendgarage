const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/paymentControllers/payment.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

router.get('/api/payment', verifyToken, paymentController.getAllPayments);
router.get('/api/payment/:id', verifyToken, paymentController.getPaymentById);
router.get('/api/payment/order/:orderId', verifyToken, paymentController.getPaymentsByOrder);
router.post('/api/payment', verifyToken, paymentController.createPayment);
router.put('/api/payment/:id', verifyToken, paymentController.updatePayment);
router.delete('/api/payment/:id', verifyToken, paymentController.deletePayment);

module.exports = router;
