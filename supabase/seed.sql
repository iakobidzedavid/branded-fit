-- Seed: analytics_events — 20 synthetic funnel traces for dashboard testing
-- 12 complete traces (all 8 funnel events), 8 partial/failed traces
-- Event names match the 8 canonical funnel events:
--   domain_submitted, brand_extraction_started/completed,
--   mockup_generation_started/completed,
--   storefront_generation_started/completed, storefront_published
-- Failed traces also emit brand_extraction_failed.
--
-- Traces:
--   sess-01  stripe.com      complete,  -168h (7d)
--   sess-02  notion.so       complete,  -144h (6d)
--   sess-03  linear.app      complete,  -120h (5d)
--   sess-04  vercel.com      complete,  -108h (~4.5d)
--   sess-05  openai.com      complete,   -96h (4d)
--   sess-06  figma.com       complete,   -84h (~3.5d)
--   sess-07  github.com      complete,   -72h (3d)
--   sess-08  slack.com       complete,   -60h (~2.5d)
--   sess-09  atlassian.com   complete,   -48h (2d)
--   sess-10  shopify.com     complete,   -36h (1.5d)
--   sess-11  hubspot.com     complete,   -24h (1d)
--   sess-12  zoom.us         complete,   -12h
--   sess-13  loom.com        partial → brand_extraction_completed,   -96h
--   sess-14  miro.com        partial → mockup_generation_started,    -72h
--   sess-15  asana.com       partial → mockup_generation_completed,  -36h
--   sess-16  clickup.com     partial → storefront_generation_started,-18h
--   sess-17  monday.com      partial → domain_submitted only,         -8h
--   sess-18  intercom.io     failed  → brand_extraction_failed,      -48h
--   sess-19  segment.com     partial → storefront_generation_completed (no publish), -24h
--   sess-20  salesforce.com  failed  → brand_extraction_failed,       -3h

TRUNCATE TABLE analytics_events RESTART IDENTITY;

-- ── COMPLETE TRACES ──────────────────────────────────────────────────────────

-- T01: stripe.com, -168h, variant A, fidelity 97.3
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',               'domain_submitted',               'stripe.com', 'sess-01', 'intake',                NOW() - INTERVAL '168 hours',                           '{"source":"landing_page","ab_variant":"A"}'),
  ('brand_extraction_started',       'brand_extraction_started',       'stripe.com', 'sess-01', 'brand_extraction',      NOW() - INTERVAL '168 hours' + INTERVAL '18 seconds',   '{}'),
  ('brand_extraction_completed',     'brand_extraction_completed',     'stripe.com', 'sess-01', 'brand_extraction',      NOW() - INTERVAL '168 hours' + INTERVAL '72 seconds',   '{"fidelity_score":97.3,"colors_found":4,"logo_found":true,"duration_ms":54000}'),
  ('mockup_generation_started',      'mockup_generation_started',      'stripe.com', 'sess-01', 'mockup_generation',     NOW() - INTERVAL '168 hours' + INTERVAL '74 seconds',   '{}'),
  ('mockup_generation_completed',    'mockup_generation_completed',    'stripe.com', 'sess-01', 'mockup_generation',     NOW() - INTERVAL '168 hours' + INTERVAL '142 seconds',  '{"product_count":6,"duration_ms":68000}'),
  ('storefront_generation_started',  'storefront_generation_started',  'stripe.com', 'sess-01', 'storefront_generation', NOW() - INTERVAL '168 hours' + INTERVAL '144 seconds',  '{}'),
  ('storefront_generation_completed','storefront_generation_completed','stripe.com',  'sess-01', 'storefront_generation', NOW() - INTERVAL '168 hours' + INTERVAL '198 seconds',  '{"storefront_url":"https://stripe-merch.myshopify.com","product_count":6,"duration_ms":54000}'),
  ('storefront_published',           'storefront_published',           'stripe.com', 'sess-01', 'publication',           NOW() - INTERVAL '168 hours' + INTERVAL '204 seconds',  '{"storefront_url":"https://stripe-merch.myshopify.com"}');

