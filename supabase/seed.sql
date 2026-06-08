-- Seed: analytics_events for MVBP funnel validation
-- Three mock stores (acme.com, techcorp.io, buildfast.co), 2.5-day span
-- 36 events across 5 funnel stages:
--   domain_submitted (10), brand_extraction_started (10),
--   brand_extraction_completed (8), storefront_generated (5), storefront_published (3)
--
-- Session types distributed across stores:
--   Type A (3 sessions): full pipeline — all 5 stages
--   Type B (2 sessions): stops after storefront_generated
--   Type C (3 sessions): stops after brand_extraction_completed
--   Type D (2 sessions): stops after brand_extraction_started (extraction failed)

TRUNCATE TABLE analytics_events RESTART IDENTITY;

-- ── acme.com ──────────────────────────────────────────────────────────────────

-- sess-acme-01: Type A — full pipeline, 60h ago
INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('domain_submitted',           'domain_submitted',           'acme.com', 'sess-acme-01', NOW() - INTERVAL '60 hours',                             '{"source":"landing_page","ab_variant":"A"}'),
  ('brand_extraction_started',   'brand_extraction_started',   'acme.com', 'sess-acme-01', NOW() - INTERVAL '60 hours' + INTERVAL '30 seconds',     '{"trigger":"auto"}'),
  ('brand_extraction_completed', 'brand_extraction_completed', 'acme.com', 'sess-acme-01', NOW() - INTERVAL '60 hours' + INTERVAL '90 seconds',     '{"fidelity_score":91.5,"colors_found":3,"logo_found":true}'),
  ('storefront_generated',       'storefront_generated',       'acme.com', 'sess-acme-01', NOW() - INTERVAL '60 hours' + INTERVAL '4 minutes',      '{"product_count":6,"template":"minimal"}'),
  ('storefront_published',       'storefront_published',       'acme.com', 'sess-acme-01', NOW() - INTERVAL '60 hours' + INTERVAL '7 minutes',      '{"storefront_url":"https://acme-merch.myshopify.com"}');

-- sess-acme-02: Type B — through storefront_generated, 36h ago
INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('domain_submitted',           'domain_submitted',           'acme.com', 'sess-acme-02', NOW() - INTERVAL '36 hours',                             '{"source":"email_campaign","ab_variant":"B"}'),
  ('brand_extraction_started',   'brand_extraction_started',   'acme.com', 'sess-acme-02', NOW() - INTERVAL '36 hours' + INTERVAL '28 seconds',     '{"trigger":"auto"}'),
  ('brand_extraction_completed', 'brand_extraction_completed', 'acme.com', 'sess-acme-02', NOW() - INTERVAL '36 hours' + INTERVAL '95 seconds',     '{"fidelity_score":87.2,"colors_found":4,"logo_found":true}'),
  ('storefront_generated',       'storefront_generated',       'acme.com', 'sess-acme-02', NOW() - INTERVAL '36 hours' + INTERVAL '5 minutes',      '{"product_count":4,"template":"bold"}');

-- sess-acme-03: Type C — through brand_extraction_completed, 24h ago
INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('domain_submitted',           'domain_submitted',           'acme.com', 'sess-acme-03', NOW() - INTERVAL '24 hours',                             '{"source":"direct","ab_variant":"C"}'),
  ('brand_extraction_started',   'brand_extraction_started',   'acme.com', 'sess-acme-03', NOW() - INTERVAL '24 hours' + INTERVAL '32 seconds',     '{"trigger":"auto"}'),
  ('brand_extraction_completed', 'brand_extraction_completed', 'acme.com', 'sess-acme-03', NOW() - INTERVAL '24 hours' + INTERVAL '85 seconds',     '{"fidelity_score":79.8,"colors_found":2,"logo_found":false}');

-- sess-acme-04: Type D — extraction failed, 12h ago
INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('domain_submitted',         'domain_submitted',         'acme.com', 'sess-acme-04', NOW() - INTERVAL '12 hours',                             '{"source":"landing_page","ab_variant":"A"}'),
  ('brand_extraction_started', 'brand_extraction_started', 'acme.com', 'sess-acme-04', NOW() - INTERVAL '12 hours' + INTERVAL '31 seconds',     '{"trigger":"auto","error":"brandfetch_timeout"}');

-- ── techcorp.io ───────────────────────────────────────────────────────────────

-- sess-tech-01: Type A — full pipeline, 48h ago
INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('domain_submitted',           'domain_submitted',           'techcorp.io', 'sess-tech-01', NOW() - INTERVAL '48 hours',                          '{"source":"referral","ab_variant":"B"}'),
  ('brand_extraction_started',   'brand_extraction_started',   'techcorp.io', 'sess-tech-01', NOW() - INTERVAL '48 hours' + INTERVAL '25 seconds',  '{"trigger":"auto"}'),
  ('brand_extraction_completed', 'brand_extraction_completed', 'techcorp.io', 'sess-tech-01', NOW() - INTERVAL '48 hours' + INTERVAL '80 seconds',  '{"fidelity_score":94.1,"colors_found":5,"logo_found":true}'),
  ('storefront_generated',       'storefront_generated',       'techcorp.io', 'sess-tech-01', NOW() - INTERVAL '48 hours' + INTERVAL '3 minutes',   '{"product_count":8,"template":"minimal"}'),
  ('storefront_published',       'storefront_published',       'techcorp.io', 'sess-tech-01', NOW() - INTERVAL '48 hours' + INTERVAL '6 minutes',   '{"storefront_url":"https://techcorp-merch.myshopify.com"}');

