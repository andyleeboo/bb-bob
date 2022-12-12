import { createClient } from '@supabase/supabase-js';

let process: any;

const env = process?.env ? process.env : import.meta.env;

const supabaseConfig = {
	supabaseUrl: env.VITE_SUPABASE_URL,
	supabaseKey: env.VITE_SUPABASE_ANON_KEY
};

export const supabase = createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseKey);
