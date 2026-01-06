const contactService = require('../../services/contactServices/contact.service');

// Create a new contact submission (PUBLIC - no auth required)
async function createContact(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name, email, and message are required',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid email format',
      });
    }

    const contact = await contactService.createContact(req.body);

    if (!contact) {
      return res.status(500).json({
        status: 'fail',
        message: 'Failed to submit contact form',
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: contact,
    });
  } catch (err) {
    console.error('Create contact error:', err);
    res.status(500).json({
      status: 'fail',
      message: 'Server error',
    });
  }
}

// Get all contacts (ADMIN only)
async function getAllContacts(req, res) {
  try {
    const contacts = await contactService.getAllContacts();

    res.status(200).json({
      status: 'success',
      data: contacts,
    });
  } catch (err) {
    console.error('Get all contacts error:', err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to get contacts',
    });
  }
}

// Get contact by ID (ADMIN only)
async function getContactById(req, res) {
  try {
    const { id } = req.params;
    const contact = await contactService.getContactById(id);

    if (!contact) {
      return res.status(404).json({
        status: 'fail',
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: contact,
    });
  } catch (err) {
    console.error('Get contact by ID error:', err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to get contact',
    });
  }
}

// Update contact status (ADMIN only)
async function updateContactStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['new', 'read', 'replied', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid status. Must be: new, read, replied, or closed',
      });
    }

    const updated = await contactService.updateContactStatus(id, status);

    if (!updated) {
      return res.status(400).json({
        status: 'fail',
        message: 'Failed to update contact status',
      });
    }

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  } catch (err) {
    console.error('Update contact status error:', err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to update contact',
    });
  }
}

// Delete contact (ADMIN only)
async function deleteContact(req, res) {
  try {
    const { id } = req.params;
    const deleted = await contactService.deleteContact(id);

    if (!deleted) {
      return res.status(400).json({
        status: 'fail',
        message: 'Failed to delete contact',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact deleted successfully',
    });
  } catch (err) {
    console.error('Delete contact error:', err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to delete contact',
    });
  }
}

// Get contacts by status (ADMIN only)
async function getContactsByStatus(req, res) {
  try {
    const { status } = req.params;
    const contacts = await contactService.getContactsByStatus(status);

    res.status(200).json({
      status: 'success',
      data: contacts,
    });
  } catch (err) {
    console.error('Get contacts by status error:', err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to get contacts',
    });
  }
}

// Get contact statistics (ADMIN only)
async function getContactStats(req, res) {
  try {
    const stats = await contactService.getContactStats();

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (err) {
    console.error('Get contact stats error:', err);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to get contact statistics',
    });
  }
}

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactsByStatus,
  getContactStats,
};
