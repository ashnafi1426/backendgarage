const supabase = require('../../config/supabaseClient');

// Create a new contact submission
async function createContact(contactData) {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        contact_name: contactData.name,
        contact_email: contactData.email,
        contact_phone: contactData.phone || null,
        contact_subject: contactData.subject || 'General Inquiry',
        contact_message: contactData.message,
        contact_status: 'new',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Create contact error:', err);
    return null;
  }
}

// Get all contacts
async function getAllContacts() {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('contact_created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Get all contacts error:', err);
    throw err;
  }
}

// Get contact by ID
async function getContactById(id) {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('contact_id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Get contact by ID error:', err);
    return null;
  }
}

// Update contact status
async function updateContactStatus(id, status) {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .update({
        contact_status: status,
        contact_updated_at: new Date().toISOString(),
      })
      .eq('contact_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Update contact status error:', err);
    return null;
  }
}

// Delete contact
async function deleteContact(id) {
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('contact_id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Delete contact error:', err);
    return false;
  }
}

// Get contacts by status
async function getContactsByStatus(status) {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('contact_status', status)
      .order('contact_created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Get contacts by status error:', err);
    throw err;
  }
}

// Get contact statistics
async function getContactStats() {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('contact_status');

    if (error) throw error;

    const stats = {
      total: data.length,
      new: data.filter(c => c.contact_status === 'new').length,
      read: data.filter(c => c.contact_status === 'read').length,
      replied: data.filter(c => c.contact_status === 'replied').length,
      closed: data.filter(c => c.contact_status === 'closed').length,
    };

    return stats;
  } catch (err) {
    console.error('Get contact stats error:', err);
    throw err;
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
