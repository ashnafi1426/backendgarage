const { createClient } = require('@supabase/supabase-js');

// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
  
  if (process.env.NODE_ENV === 'production') {
    console.error('💡 Please set these variables in your Render dashboard');
  } else {
    console.error('💡 Please check your .env file');
  }
  
  // Don't exit - let the app start and show proper error messages
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase client initialized');
module.exports = supabase;