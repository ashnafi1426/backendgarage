const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/contactControllers/contact.controller');
const { verifyToken, isAdmin } = require('../../middlewares/auth.middleware');

// Public route - anyone can submit contact form
router.post('/api/contact', contactController.createContact);

// Admin routes - require authentication and admin role
router.get('/api/contacts', [verifyToken, isAdmin], contactController.getAllContacts);
router.get('/api/contact/:id', [verifyToken, isAdmin], contactController.getContactById);
router.put('/api/contact/:id/status', [verifyToken, isAdmin], contactController.updateContactStatus);
router.delete('/api/contact/:id', [verifyToken, isAdmin], contactController.deleteContact);
router.get('/api/contacts/status/:status', [verifyToken, isAdmin], contactController.getContactsByStatus);
router.get('/api/contacts/stats', [verifyToken, isAdmin], contactController.getContactStats);

module.exports = router;
