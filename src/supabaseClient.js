import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your actual Supabase URL and Anon key
// It's recommended to store these in an environment file (.env)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Supabase Client Init: URL =', supabaseUrl ? 'Loaded' : 'NOT LOADED', ', Anon Key =', supabaseAnonKey ? 'Loaded' : 'NOT LOADED');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase Client Init Error: Supabase URL or Anon Key is missing!');
  console.error('Please check your .env file and ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set.');
  throw new Error('Supabase configuration is missing. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})