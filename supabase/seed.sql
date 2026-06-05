-- Seed: analytics_events test data
-- Event names MUST match the FUNNEL_STAGES array in /api/admin/analytics/route.ts:
--   domain_submitted, brand_extraction_complete, mockup_generation_complete,
--   storefront_generation_complete, user_clicks_publish
-- Events are spread across the last 7 days so the time-series chart shows variation.

TRUNCATE TABLE analytics_events RESTART IDENTITY;

-- ── Session 1: stripe.com — full pipeline, 6 days ago ─────────────────────
INSERT INTO analytics_events (event_name, domain, session_id, created_at) VALUES
  ('domain_submitted',              'stripe.com', 'sess-001', NOW() - INTERVAL '6 days'),
  ('brand_extraction_complete',     'stripe.com', 'sess-001', NOW() - INTERVAL '6 days' + INTERVAL '2 minutes'),
  ('mockup_generation_complete',    'stripe.com', 'sess-001', NOW() - INTERVAL '6 days' + INTERVAL '5 minutes'),
  ('storefront_generation_complete','stripe.com', 'sess-001', NOW() - INTERVAL '6 days' + INTERVAL '8 minutes'),
  ('user_clicks_publish',           'stripe.com', 'sess-001', NOW() - INTERVAL '6 days' + INTERVAL '10 minutes');

-- ── Session 2: notion.so — full pipeline, 4 days ago ──────────────────────
INSERT INTO analytics_events (event_name, domain, session_id, created_at) VALUES
  ('domain_submitted',              'notion.so', 'sess-002', NOW() - INTERVAL '4 days'),
  ('brand_extraction_complete',     'notion.so', 'sess-002', NOW() - INTERVAL '4 days' + INTERVAL '2 minutes'),
  ('mockup_generation_complete',    'notion.so', 'sess-002', NOW() - INTERVAL '4 days' + INTERVAL '5 minutes'),
  ('storefront_generation_complete','notion.so', 'sess-002', NOW() - INTERVAL '4 days' + INTERVAL '8 minutes'),
  ('user_clicks_publish',           'notion.so', 'sess-002', NOW() - INTERVAL '4 days' + INTERVAL '12 minutes');

-- ── Session 3: figma.com — full pipeline, 2 days ago ──────────────────────
INSERT INTO analytics_events (event_name, domain, session_id, created_at) VALUES
  ('domain_submitted',              'figma.com', 'sess-003', NOW() - INTERVAL '2 days'),
  ('brand_extraction_complete',     'figma.com', 'sess-003', NOW() - INTERVAL '2 days' + INTERVAL '2 minutes'),
  ('mockup_generation_complete',    'figma.com', 'sess-003', NOW() - INTERVAL '2 days' + INTERVAL '5 minutes'),
  ('storefront_generation_complete','figma.com', 'sess-003', NOW() - INTERVAL '2 days' + INTERVAL '9 minutes'),
  ('user_clicks_publish',           'figma.com', 'sess-003', NOW() - INTERVAL '2 days' + INTERVAL '11 minutes');

-- ── Session 4: linear.app — stopped at brand extraction, 5 days ago ───────
INSERT INTO analytics_events (event_name, domain, session_id, created_at) VALUES
  ('domain_submitted',          'linear.app', 'sess-004', NOW() - INTERVAL '5 days'),
  ('brand_extraction_complete', 'linear.app', 'sess-004', NOW() - INTERVAL '5 days' + INTERVAL '3 minutes');

-- ── Session 5: vercel.com — stopped at mockup, 3 days ago ─────────────────
INSERT INTO analytics_events (event_name, domain, session_id, created_at) VALUES
  ('domain_submitted',           'vercel.com', 'sess-005', NOW() - INTERVAL '3 days'),
  ('brand_extraction_complete',  'vercel.com', 'sess-005', NOW() - INTERVAL '3 days' + INTERVAL '2 minutes'),
  ('mockup_generation_complete', 'vercel.com', 'sess-005', NOW() - INTERVAL '3 days' + INTERVAL '6 minutes');

-- ── Session 6: loom.com — domain submitted only, 7 days ago ───────────────
INSERT INTO analytics_events (event_name, domain, session_id, created_at) VALUES
  ('domain_submitted', 'loom.com', 'sess-006', NOW() - INTERVAL '7 days');

-- ── Session 7: retool.com — full pipeline, today ──────────────────────────
INSERT INTO analytics_events (event_name, domain, session_id, created_at) VALUES
  ('domain_submitted',              'retool.com', 'sess-007', NOW() - INTERVAL '2 hours'),
  ('brand_extraction_complete',     'retool.com', 'sess-007', NOW() - INTERVAL '2 hours' + INTERVAL '2 minutes'),
  ('mockup_generation_complete',    'retool.com', 'sess-007', NOW() - INTERVAL '2 hours' + INTERVAL '5 minutes'),
  ('storefront_generation_complete','retool.com', 'sess-007', NOW() - INTERVAL '2 hours' + INTERVAL '8 minutes'),
  ('user_clicks_publish',           'retool.com', 'sess-007', NOW() - INTERVAL '2 hours' + INTERVAL '9 minutes');