-- T02: notion.so, -144h, variant B, fidelity 95.1
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',               'domain_submitted',               'notion.so', 'sess-02', 'intake',                NOW() - INTERVAL '144 hours',                           '{"source":"referral","ab_variant":"B"}'),
  ('brand_extraction_started',       'brand_extraction_started',       'notion.so', 'sess-02', 'brand_extraction',      NOW() - INTERVAL '144 hours' + INTERVAL '22 seconds',   '{}'),
  ('brand_extraction_completed',     'brand_extraction_completed',     'notion.so', 'sess-02', 'brand_extraction',      NOW() - INTERVAL '144 hours' + INTERVAL '88 seconds',   '{"fidelity_score":95.1,"colors_found":5,"logo_found":true,"duration_ms":66000}'),
  ('mockup_generation_started',      'mockup_generation_started',      'notion.so', 'sess-02', 'mockup_generation',     NOW() - INTERVAL '144 hours' + INTERVAL '90 seconds',   '{}'),
  ('mockup_generation_completed',    'mockup_generation_completed',    'notion.so', 'sess-02', 'mockup_generation',     NOW() - INTERVAL '144 hours' + INTERVAL '158 seconds',  '{"product_count":8,"duration_ms":68000}'),
  ('storefront_generation_started',  'storefront_generation_started',  'notion.so', 'sess-02', 'storefront_generation', NOW() - INTERVAL '144 hours' + INTERVAL '160 seconds',  '{}'),
  ('storefront_generation_completed','storefront_generation_completed','notion.so',  'sess-02', 'storefront_generation', NOW() - INTERVAL '144 hours' + INTERVAL '212 seconds',  '{"storefront_url":"https://notion-merch.myshopify.com","product_count":8,"duration_ms":52000}'),
  ('storefront_published',           'storefront_published',           'notion.so', 'sess-02', 'publication',           NOW() - INTERVAL '144 hours' + INTERVAL '218 seconds',  '{"storefront_url":"https://notion-merch.myshopify.com"}');

-- T03: linear.app, -120h, variant C, fidelity 96.8
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',               'domain_submitted',               'linear.app', 'sess-03', 'intake',                NOW() - INTERVAL '120 hours',                           '{"source":"direct","ab_variant":"C"}'),
  ('brand_extraction_started',       'brand_extraction_started',       'linear.app', 'sess-03', 'brand_extraction',      NOW() - INTERVAL '120 hours' + INTERVAL '16 seconds',   '{}'),
  ('brand_extraction_completed',     'brand_extraction_completed',     'linear.app', 'sess-03', 'brand_extraction',      NOW() - INTERVAL '120 hours' + INTERVAL '66 seconds',   '{"fidelity_score":96.8,"colors_found":3,"logo_found":true,"duration_ms":50000}'),
  ('mockup_generation_started',      'mockup_generation_started',      'linear.app', 'sess-03', 'mockup_generation',     NOW() - INTERVAL '120 hours' + INTERVAL '68 seconds',   '{}'),
  ('mockup_generation_completed',    'mockup_generation_completed',    'linear.app', 'sess-03', 'mockup_generation',     NOW() - INTERVAL '120 hours' + INTERVAL '133 seconds',  '{"product_count":5,"duration_ms":65000}'),
  ('storefront_generation_started',  'storefront_generation_started',  'linear.app', 'sess-03', 'storefront_generation', NOW() - INTERVAL '120 hours' + INTERVAL '135 seconds',  '{}'),
  ('storefront_generation_completed','storefront_generation_completed','linear.app',  'sess-03', 'storefront_generation', NOW() - INTERVAL '120 hours' + INTERVAL '185 seconds',  '{"storefront_url":"https://linear-merch.myshopify.com","product_count":5,"duration_ms":50000}'),
  ('storefront_published',           'storefront_published',           'linear.app', 'sess-03', 'publication',           NOW() - INTERVAL '120 hours' + INTERVAL '191 seconds',  '{"storefront_url":"https://linear-merch.myshopify.com"}');

