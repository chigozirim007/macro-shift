-- ============================================================
-- MACRO-SHIFT: Supabase SQL Schema V2 (Expansions)
-- Paste this entire file into your Supabase SQL Editor and run it.
-- ============================================================

-- ── 1. POSTS TABLE UPDATE ─────────────────────────────────────
-- Add views_count to posts if it doesn't exist
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- ── 2. REPOSTS TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reposts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- ── 3. FOLLOWS TABLE (For Following/Followers) ────────────────
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  -- A user cannot follow the same person twice
  UNIQUE(follower_id, following_id),
  -- A user cannot follow themselves
  CONSTRAINT check_not_self_follow CHECK (follower_id != following_id)
);

-- ── 4. NOTIFICATIONS (Optional for future, good to have) ──────
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'repost', 'comment', 'follow')),
  actor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 5. ROW LEVEL SECURITY (RLS) ───────────────────────────────
ALTER TABLE public.reposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for reposts"
  ON public.reposts FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for follows"
  ON public.follows FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for notifications"
  ON public.notifications FOR ALL
  USING (true) WITH CHECK (true);

-- Done! Your Macro-Shift schema is expanded.
