import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

export async function ensureUser(session) {
  if (!session?.user?.email) return null;
  const email = session.user.email.toLowerCase();

  // Try to find the user
  const { data: existingUser, error: existingUserError } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, username, avatar_url, role, is_verified')
    .eq('email', email)
    .maybeSingle();

  if (existingUserError) {
    console.error('Failed to find user in ensureUser:', existingUserError);
    return null;
  }

  if (existingUser) return existingUser;

  // Auto-create user if not found
  const nameParts = session.user.name ? session.user.name.split(' ') : [];
  const firstName = nameParts[0] || 'User';
  const lastName = nameParts.slice(1).join(' ') || '';
  const baseUsername = session.user.name ? session.user.name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'user';
  const username = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;

  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      email: email,
      first_name: firstName,
      last_name: lastName,
      username: username,
      avatar_url: session.user.image || null,
      is_verified: true,
      role: 'member'
    })
    .select('id, email, first_name, last_name, username, avatar_url, role, is_verified')
    .single();

  if (error) {
    console.error('Failed to auto-create user in ensureUser:', error);
    return null;
  }
  return newUser;
}
