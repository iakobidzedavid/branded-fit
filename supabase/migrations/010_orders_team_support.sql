-- orders: stores all orders synced from Shopify/Printify
CREATE TABLE IF NOT EXISTS public.orders (
  id                   UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  shopify_order_id     TEXT        UNIQUE,
  store_name           TEXT        NOT NULL DEFAULT 'Default Store',
  customer_name        TEXT,
  customer_email       TEXT,
  customer_id          TEXT,
  shipping_address     JSONB,
  product_name         TEXT,
  product_sku          TEXT,
  product_mockup_url   TEXT,
  quantity             INTEGER     DEFAULT 1,
  unit_price           NUMERIC(10,2),
  total_price          NUMERIC(10,2),
  fulfillment_status   TEXT        DEFAULT 'pending',
  printify_tracking_url TEXT,
  order_notes          TEXT,
  order_date           TIMESTAMPTZ DEFAULT NOW(),
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_orders" ON public.orders;
CREATE POLICY "service_role_all_orders"
  ON public.orders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- team_invites: tracks storefront team member invitations
CREATE TABLE IF NOT EXISTS public.team_invites (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'viewer',
  storefront_id TEXT,
  store_name    TEXT,
  invited_by    TEXT,
  status        TEXT        DEFAULT 'pending',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_team_invites" ON public.team_invites;
CREATE POLICY "anon_insert_team_invites"
  ON public.team_invites FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_team_invites" ON public.team_invites;
CREATE POLICY "service_role_all_team_invites"
  ON public.team_invites FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- support_escalations: manual intervention requests
CREATE TABLE IF NOT EXISTS public.support_escalations (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  domain         TEXT,
  error_details  TEXT,
  contact_email  TEXT,
  status         TEXT        DEFAULT 'open',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.support_escalations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_support_escalations" ON public.support_escalations;
CREATE POLICY "anon_insert_support_escalations"
  ON public.support_escalations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_support_escalations" ON public.support_escalations;
CREATE POLICY "service_role_all_support_escalations"
  ON public.support_escalations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
