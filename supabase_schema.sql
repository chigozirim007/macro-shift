-- ============================================================
-- MACRO-SHIFT: Supabase SQL Schema
-- Paste this entire file into your Supabase SQL Editor and run it.
-- ============================================================

-- Enable UUID extension (already available in Supabase by default)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── 1. USERS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  first_name TEXT,
  last_name TEXT,
  username TEXT UNIQUE,
  phone TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  interests TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── 2. EMAIL VERIFICATIONS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast OTP lookups
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON public.email_verifications(email);

-- ── 3. POSTS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'AI & Machine Learning',
    'Cloud & Infrastructure',
    'Software Development',
    'Emerging Hardware',
    'Trends'
  )),
  post_post_references TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- ── 4. LIKES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- ── 5. BOOKMARKS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- ── 6. COMMENTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 7. ROW LEVEL SECURITY (RLS) ───────────────────────────────
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Since we use the anon key from our backend (server-side),
-- we grant full access to the service/anon key for now.
-- For production, switch to service role key on the server.

-- Allow anon key to read/write everything (server-side only calls)
CREATE POLICY "Allow all operations for service role"
  ON public.users FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for email_verifications"
  ON public.email_verifications FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for posts"
  ON public.posts FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for likes"
  ON public.likes FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for bookmarks"
  ON public.bookmarks FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for comments"
  ON public.comments FOR ALL
  USING (true) WITH CHECK (true);

-- ── 8. SAMPLE SEED DATA (Optional — delete if not needed) ─────
-- Uncomment below to seed some initial posts for testing

/*
INSERT INTO public.users (email, first_name, last_name, username, is_verified, role)
VALUES ('admin@macroshift.io', 'Macro', 'Admin', 'macroshift_admin', true, 'admin');

INSERT INTO public.posts (user_id, title, content, category, references)
SELECT id,
  'Quantum-Resistant Encryption Protocols',
  'New neural-lattice structures are providing unprecedented security against Shor''s algorithm, ensuring long-term data sovereignty.',
  'AI & Machine Learning',
  ARRAY['Nature Quantum', 'ArXiv:2403.12']
FROM public.users WHERE username = 'macroshift_admin';
*/

-- Done! Your Macro-Shift schema is ready.