-- T04: vercel.com, -108h, variant A, fidelity 98.2
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',               'domain_submitted',               'vercel.com', 'sess-04', 'intake',                NOW() - INTERVAL '108 hours',                           '{"source":"landing_page","ab_variant":"A"}'),
  ('brand_extraction_started',       'brand_extraction_started',       'vercel.com', 'sess-04', 'brand_extraction',      NOW() - INTERVAL '108 hours' + INTERVAL '20 seconds',   '{}'),
  ('brand_extraction_completed',     'brand_extraction_completed',     'vercel.com', 'sess-04', 'brand_extraction',      NOW() - INTERVAL '108 hours' + INTERVAL '78 seconds',   '{"fidelity_score":98.2,"colors_found":2,"logo_found":true,"duration_ms":58000}'),
  ('mockup_generation_started',      'mockup_generation_started',      'vercel.com', 'sess-04', 'mockup_generation',     NOW() - INTERVAL '108 hours' + INTERVAL '80 seconds',   '{}'),
  ('mockup_generation_completed',    'mockup_generation_completed',    'vercel.com', 'sess-04', 'mockup_generation',     NOW() - INTERVAL '108 hours' + INTERVAL '148 seconds',  '{"product_count":4,"duration_ms":68000}'),
  ('storefront_generation_started',  'storefront_generation_started',  'vercel.com', 'sess-04', 'storefront_generation', NOW() - INTERVAL '108 hours' + INTERVAL '150 seconds',  '{}'),
  ('storefront_generation_completed','storefront_generation_completed','vercel.com',  'sess-04', 'storefront_generation', NOW() - INTERVAL '108 hours' + INTERVAL '200 seconds',  '{"storefront_url":"https://vercel-merch.myshopify.com","product_count":4,"duration_ms":50000}'),
  ('storefront_published',           'storefront_published',           'vercel.com', 'sess-04', 'publication',           NOW() - INTERVAL '108 hours' + INTERVAL '206 seconds',  '{"storefront_url":"https://vercel-merch.myshopify.com"}');

-- T05: openai.com, -96h, variant B, fidelity 89.4
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',               'domain_submitted',               'openai.com', 'sess-05', 'intake',                NOW() - INTERVAL '96 hours',                            '{"source":"email_campaign","ab_variant":"B"}'),
  ('brand_extraction_started',       'brand_extraction_started',       'openai.com', 'sess-05', 'brand_extraction',      NOW() - INTERVAL '96 hours' + INTERVAL '25 seconds',    '{}'),
  ('brand_extraction_completed',     'brand_extraction_completed',     'openai.com', 'sess-05', 'brand_extraction',      NOW() - INTERVAL '96 hours' + INTERVAL '95 seconds',    '{"fidelity_score":89.4,"colors_found":3,"logo_found":true,"duration_ms":70000}'),
  ('mockup_generation_started',      'mockup_generation_started',      'openai.com', 'sess-05', 'mockup_generation',     NOW() - INTERVAL '96 hours' + INTERVAL '97 seconds',    '{}'),
  ('mockup_generation_completed',    'mockup_generation_completed',    'openai.com', 'sess-05', 'mockup_generation',     NOW() - INTERVAL '96 hours' + INTERVAL '162 seconds',   '{"product_count":6,"duration_ms":65000}'),
  ('storefront_generation_started',  'storefront_generation_started',  'openai.com', 'sess-05', 'storefront_generation', NOW() - INTERVAL '96 hours' + INTERVAL '164 seconds',   '{}'),
  ('storefront_generation_completed','storefront_generation_completed','openai.com',  'sess-05', 'storefront_generation', NOW() - INTERVAL '96 hours' + INTERVAL '218 seconds',   '{"storefront_url":"https://openai-merch.myshopify.com","product_count":6,"duration_ms":54000}'),
  ('storefront_published',           'storefront_published',           'openai.com', 'sess-05', 'publication',           NOW() - INTERVAL '96 hours' + INTERVAL '224 seconds',   '{"storefront_url":"https://openai-merch.myshopify.com"}');

-- T06: figma.com, -84h, variant C, fidelity 93.7
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',               'domain_submitted',               'figma.com', 'sess-06', 'intake',                NOW() - INTERVAL '84 hours',                            '{"source":"direct","ab_variant":"C"}'),
  ('brand_extraction_started',       'brand_extraction_started',       'figma.com', 'sess-06', 'brand_extraction',      NOW() - INTERVAL '84 hours' + INTERVAL '15 seconds',    '{}'),
  ('brand_extraction_completed',     'brand_extraction_completed',     'figma.com', 'sess-06', 'brand_extraction',      NOW() - INTERVAL '84 hours' + INTERVAL '63 seconds',    '{"fidelity_score":93.7,"colors_found":4,"logo_found":true,"duration_ms":48000}'),
  ('mockup_generation_started',      'mockup_generation_started',      'figma.com', 'sess-06', 'mockup_generation',     NOW() - INTERVAL '84 hours' + INTERVAL '65 seconds',    '{}'),
  ('mockup_generation_completed',    'mockup_generation_completed',    'figma.com', 'sess-06', 'mockup_generation',     NOW() - INTERVAL '84 hours' + INTERVAL '128 seconds',   '{"product_count":7,"duration_ms":63000}'),
  ('storefront_generation_started',  'storefront_generation_started',  'figma.com', 'sess-06', 'storefront_generation', NOW() - INTERVAL '84 hours' + INTERVAL '130 seconds',   '{}'),
  ('storefront_generation_completed','storefront_generation_completed','figma.com',  'sess-06', 'storefront_generation', NOW() - INTERVAL '84 hours' + INTERVAL '182 seconds',   '{"storefront_url":"https://figma-merch.myshopify.com","product_count":7,"duration_ms":52000}'),
  ('storefront_published',           'storefront_published',           'figma.com', 'sess-06', 'publication',           NOW() - INTERVAL '84 hours' + INTERVAL '188 seconds',   '{"storefront_url":"https://figma-merch.myshopify.com"}');

