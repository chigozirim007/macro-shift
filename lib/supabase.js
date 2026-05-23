import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from './env';

const { url: supabaseUrl, anonKey: supabaseKey } = getSupabaseEnv();

export const supabase = createClient(supabaseUrl, supabaseKey);
