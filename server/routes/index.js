// Import the express module 
const express = require('express');
// Call the router method from express to create the router 
const router = express.Router();

// Import routes from organized folders
const employeeRouter = require('./employeeRoutes/employee.routes');
const loginRoutes = require("./loginRoutes/login.routes");
const customerRouter = require('./customerRoutes/customer.routes');
const vehicleRouter = require('./vehicleRoutes/vehicle.routes');
const serviceRouter = require('./serviceRoutes/service.routes');
const orderRouter = require('./orderRoutes/order.routes');
const paymentRouter = require('./paymentRoutes/payment.routes');
const stripeRouter = require('./stripeRoutes/stripe.routes');
const contactRouter = require('./contactRoutes/contact.routes');

// Add routes to the main router
router.use(employeeRouter);
router.use(loginRoutes);
router.use(customerRouter);
router.use(vehicleRouter);
router.use(serviceRouter);
router.use(orderRouter);
router.use(paymentRouter);
router.use(stripeRouter);
router.use(contactRouter);

// Export the router
module.exports = router; 