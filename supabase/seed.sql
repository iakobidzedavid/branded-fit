-- Seed: analytics_events for MVBP funnel validation (v2)
-- Five sessions across 5 domains, 7-day span (168h)
-- 25 events across 8 funnel stages:
--   domain_submitted (5), brand_extraction_started (5),
--   brand_extraction_completed (4), storefront_generated (3),
--   storefront_published (2), demo_viewed (3),
--   pilot_cta_clicked (2), email_opened (1)
--
-- Session types:
--   sess-v2-01 (acme.com):      full pipeline + email_opened + demo_viewed + pilot_cta_clicked
--   sess-v2-02 (techcorp.io):   full pipeline + demo_viewed + pilot_cta_clicked
--   sess-v2-03 (buildfast.co):  through storefront_generated + demo_viewed
--   sess-v2-04 (startupco.io):  through brand_extraction_completed
--   sess-v2-05 (launchpad.co):  domain_submitted + brand_extraction_started only

TRUNCATE TABLE analytics_events RESTART IDENTITY;

-- ── acme.com — sess-v2-01: full pipeline + engagement events, ~160h ago ───────

INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('domain_submitted',           'domain_submitted',           'acme.com', 'sess-v2-01', NOW() - INTERVAL '160 hours',                              '{"source":"landing_page","ab_variant":"A"}'),
  ('brand_extraction_started',   'brand_extraction_started',   'acme.com', 'sess-v2-01', NOW() - INTERVAL '160 hours' + INTERVAL '28 seconds',      '{"trigger":"auto"}'),
  ('brand_extraction_completed', 'brand_extraction_completed', 'acme.com', 'sess-v2-01', NOW() - INTERVAL '160 hours' + INTERVAL '90 seconds',      '{"fidelity_score":91.5,"colors_found":3,"logo_found":true}'),
  ('storefront_generated',       'storefront_generated',       'acme.com', 'sess-v2-01', NOW() - INTERVAL '160 hours' + INTERVAL '4 minutes',       '{"product_count":6,"template":"minimal"}'),
  ('storefront_published',       'storefront_published',       'acme.com', 'sess-v2-01', NOW() - INTERVAL '160 hours' + INTERVAL '7 minutes',       '{"storefront_url":"https://acme-merch.myshopify.com"}'),
  ('email_opened',               'email_opened',               'acme.com', 'sess-v2-01', NOW() - INTERVAL '155 hours',                              '{"campaign":"welcome_series","email_id":"welcome-001"}'),
  ('demo_viewed',                'demo_viewed',                'acme.com', 'sess-v2-01', NOW() - INTERVAL '150 hours',                              '{"demo_variant":"B","duration_seconds":142}'),
  ('pilot_cta_clicked',          'pilot_cta_clicked',          'acme.com', 'sess-v2-01', NOW() - INTERVAL '145 hours',                              '{"cta_location":"demo_page","plan":"starter"}');

-- ── techcorp.io — sess-v2-02: full pipeline + engagement events, ~120h ago ────

INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('domain_submitted',           'domain_submitted',           'techcorp.io', 'sess-v2-02', NOW() - INTERVAL '120 hours',                           '{"source":"referral","ab_variant":"B"}'),
  ('brand_extraction_started',   'brand_extraction_started',   'techcorp.io', 'sess-v2-02', NOW() - INTERVAL '120 hours' + INTERVAL '25 seconds',   '{"trigger":"auto"}'),
  ('brand_extraction_completed', 'brand_extraction_completed', 'techcorp.io', 'sess-v2-02', NOW() - INTERVAL '120 hours' + INTERVAL '80 seconds',   '{"fidelity_score":94.1,"colors_found":5,"logo_found":true}'),
  ('storefront_generated',       'storefront_generated',       'techcorp.io', 'sess-v2-02', NOW() - INTERVAL '120 hours' + INTERVAL '3 minutes',    '{"product_count":8,"template":"minimal"}'),
  ('storefront_published',       'storefront_published',       'techcorp.io', 'sess-v2-02', NOW() - INTERVAL '120 hours' + INTERVAL '6 minutes',    '{"storefront_url":"https://techcorp-merch.myshopify.com"}'),
  ('demo_viewed',                'demo_viewed',                'techcorp.io', 'sess-v2-02', NOW() - INTERVAL '115 hours',                           '{"demo_variant":"A","duration_seconds":98}'),
  ('pilot_cta_clicked',          'pilot_cta_clicked',          'techcorp.io', 'sess-v2-02', NOW() - INTERVAL '110 hours',                           '{"cta_location":"pricing_section","plan":"growth"}');

