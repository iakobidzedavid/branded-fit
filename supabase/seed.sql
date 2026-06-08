-- Seed: analytics_events for MVBP funnel validation (v3)
-- Four pipeline sessions across 4 domains, 72h span
-- Event names match what Command Console and Storefront Preview actually emit:
--   domain_submission, brand_extraction_start, brand_extraction_complete,
--   mockup_generation_start, mockup_generation_complete,
--   storefront_generation_start, storefront_generation_complete,
--   storefront_view, product_view, cart_add
--
-- Sessions:
--   sess-v3-01 (ramp.com):   full pipeline, ~72h ago, 7 events
--   sess-v3-02 (notion.so):  full pipeline, ~48h ago, 7 events
--   sess-v3-03 (stripe.com): full pipeline, ~24h ago, 7 events
--   sess-v3-04 (figma.com):  partial (dropped after mockup_generation_start), ~8h ago, 4 events
--   sess-v3-store (ramp.com): storefront visits, ~2h ago, 8 events
-- Total: 33 events

TRUNCATE TABLE analytics_events RESTART IDENTITY;

-- ── ramp.com — sess-v3-01: full pipeline, ~72h ago ──────────────────────────

INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, metadata) VALUES
  ('domain_submission',              'domain_submission',              'ramp.com', 'sess-v3-01', 'intake',                NOW() - INTERVAL '72 hours',                          '{"source":"landing_page","ab_variant":"A"}'),
  ('brand_extraction_start',         'brand_extraction_start',         'ramp.com', 'sess-v3-01', 'brand_extraction',      NOW() - INTERVAL '72 hours' + INTERVAL '18 seconds',  '{"trigger":"auto"}'),
  ('brand_extraction_complete',      'brand_extraction_complete',      'ramp.com', 'sess-v3-01', 'brand_extraction',      NOW() - INTERVAL '72 hours' + INTERVAL '72 seconds',  '{"fidelity_score":92.4,"colors_found":3,"logo_found":true,"duration_ms":54000}'),
  ('mockup_generation_start',        'mockup_generation_start',        'ramp.com', 'sess-v3-01', 'mockup_generation',     NOW() - INTERVAL '72 hours' + INTERVAL '74 seconds',  '{"trigger":"auto"}'),
  ('mockup_generation_complete',     'mockup_generation_complete',     'ramp.com', 'sess-v3-01', 'mockup_generation',     NOW() - INTERVAL '72 hours' + INTERVAL '138 seconds', '{"product_count":6,"duration_ms":64000}'),
  ('storefront_generation_start',    'storefront_generation_start',    'ramp.com', 'sess-v3-01', 'storefront_generation', NOW() - INTERVAL '72 hours' + INTERVAL '140 seconds', '{"trigger":"auto"}'),
  ('storefront_generation_complete', 'storefront_generation_complete', 'ramp.com', 'sess-v3-01', 'storefront_generation', NOW() - INTERVAL '72 hours' + INTERVAL '194 seconds', '{"storefront_url":"https://ramp-merch.myshopify.com","product_count":6,"duration_ms":54000}');

-- ── notion.so — sess-v3-02: full pipeline, ~48h ago ─────────────────────────

INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, metadata) VALUES
  ('domain_submission',              'domain_submission',              'notion.so', 'sess-v3-02', 'intake',                NOW() - INTERVAL '48 hours',                          '{"source":"referral","ab_variant":"B"}'),
  ('brand_extraction_start',         'brand_extraction_start',         'notion.so', 'sess-v3-02', 'brand_extraction',      NOW() - INTERVAL '48 hours' + INTERVAL '22 seconds',  '{"trigger":"auto"}'),
  ('brand_extraction_complete',      'brand_extraction_complete',      'notion.so', 'sess-v3-02', 'brand_extraction',      NOW() - INTERVAL '48 hours' + INTERVAL '88 seconds',  '{"fidelity_score":95.1,"colors_found":5,"logo_found":true,"duration_ms":66000}'),
  ('mockup_generation_start',        'mockup_generation_start',        'notion.so', 'sess-v3-02', 'mockup_generation',     NOW() - INTERVAL '48 hours' + INTERVAL '90 seconds',  '{"trigger":"auto"}'),
  ('mockup_generation_complete',     'mockup_generation_complete',     'notion.so', 'sess-v3-02', 'mockup_generation',     NOW() - INTERVAL '48 hours' + INTERVAL '158 seconds', '{"product_count":8,"duration_ms":68000}'),
  ('storefront_generation_start',    'storefront_generation_start',    'notion.so', 'sess-v3-02', 'storefront_generation', NOW() - INTERVAL '48 hours' + INTERVAL '160 seconds', '{"trigger":"auto"}'),
  ('storefront_generation_complete', 'storefront_generation_complete', 'notion.so', 'sess-v3-02', 'storefront_generation', NOW() - INTERVAL '48 hours' + INTERVAL '211 seconds', '{"storefront_url":"https://notion-merch.myshopify.com","product_count":8,"duration_ms":51000}');

-- ── stripe.com — sess-v3-03: full pipeline, ~24h ago ────────────────────────

INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, metadata) VALUES
  ('domain_submission',              'domain_submission',              'stripe.com', 'sess-v3-03', 'intake',                NOW() - INTERVAL '24 hours',                          '{"source":"direct","ab_variant":"A"}'),
  ('brand_extraction_start',         'brand_extraction_start',         'stripe.com', 'sess-v3-03', 'brand_extraction',      NOW() - INTERVAL '24 hours' + INTERVAL '15 seconds',  '{"trigger":"auto"}'),
  ('brand_extraction_complete',      'brand_extraction_complete',      'stripe.com', 'sess-v3-03', 'brand_extraction',      NOW() - INTERVAL '24 hours' + INTERVAL '65 seconds',  '{"fidelity_score":97.3,"colors_found":4,"logo_found":true,"duration_ms":50000}'),
  ('mockup_generation_start',        'mockup_generation_start',        'stripe.com', 'sess-v3-03', 'mockup_generation',     NOW() - INTERVAL '24 hours' + INTERVAL '67 seconds',  '{"trigger":"auto"}'),
  ('mockup_generation_complete',     'mockup_generation_complete',     'stripe.com', 'sess-v3-03', 'mockup_generation',     NOW() - INTERVAL '24 hours' + INTERVAL '127 seconds', '{"product_count":7,"duration_ms":60000}'),
  ('storefront_generation_start',    'storefront_generation_start',    'stripe.com', 'sess-v3-03', 'storefront_generation', NOW() - INTERVAL '24 hours' + INTERVAL '129 seconds', '{"trigger":"auto"}'),
  ('storefront_generation_complete', 'storefront_generation_complete', 'stripe.com', 'sess-v3-03', 'storefront_generation', NOW() - INTERVAL '24 hours' + INTERVAL '183 seconds', '{"storefront_url":"https://stripe-merch.myshopify.com","product_count":7,"duration_ms":54000}');

-- ── figma.com — sess-v3-04: partial, dropped after mockup start, ~8h ago ────

INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, metadata) VALUES
  ('domain_submission',     'domain_submission',     'figma.com', 'sess-v3-04', 'intake',            NOW() - INTERVAL '8 hours',                         '{"source":"email_campaign","ab_variant":"C"}'),
  ('brand_extraction_start','brand_extraction_start','figma.com', 'sess-v3-04', 'brand_extraction',  NOW() - INTERVAL '8 hours' + INTERVAL '26 seconds', '{"trigger":"auto"}'),
  ('brand_extraction_complete','brand_extraction_complete','figma.com','sess-v3-04','brand_extraction',NOW() - INTERVAL '8 hours' + INTERVAL '94 seconds','{"fidelity_score":81.6,"colors_found":2,"logo_found":true,"duration_ms":68000}'),
  ('mockup_generation_start','mockup_generation_start','figma.com','sess-v3-04','mockup_generation',  NOW() - INTERVAL '8 hours' + INTERVAL '96 seconds', '{"trigger":"auto"}');

-- ── ramp.com storefront — sess-v3-store: product_view + cart_add, ~2h ago ───

INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('storefront_view', 'storefront_view', 'ramp.com', 'sess-v3-store', NOW() - INTERVAL '2 hours',                         '{"store_id":"ramp-001","status":"draft"}'),
  ('product_view',    'product_view',    'ramp.com', 'sess-v3-store', NOW() - INTERVAL '2 hours' + INTERVAL '45 seconds', '{"sku":"BF-TEE-001","product_name":"Premium Tee","price":32.99}'),
  ('product_view',    'product_view',    'ramp.com', 'sess-v3-store', NOW() - INTERVAL '2 hours' + INTERVAL '82 seconds', '{"sku":"BF-CAP-002","product_name":"Embroidered Cap","price":28.99}'),
  ('cart_add',        'cart_add',        'ramp.com', 'sess-v3-store', NOW() - INTERVAL '2 hours' + INTERVAL '95 seconds', '{"sku":"BF-TEE-001","product_name":"Premium Tee","price":32.99}'),
  ('product_view',    'product_view',    'ramp.com', 'sess-v3-store', NOW() - INTERVAL '2 hours' + INTERVAL '130 seconds','{"sku":"BF-HOD-003","product_name":"Zip Hoodie","price":64.99}'),
  ('cart_add',        'cart_add',        'ramp.com', 'sess-v3-store', NOW() - INTERVAL '2 hours' + INTERVAL '148 seconds','{"sku":"BF-HOD-003","product_name":"Zip Hoodie","price":64.99}'),
  ('product_view',    'product_view',    'ramp.com', 'sess-v3-store', NOW() - INTERVAL '2 hours' + INTERVAL '185 seconds','{"sku":"BF-TOT-004","product_name":"Tote Bag","price":22.99}'),
  ('cart_add',        'cart_add',        'ramp.com', 'sess-v3-store', NOW() - INTERVAL '2 hours' + INTERVAL '201 seconds','{"sku":"BF-TOT-004","product_name":"Tote Bag","price":22.99}');

-- Verification query (run after seed to confirm counts):
-- SELECT event_name, COUNT(*) FROM analytics_events GROUP BY event_name ORDER BY event_name;
-- Expected:
--   brand_extraction_complete   (4)
--   brand_extraction_start      (4)
--   cart_add                    (3)
--   domain_submission           (4)
--   mockup_generation_complete  (3)
--   mockup_generation_start     (4)
--   product_view                (4)
--   storefront_generation_complete (3)
--   storefront_generation_start (3)
--   storefront_view             (1)
--   TOTAL                      (33)
