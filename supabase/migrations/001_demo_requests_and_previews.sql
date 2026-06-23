-- demo_requests and storefront_previews tables

-- 1. demo_requests — captures demo/discovery call requests from all forms
CREATE TABLE IF NOT EXISTS public.demo_requests (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  company     TEXT        NOT NULL,
  domain      TEXT,
  source      TEXT        DEFAULT 'direct',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_demo_requests" ON public.demo_requests;
CREATE POLICY "anon_insert_demo_requests"
  ON public.demo_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 2. storefront_previews — shareable AI storefront preview links
CREATE TABLE IF NOT EXISTS public.storefront_previews (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  domain        TEXT        NOT NULL,
  company_name  TEXT,
  palette_index INTEGER     DEFAULT 0,
  email         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.storefront_previews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_storefront_previews" ON public.storefront_previews;
CREATE POLICY "anon_insert_storefront_previews"
  ON public.storefront_previews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_storefront_previews" ON public.storefront_previews;
CREATE POLICY "anon_select_storefront_previews"
  ON public.storefront_previews FOR SELECT
  TO anon, authenticated
  USING (true);