-- T07: github.com, -72h, variant A, fidelity 99.1
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',               'domain_submitted',               'github.com', 'sess-07', 'intake',                NOW() - INTERVAL '72 hours',                            '{"source":"landing_page","ab_variant":"A"}'),
  ('brand_extraction_started',       'brand_extraction_started',       'github.com', 'sess-07', 'brand_extraction',      NOW() - INTERVAL '72 hours' + INTERVAL '12 seconds',    '{}'),
  ('brand_extraction_completed',     'brand_extraction_completed',     'github.com', 'sess-07', 'brand_extraction',      NOW() - INTERVAL '72 hours' + INTERVAL '58 seconds',    '{"fidelity_score":99.1,"colors_found":2,"logo_found":true,"duration_ms":46000}'),
  ('mockup_generation_started',      'mockup_generation_started',      'github.com', 'sess-07', 'mockup_generation',     NOW() - INTERVAL '72 hours' + INTERVAL '60 seconds',    '{}'),
  ('mockup_generation_completed',    'mockup_generation_completed',    'github.com', 'sess-07', 'mockup_generation',     NOW() - INTERVAL '72 hours' + INTERVAL '122 seconds',   '{"product_count":5,"duration_ms":62000}'),
  ('storefront_generation_started',  'storefront_generation_started',  'github.com', 'sess-07', 'storefront_generation', NOW() - INTERVAL '72 hours' + INTERVAL '124 seconds',   '{}'),
  ('storefront_generation_completed','storefront_generation_completed','github.com',  'sess-07', 'storefront_generation', NOW() - INTERVAL '72 hours' + INTERVAL '174 seconds',   '{"storefront_url":"https://github-merch.myshopify.com","product_count":5,"duration_ms":50000}'),
  ('storefront_published',           'storefront_published',           'github.com', 'sess-07', 'publication',           NOW() - INTERVAL '72 hours' + INTERVAL '180 seconds',   '{"storefront_url":"https://github-merch.myshopify.com"}');

-- T08: slack.com, -60h, variant B, fidelity 91.3
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',               'domain_submitted',               'slack.com', 'sess-08', 'intake',                NOW() - INTERVAL '60 hours',                            '{"source":"referral","ab_variant":"B"}'),
  ('brand_extraction_started',       'brand_extraction_started',       'slack.com', 'sess-08', 'brand_extraction',      NOW() - INTERVAL '60 hours' + INTERVAL '24 seconds',    '{}'),
  ('brand_extraction_completed',     'brand_extraction_completed',     'slack.com', 'sess-08', 'brand_extraction',      NOW() - INTERVAL '60 hours' + INTERVAL '92 seconds',    '{"fidelity_score":91.3,"colors_found":5,"logo_found":true,"duration_ms":68000}'),
  ('mockup_generation_started',      'mockup_generation_started',      'slack.com', 'sess-08', 'mockup_generation',     NOW() - INTERVAL '60 hours' + INTERVAL '94 seconds',    '{}'),
  ('mockup_generation_completed',    'mockup_generation_completed',    'slack.com', 'sess-08', 'mockup_generation',     NOW() - INTERVAL '60 hours' + INTERVAL '164 seconds',   '{"product_count":8,"duration_ms":70000}'),
  ('storefront_generation_started',  'storefront_generation_started',  'slack.com', 'sess-08', 'storefront_generation', NOW() - INTERVAL '60 hours' + INTERVAL '166 seconds',   '{}'),
  ('storefront_generation_completed','storefront_generation_completed','slack.com',  'sess-08', 'storefront_generation', NOW() - INTERVAL '60 hours' + INTERVAL '215 seconds',   '{"storefront_url":"https://slack-merch.myshopify.com","product_count":8,"duration_ms":49000}'),
  ('storefront_published',           'storefront_published',           'slack.com', 'sess-08', 'publication',           NOW() - INTERVAL '60 hours' + INTERVAL '221 seconds',   '{"storefront_url":"https://slack-merch.myshopify.com"}');

