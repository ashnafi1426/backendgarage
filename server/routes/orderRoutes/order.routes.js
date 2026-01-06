const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderControllers/order.controller');
const auth = require('../../middlewares/auth.middleware');

router.get('/api/order', auth.verifyToken, orderController.getAllOrders);
router.get('/api/order/:id', auth.verifyToken, orderController.getOrderById);
router.post('/api/order', auth.verifyToken, orderController.createOrder);
router.put('/api/order/:id', auth.verifyToken, orderController.updateOrder);
router.delete('/api/order/:id', auth.verifyToken, orderController.deleteOrder);

module.exports = router;
