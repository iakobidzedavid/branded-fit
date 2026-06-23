-- waitlist_signups: stores early-access signup submissions from the homepage waitlist form

CREATE TABLE IF NOT EXISTS public.waitlist_signups (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_signups_email_idx ON public.waitlist_signups (email);

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_waitlist_signups" ON public.waitlist_signups;
CREATE POLICY "anon_insert_waitlist_signups"
  ON public.waitlist_signups FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_waitlist_signups" ON public.waitlist_signups;
CREATE POLICY "anon_select_waitlist_signups"
  ON public.waitlist_signups FOR SELECT
  TO anon, authenticated
  USING (true);