-- sess-tech-02: Type C — through brand_extraction_completed, 22h ago
INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('domain_submitted',           'domain_submitted',           'techcorp.io', 'sess-tech-02', NOW() - INTERVAL '22 hours',                          '{"source":"direct","ab_variant":"C"}'),
  ('brand_extraction_started',   'brand_extraction_started',   'techcorp.io', 'sess-tech-02', NOW() - INTERVAL '22 hours' + INTERVAL '33 seconds',  '{"trigger":"auto"}'),
  ('brand_extraction_completed', 'brand_extraction_completed', 'techcorp.io', 'sess-tech-02', NOW() - INTERVAL '22 hours' + INTERVAL '100 seconds', '{"fidelity_score":83.6,"colors_found":3,"logo_found":true}');

-- sess-tech-03: Type B — through storefront_generated, 7h ago
INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('domain_submitted',           'domain_submitted',           'techcorp.io', 'sess-tech-03', NOW() - INTERVAL '7 hours',                           '{"source":"email_campaign","ab_variant":"A"}'),
  ('brand_extraction_started',   'brand_extraction_started',   'techcorp.io', 'sess-tech-03', NOW() - INTERVAL '7 hours' + INTERVAL '27 seconds',   '{"trigger":"auto"}'),
  ('brand_extraction_completed', 'brand_extraction_completed', 'techcorp.io', 'sess-tech-03', NOW() - INTERVAL '7 hours' + INTERVAL '88 seconds',   '{"fidelity_score":88.9,"colors_found":4,"logo_found":true}'),
  ('storefront_generated',       'storefront_generated',       'techcorp.io', 'sess-tech-03', NOW() - INTERVAL '7 hours' + INTERVAL '4 minutes',    '{"product_count":5,"template":"bold"}');

-- ── buildfast.co ──────────────────────────────────────────────────────────────

-- sess-build-01: Type A — full pipeline, 52h ago
INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('domain_submitted',           'domain_submitted',           'buildfast.co', 'sess-build-01', NOW() - INTERVAL '52 hours',                            '{"source":"landing_page","ab_variant":"B"}'),
  ('brand_extraction_started',   'brand_extraction_started',   'buildfast.co', 'sess-build-01', NOW() - INTERVAL '52 hours' + INTERVAL '22 seconds',    '{"trigger":"auto"}'),
  ('brand_extraction_completed', 'brand_extraction_completed', 'buildfast.co', 'sess-build-01', NOW() - INTERVAL '52 hours' + INTERVAL '75 seconds',    '{"fidelity_score":96.3,"colors_found":6,"logo_found":true}'),
  ('storefront_generated',       'storefront_generated',       'buildfast.co', 'sess-build-01', NOW() - INTERVAL '52 hours' + INTERVAL '3 minutes 30 seconds', '{"product_count":7,"template":"minimal"}'),
  ('storefront_published',       'storefront_published',       'buildfast.co', 'sess-build-01', NOW() - INTERVAL '52 hours' + INTERVAL '6 minutes 30 seconds', '{"storefront_url":"https://buildfast-merch.myshopify.com"}');

-- sess-build-02: Type C — through brand_extraction_completed, 28h ago
INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('domain_submitted',           'domain_submitted',           'buildfast.co', 'sess-build-02', NOW() - INTERVAL '28 hours',                            '{"source":"referral","ab_variant":"C"}'),
  ('brand_extraction_started',   'brand_extraction_started',   'buildfast.co', 'sess-build-02', NOW() - INTERVAL '28 hours' + INTERVAL '35 seconds',    '{"trigger":"auto"}'),
  ('brand_extraction_completed', 'brand_extraction_completed', 'buildfast.co', 'sess-build-02', NOW() - INTERVAL '28 hours' + INTERVAL '92 seconds',    '{"fidelity_score":75.4,"colors_found":2,"logo_found":false}');

-- sess-build-03: Type D — extraction failed, 4h ago
INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('domain_submitted',         'domain_submitted',         'buildfast.co', 'sess-build-03', NOW() - INTERVAL '4 hours',                            '{"source":"direct","ab_variant":"A"}'),
  ('brand_extraction_started', 'brand_extraction_started', 'buildfast.co', 'sess-build-03', NOW() - INTERVAL '4 hours' + INTERVAL '30 seconds',    '{"trigger":"auto","error":"invalid_domain"}');

-- Verification query (run after seed to confirm counts):
-- SELECT event_name, COUNT(*) FROM analytics_events GROUP BY event_name ORDER BY event_name;
-- Expected: brand_extraction_completed(8), brand_extraction_started(10),
--           domain_submitted(10), storefront_generated(5), storefront_published(3)
