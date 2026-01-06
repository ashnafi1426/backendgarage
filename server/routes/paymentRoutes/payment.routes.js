const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/paymentControllers/payment.controller');
const { verifyToken, isAdmin } = require('../../middlewares/auth.middleware');

// All payment routes require admin access
router.get('/api/payment', [verifyToken, isAdmin], paymentController.getAllPayments);
router.get('/api/payment/:id', [verifyToken, isAdmin], paymentController.getPaymentById);
router.get('/api/payment/order/:orderId', [verifyToken, isAdmin], paymentController.getPaymentsByOrder);
router.post('/api/payment', [verifyToken, isAdmin], paymentController.createPayment);
router.put('/api/payment/:id', [verifyToken, isAdmin], paymentController.updatePayment);
router.delete('/api/payment/:id', [verifyToken, isAdmin], paymentController.deletePayment);

module.exports = router;
