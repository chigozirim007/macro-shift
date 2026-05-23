function readEnv(name) {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

export function getRequiredEnv(name, hint) {
  const value = readEnv(name);

  if (!value) {
    const suffix = hint ? ` ${hint}` : '';
    throw new Error(`Missing required environment variable ${name}.${suffix}`);
  }

  return value;
}

export function getOptionalEnv(name) {
  return readEnv(name) || undefined;
}

export function getSupabaseEnv() {
  return {
    url: getRequiredEnv('SUPABASE_URL', 'Set it to your Supabase project URL.'),
    anonKey: getRequiredEnv('SUPABASE_ANON_KEY', 'Set it to your Supabase anon/public API key.'),
  };
}

export function getEmailEnv() {
  return {
    user: getRequiredEnv('GMAIL_USER', 'Set it to the Gmail sender account.'),
    appPassword: getRequiredEnv(
      'GMAIL_APP_PASSWORD',
      'Use a Gmail app password, not the account password.',
    ),
  };
}