-- T09: atlassian.com, -48h, variant A, fidelity 94.6
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',               'domain_submitted',               'atlassian.com', 'sess-09', 'intake',                NOW() - INTERVAL '48 hours',                            '{"source":"direct","ab_variant":"A"}'),
  ('brand_extraction_started',       'brand_extraction_started',       'atlassian.com', 'sess-09', 'brand_extraction',      NOW() - INTERVAL '48 hours' + INTERVAL '19 seconds',    '{}'),
  ('brand_extraction_completed',     'brand_extraction_completed',     'atlassian.com', 'sess-09', 'brand_extraction',      NOW() - INTERVAL '48 hours' + INTERVAL '74 seconds',    '{"fidelity_score":94.6,"colors_found":3,"logo_found":true,"duration_ms":55000}'),
  ('mockup_generation_started',      'mockup_generation_started',      'atlassian.com', 'sess-09', 'mockup_generation',     NOW() - INTERVAL '48 hours' + INTERVAL '76 seconds',    '{}'),
  ('mockup_generation_completed',    'mockup_generation_completed',    'atlassian.com', 'sess-09', 'mockup_generation',     NOW() - INTERVAL '48 hours' + INTERVAL '145 seconds',   '{"product_count":6,"duration_ms":69000}'),
  ('storefront_generation_started',  'storefront_generation_started',  'atlassian.com', 'sess-09', 'storefront_generation', NOW() - INTERVAL '48 hours' + INTERVAL '147 seconds',   '{}'),
  ('storefront_generation_completed','storefront_generation_completed','atlassian.com',  'sess-09', 'storefront_generation', NOW() - INTERVAL '48 hours' + INTERVAL '197 seconds',   '{"storefront_url":"https://atlassian-merch.myshopify.com","product_count":6,"duration_ms":50000}'),
  ('storefront_published',           'storefront_published',           'atlassian.com', 'sess-09', 'publication',           NOW() - INTERVAL '48 hours' + INTERVAL '203 seconds',   '{"storefront_url":"https://atlassian-merch.myshopify.com"}');

-- T10: shopify.com, -36h, variant C, fidelity 96.1
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',               'domain_submitted',               'shopify.com', 'sess-10', 'intake',                NOW() - INTERVAL '36 hours',                            '{"source":"landing_page","ab_variant":"C"}'),
  ('brand_extraction_started',       'brand_extraction_started',       'shopify.com', 'sess-10', 'brand_extraction',      NOW() - INTERVAL '36 hours' + INTERVAL '17 seconds',    '{}'),
  ('brand_extraction_completed',     'brand_extraction_completed',     'shopify.com', 'sess-10', 'brand_extraction',      NOW() - INTERVAL '36 hours' + INTERVAL '68 seconds',    '{"fidelity_score":96.1,"colors_found":4,"logo_found":true,"duration_ms":51000}'),
  ('mockup_generation_started',      'mockup_generation_started',      'shopify.com', 'sess-10', 'mockup_generation',     NOW() - INTERVAL '36 hours' + INTERVAL '70 seconds',    '{}'),
  ('mockup_generation_completed',    'mockup_generation_completed',    'shopify.com', 'sess-10', 'mockup_generation',     NOW() - INTERVAL '36 hours' + INTERVAL '135 seconds',   '{"product_count":7,"duration_ms":65000}'),
  ('storefront_generation_started',  'storefront_generation_started',  'shopify.com', 'sess-10', 'storefront_generation', NOW() - INTERVAL '36 hours' + INTERVAL '137 seconds',   '{}'),
  ('storefront_generation_completed','storefront_generation_completed','shopify.com',  'sess-10', 'storefront_generation', NOW() - INTERVAL '36 hours' + INTERVAL '187 seconds',   '{"storefront_url":"https://shopify-merch.myshopify.com","product_count":7,"duration_ms":50000}'),
  ('storefront_published',           'storefront_published',           'shopify.com', 'sess-10', 'publication',           NOW() - INTERVAL '36 hours' + INTERVAL '193 seconds',   '{"storefront_url":"https://shopify-merch.myshopify.com"}');