-- ── buildfast.co — sess-v2-03: through storefront_generated + demo, ~80h ago ──

INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('domain_submitted',           'domain_submitted',           'buildfast.co', 'sess-v2-03', NOW() - INTERVAL '80 hours',                           '{"source":"email_campaign","ab_variant":"C"}'),
  ('brand_extraction_started',   'brand_extraction_started',   'buildfast.co', 'sess-v2-03', NOW() - INTERVAL '80 hours' + INTERVAL '22 seconds',   '{"trigger":"auto"}'),
  ('brand_extraction_completed', 'brand_extraction_completed', 'buildfast.co', 'sess-v2-03', NOW() - INTERVAL '80 hours' + INTERVAL '75 seconds',   '{"fidelity_score":88.7,"colors_found":4,"logo_found":true}'),
  ('storefront_generated',       'storefront_generated',       'buildfast.co', 'sess-v2-03', NOW() - INTERVAL '80 hours' + INTERVAL '3 minutes 30 seconds', '{"product_count":5,"template":"bold"}'),
  ('demo_viewed',                'demo_viewed',                'buildfast.co', 'sess-v2-03', NOW() - INTERVAL '75 hours',                           '{"demo_variant":"B","duration_seconds":67}');

-- ── startupco.io — sess-v2-04: through brand_extraction_completed, ~50h ago ───

INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('domain_submitted',           'domain_submitted',           'startupco.io', 'sess-v2-04', NOW() - INTERVAL '50 hours',                           '{"source":"direct","ab_variant":"A"}'),
  ('brand_extraction_started',   'brand_extraction_started',   'startupco.io', 'sess-v2-04', NOW() - INTERVAL '50 hours' + INTERVAL '30 seconds',   '{"trigger":"auto"}'),
  ('brand_extraction_completed', 'brand_extraction_completed', 'startupco.io', 'sess-v2-04', NOW() - INTERVAL '50 hours' + INTERVAL '85 seconds',   '{"fidelity_score":78.3,"colors_found":2,"logo_found":false}');

-- ── launchpad.co — sess-v2-05: failed extraction, ~20h ago ───────────────────

INSERT INTO analytics_events (event_name, event_type, domain, session_id, created_at, metadata) VALUES
  ('domain_submitted',         'domain_submitted',         'launchpad.co', 'sess-v2-05', NOW() - INTERVAL '20 hours',                             '{"source":"landing_page","ab_variant":"B"}'),
  ('brand_extraction_started', 'brand_extraction_started', 'launchpad.co', 'sess-v2-05', NOW() - INTERVAL '20 hours' + INTERVAL '31 seconds',     '{"trigger":"auto","error":"brandfetch_timeout"}');

-- Verification query (run after seed to confirm counts):
-- SELECT event_name, COUNT(*) FROM analytics_events GROUP BY event_name ORDER BY event_name;
-- Expected:
--   brand_extraction_completed (4)
--   brand_extraction_started   (5)
--   demo_viewed                (3)
--   domain_submitted           (5)
--   email_opened               (1)
--   pilot_cta_clicked          (2)
--   storefront_generated       (3)
--   storefront_published       (2)
--   TOTAL                     (25)
