-- app_config: runtime key-value store for operator secrets and config
-- Credentials are inserted directly into the DB (not in this file) to keep
-- secrets out of the public git repository.
CREATE TABLE IF NOT EXISTS public.app_config (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write — anon and authenticated roles cannot access
DROP POLICY IF EXISTS "service_select_app_config" ON public.app_config;
CREATE POLICY "service_select_app_config"
  ON public.app_config FOR SELECT
  TO service_role
  USING (true);

DROP POLICY IF EXISTS "service_insert_app_config" ON public.app_config;
CREATE POLICY "service_insert_app_config"
  ON public.app_config FOR INSERT
  TO service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "service_update_app_config" ON public.app_config;
CREATE POLICY "service_update_app_config"
  ON public.app_config FOR UPDATE
  TO service_role
  USING (true);