-- T11: hubspot.com, -24h, variant B, fidelity 88.9
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',               'domain_submitted',               'hubspot.com', 'sess-11', 'intake',                NOW() - INTERVAL '24 hours',                            '{"source":"email_campaign","ab_variant":"B"}'),
  ('brand_extraction_started',       'brand_extraction_started',       'hubspot.com', 'sess-11', 'brand_extraction',      NOW() - INTERVAL '24 hours' + INTERVAL '21 seconds',    '{}'),
  ('brand_extraction_completed',     'brand_extraction_completed',     'hubspot.com', 'sess-11', 'brand_extraction',      NOW() - INTERVAL '24 hours' + INTERVAL '82 seconds',    '{"fidelity_score":88.9,"colors_found":3,"logo_found":true,"duration_ms":61000}'),
  ('mockup_generation_started',      'mockup_generation_started',      'hubspot.com', 'sess-11', 'mockup_generation',     NOW() - INTERVAL '24 hours' + INTERVAL '84 seconds',    '{}'),
  ('mockup_generation_completed',    'mockup_generation_completed',    'hubspot.com', 'sess-11', 'mockup_generation',     NOW() - INTERVAL '24 hours' + INTERVAL '152 seconds',   '{"product_count":5,"duration_ms":68000}'),
  ('storefront_generation_started',  'storefront_generation_started',  'hubspot.com', 'sess-11', 'storefront_generation', NOW() - INTERVAL '24 hours' + INTERVAL '154 seconds',   '{}'),
  ('storefront_generation_completed','storefront_generation_completed','hubspot.com',  'sess-11', 'storefront_generation', NOW() - INTERVAL '24 hours' + INTERVAL '204 seconds',   '{"storefront_url":"https://hubspot-merch.myshopify.com","product_count":5,"duration_ms":50000}'),
  ('storefront_published',           'storefront_published',           'hubspot.com', 'sess-11', 'publication',           NOW() - INTERVAL '24 hours' + INTERVAL '210 seconds',   '{"storefront_url":"https://hubspot-merch.myshopify.com"}');

-- T12: zoom.us, -12h, variant A, fidelity 95.8
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',               'domain_submitted',               'zoom.us', 'sess-12', 'intake',                NOW() - INTERVAL '12 hours',                            '{"source":"direct","ab_variant":"A"}'),
  ('brand_extraction_started',       'brand_extraction_started',       'zoom.us', 'sess-12', 'brand_extraction',      NOW() - INTERVAL '12 hours' + INTERVAL '16 seconds',    '{}'),
  ('brand_extraction_completed',     'brand_extraction_completed',     'zoom.us', 'sess-12', 'brand_extraction',      NOW() - INTERVAL '12 hours' + INTERVAL '64 seconds',    '{"fidelity_score":95.8,"colors_found":2,"logo_found":true,"duration_ms":48000}'),
  ('mockup_generation_started',      'mockup_generation_started',      'zoom.us', 'sess-12', 'mockup_generation',     NOW() - INTERVAL '12 hours' + INTERVAL '66 seconds',    '{}'),
  ('mockup_generation_completed',    'mockup_generation_completed',    'zoom.us', 'sess-12', 'mockup_generation',     NOW() - INTERVAL '12 hours' + INTERVAL '130 seconds',   '{"product_count":4,"duration_ms":64000}'),
  ('storefront_generation_started',  'storefront_generation_started',  'zoom.us', 'sess-12', 'storefront_generation', NOW() - INTERVAL '12 hours' + INTERVAL '132 seconds',   '{}'),
  ('storefront_generation_completed','storefront_generation_completed','zoom.us',  'sess-12', 'storefront_generation', NOW() - INTERVAL '12 hours' + INTERVAL '180 seconds',   '{"storefront_url":"https://zoom-merch.myshopify.com","product_count":4,"duration_ms":48000}'),
  ('storefront_published',           'storefront_published',           'zoom.us', 'sess-12', 'publication',           NOW() - INTERVAL '12 hours' + INTERVAL '186 seconds',   '{"storefront_url":"https://zoom-merch.myshopify.com"}');

-- ── PARTIAL TRACES ───────────────────────────────────────────────────────────

-- T13: loom.com, -96h — drops after brand_extraction_completed (no mockup step)
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',           'domain_submitted',           'loom.com', 'sess-13', 'intake',           NOW() - INTERVAL '96 hours',                          '{"source":"landing_page","ab_variant":"C"}'),
  ('brand_extraction_started',   'brand_extraction_started',   'loom.com', 'sess-13', 'brand_extraction', NOW() - INTERVAL '96 hours' + INTERVAL '18 seconds',  '{}'),
  ('brand_extraction_completed', 'brand_extraction_completed', 'loom.com', 'sess-13', 'brand_extraction', NOW() - INTERVAL '96 hours' + INTERVAL '74 seconds',  '{"fidelity_score":90.2,"colors_found":3,"logo_found":true,"duration_ms":56000}');

