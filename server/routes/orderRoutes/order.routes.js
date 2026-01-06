const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderControllers/order.controller');
const auth = require('../../middlewares/auth.middleware');

// All order routes require admin access
router.get('/api/order', [auth.verifyToken, auth.isAdmin], orderController.getAllOrders);
router.get('/api/order/:id', [auth.verifyToken, auth.isAdmin], orderController.getOrderById);
router.post('/api/order', [auth.verifyToken, auth.isAdmin], orderController.createOrder);
router.put('/api/order/:id', [auth.verifyToken, auth.isAdmin], orderController.updateOrder);
router.delete('/api/order/:id', [auth.verifyToken, auth.isAdmin], orderController.deleteOrder);

module.exports = router;
