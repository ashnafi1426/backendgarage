const express = require('express');
const router = express.Router();
const stripeController = require('../../controllers/stripeControllers/stripe.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

router.post('/api/stripe/create-payment-intent', verifyToken, stripeController.createPaymentIntent);
router.post('/api/stripe/confirm-payment', verifyToken, stripeController.confirmPayment);

module.exports = router;