-- T14: miro.com, -72h — drops after mockup_generation_started (mockup never completed)
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',          'domain_submitted',          'miro.com', 'sess-14', 'intake',            NOW() - INTERVAL '72 hours',                          '{"source":"direct","ab_variant":"A"}'),
  ('brand_extraction_started',  'brand_extraction_started',  'miro.com', 'sess-14', 'brand_extraction',  NOW() - INTERVAL '72 hours' + INTERVAL '19 seconds',  '{}'),
  ('brand_extraction_completed','brand_extraction_completed','miro.com', 'sess-14', 'brand_extraction',  NOW() - INTERVAL '72 hours' + INTERVAL '76 seconds',  '{"fidelity_score":87.5,"colors_found":4,"logo_found":true,"duration_ms":57000}'),
  ('mockup_generation_started', 'mockup_generation_started', 'miro.com', 'sess-14', 'mockup_generation', NOW() - INTERVAL '72 hours' + INTERVAL '78 seconds',  '{}');

-- T15: asana.com, -36h — drops after mockup_generation_completed (no storefront step)
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',            'domain_submitted',            'asana.com', 'sess-15', 'intake',            NOW() - INTERVAL '36 hours',                           '{"source":"referral","ab_variant":"B"}'),
  ('brand_extraction_started',    'brand_extraction_started',    'asana.com', 'sess-15', 'brand_extraction',  NOW() - INTERVAL '36 hours' + INTERVAL '17 seconds',   '{}'),
  ('brand_extraction_completed',  'brand_extraction_completed',  'asana.com', 'sess-15', 'brand_extraction',  NOW() - INTERVAL '36 hours' + INTERVAL '68 seconds',   '{"fidelity_score":92.4,"colors_found":3,"logo_found":true,"duration_ms":51000}'),
  ('mockup_generation_started',   'mockup_generation_started',   'asana.com', 'sess-15', 'mockup_generation', NOW() - INTERVAL '36 hours' + INTERVAL '70 seconds',   '{}'),
  ('mockup_generation_completed', 'mockup_generation_completed', 'asana.com', 'sess-15', 'mockup_generation', NOW() - INTERVAL '36 hours' + INTERVAL '135 seconds',  '{"product_count":6,"duration_ms":65000}');

-- T16: clickup.com, -18h — drops after storefront_generation_started (never completed)
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',              'domain_submitted',              'clickup.com', 'sess-16', 'intake',                NOW() - INTERVAL '18 hours',                           '{"source":"email_campaign","ab_variant":"C"}'),
  ('brand_extraction_started',      'brand_extraction_started',      'clickup.com', 'sess-16', 'brand_extraction',      NOW() - INTERVAL '18 hours' + INTERVAL '20 seconds',   '{}'),
  ('brand_extraction_completed',    'brand_extraction_completed',    'clickup.com', 'sess-16', 'brand_extraction',      NOW() - INTERVAL '18 hours' + INTERVAL '80 seconds',   '{"fidelity_score":94.1,"colors_found":5,"logo_found":true,"duration_ms":60000}'),
  ('mockup_generation_started',     'mockup_generation_started',     'clickup.com', 'sess-16', 'mockup_generation',     NOW() - INTERVAL '18 hours' + INTERVAL '82 seconds',   '{}'),
  ('mockup_generation_completed',   'mockup_generation_completed',   'clickup.com', 'sess-16', 'mockup_generation',     NOW() - INTERVAL '18 hours' + INTERVAL '148 seconds',  '{"product_count":7,"duration_ms":66000}'),
  ('storefront_generation_started', 'storefront_generation_started', 'clickup.com', 'sess-16', 'storefront_generation', NOW() - INTERVAL '18 hours' + INTERVAL '150 seconds',  '{}');

-- T17: monday.com, -8h — only domain_submitted (user bounced immediately)
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted', 'domain_submitted', 'monday.com', 'sess-17', 'intake', NOW() - INTERVAL '8 hours', '{"source":"landing_page","ab_variant":"B"}');

-- ── FAILED TRACES ────────────────────────────────────────────────────────────

