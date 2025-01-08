import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl === 'your_supabase_url' || !supabaseKey || supabaseKey === 'your_supabase_anon_key') {
  throw new Error(
    'Please click the "Connect to Supabase" button in the top right to set up your Supabase project. ' +
    'This will configure the necessary environment variables and database tables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);