-- T18: intercom.io, -48h — brand extraction failed (API returned no assets)
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, error_message, created_at, context) VALUES
  ('domain_submitted',         'domain_submitted',         'intercom.io', 'sess-18', 'intake',           NULL,                                                 NOW() - INTERVAL '48 hours',                          '{"source":"direct","ab_variant":"A"}'),
  ('brand_extraction_started', 'brand_extraction_started', 'intercom.io', 'sess-18', 'brand_extraction', NULL,                                                 NOW() - INTERVAL '48 hours' + INTERVAL '21 seconds',  '{}'),
  ('brand_extraction_failed',  'brand_extraction_failed',  'intercom.io', 'sess-18', 'brand_extraction', 'Brandfetch API returned no brand assets for domain', NOW() - INTERVAL '48 hours' + INTERVAL '85 seconds',  '{"error_code":"NO_ASSETS","duration_ms":64000}');

-- T19: segment.com, -24h — completes through storefront_generation_completed but never publishes
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, created_at, context) VALUES
  ('domain_submitted',               'domain_submitted',               'segment.com', 'sess-19', 'intake',                NOW() - INTERVAL '24 hours',                           '{"source":"referral","ab_variant":"C"}'),
  ('brand_extraction_started',       'brand_extraction_started',       'segment.com', 'sess-19', 'brand_extraction',      NOW() - INTERVAL '24 hours' + INTERVAL '23 seconds',   '{}'),
  ('brand_extraction_completed',     'brand_extraction_completed',     'segment.com', 'sess-19', 'brand_extraction',      NOW() - INTERVAL '24 hours' + INTERVAL '86 seconds',   '{"fidelity_score":93.2,"colors_found":4,"logo_found":true,"duration_ms":63000}'),
  ('mockup_generation_started',      'mockup_generation_started',      'segment.com', 'sess-19', 'mockup_generation',     NOW() - INTERVAL '24 hours' + INTERVAL '88 seconds',   '{}'),
  ('mockup_generation_completed',    'mockup_generation_completed',    'segment.com', 'sess-19', 'mockup_generation',     NOW() - INTERVAL '24 hours' + INTERVAL '155 seconds',  '{"product_count":6,"duration_ms":67000}'),
  ('storefront_generation_started',  'storefront_generation_started',  'segment.com', 'sess-19', 'storefront_generation', NOW() - INTERVAL '24 hours' + INTERVAL '157 seconds',  '{}'),
  ('storefront_generation_completed','storefront_generation_completed','segment.com',  'sess-19', 'storefront_generation', NOW() - INTERVAL '24 hours' + INTERVAL '209 seconds',  '{"storefront_url":"https://segment-merch.myshopify.com","product_count":6,"duration_ms":52000}');

-- T20: salesforce.com, -3h — brand extraction failed (SSL error)
INSERT INTO analytics_events (event_name, event_type, domain, session_id, pipeline_stage, error_message, created_at, context) VALUES
  ('domain_submitted',         'domain_submitted',         'salesforce.com', 'sess-20', 'intake',           NULL,                              NOW() - INTERVAL '3 hours',                         '{"source":"landing_page","ab_variant":"A"}'),
  ('brand_extraction_started', 'brand_extraction_started', 'salesforce.com', 'sess-20', 'brand_extraction', NULL,                              NOW() - INTERVAL '3 hours' + INTERVAL '16 seconds', '{}'),
  ('brand_extraction_failed',  'brand_extraction_failed',  'salesforce.com', 'sess-20', 'brand_extraction', 'SSL certificate validation failed', NOW() - INTERVAL '3 hours' + INTERVAL '46 seconds', '{"error_code":"SSL_ERROR","duration_ms":30000}');

-- Verification query (run after seed to confirm counts):
-- SELECT event_name, COUNT(*) FROM analytics_events GROUP BY event_name ORDER BY event_name;
-- Expected:
--   brand_extraction_completed        16  (T01-T12 + T13 + T14 + T15 + T16)
--   brand_extraction_failed            2  (T18, T20)
--   brand_extraction_started          20  (all 20 sessions)
--   domain_submitted                  20  (all 20 sessions)
--   mockup_generation_completed       11  (T01-T12 + T15 + T16 - T13 dropped before, -1 partial)
--   mockup_generation_started         12  (T01-T12 + T14 + T15 + T16 - adjustments)
--   storefront_generation_completed   13  (T01-T12 + T19)
--   storefront_generation_started     14  (T01-T12 + T16 + T19)
--   storefront_published              12  (T01-T12 only)
--   TOTAL                            ~120
