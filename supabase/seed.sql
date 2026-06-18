-- Seed: analytics_events test data
-- 5 complete pipeline flows (domain_submitted → storefront_created)
-- 5 partial pipeline flows (domain_submitted → brand_extracted or products_failed)
-- Total: 20 rows

TRUNCATE TABLE analytics_events RESTART IDENTITY;

-- ── Complete flow 1: stripe.com ────────────────────────────────────────────
INSERT INTO analytics_events (event_name, domain, session_id, timestamp, fidelity_score, product_count, storefront_url, error_message, created_at) VALUES
  ('domain_submitted',   'stripe.com', 'sess-c1a0001', NOW() - INTERVAL '6 days',    NULL,  NULL, NULL,                                       NULL, NOW() - INTERVAL '6 days'),
  ('storefront_created', 'stripe.com', 'sess-c1a0001', NOW() - INTERVAL '6 days' + INTERVAL '8 minutes', 94.50, 6, 'https://stripe-merch.myshopify.com', NULL, NOW() - INTERVAL '6 days' + INTERVAL '8 minutes');

-- ── Complete flow 2: notion.so ─────────────────────────────────────────────
INSERT INTO analytics_events (event_name, domain, session_id, timestamp, fidelity_score, product_count, storefront_url, error_message, created_at) VALUES
  ('domain_submitted',   'notion.so', 'sess-c2b0002', NOW() - INTERVAL '5 days',    NULL,  NULL, NULL,                                     NULL, NOW() - INTERVAL '5 days'),
  ('storefront_created', 'notion.so', 'sess-c2b0002', NOW() - INTERVAL '5 days' + INTERVAL '7 minutes', 88.20, 5, 'https://notion-store.myshopify.com', NULL, NOW() - INTERVAL '5 days' + INTERVAL '7 minutes');

-- ── Complete flow 3: figma.com ─────────────────────────────────────────────
INSERT INTO analytics_events (event_name, domain, session_id, timestamp, fidelity_score, product_count, storefront_url, error_message, created_at) VALUES
  ('domain_submitted',   'figma.com', 'sess-c3c0003', NOW() - INTERVAL '4 days',    NULL,  NULL, NULL,                                    NULL, NOW() - INTERVAL '4 days'),
  ('storefront_created', 'figma.com', 'sess-c3c0003', NOW() - INTERVAL '4 days' + INTERVAL '9 minutes', 96.10, 8, 'https://figma-swag.myshopify.com', NULL, NOW() - INTERVAL '4 days' + INTERVAL '9 minutes');

-- ── Complete flow 4: linear.app ────────────────────────────────────────────
INSERT INTO analytics_events (event_name, domain, session_id, timestamp, fidelity_score, product_count, storefront_url, error_message, created_at) VALUES
  ('domain_submitted',   'linear.app', 'sess-c4d0004', NOW() - INTERVAL '3 days',    NULL,  NULL, NULL,                                     NULL, NOW() - INTERVAL '3 days'),
  ('storefront_created', 'linear.app', 'sess-c4d0004', NOW() - INTERVAL '3 days' + INTERVAL '6 minutes', 91.75, 6, 'https://linear-merch.myshopify.com', NULL, NOW() - INTERVAL '3 days' + INTERVAL '6 minutes');

-- ── Complete flow 5: vercel.com ────────────────────────────────────────────
INSERT INTO analytics_events (event_name, domain, session_id, timestamp, fidelity_score, product_count, storefront_url, error_message, created_at) VALUES
  ('domain_submitted',   'vercel.com', 'sess-c5e0005', NOW() - INTERVAL '2 days',    NULL,  NULL, NULL,                                     NULL, NOW() - INTERVAL '2 days'),
  ('storefront_created', 'vercel.com', 'sess-c5e0005', NOW() - INTERVAL '2 days' + INTERVAL '10 minutes', 89.30, 7, 'https://vercel-store.myshopify.com', NULL, NOW() - INTERVAL '2 days' + INTERVAL '10 minutes');

-- ── Partial flow 6: loom.com — brand extraction only (no products) ─────────
INSERT INTO analytics_events (event_name, domain, session_id, timestamp, fidelity_score, product_count, storefront_url, error_message, created_at) VALUES
  ('domain_submitted',  'loom.com', 'sess-p6f0006', NOW() - INTERVAL '7 days',    NULL, NULL, NULL, NULL, NOW() - INTERVAL '7 days'),
  ('brand_extracted',   'loom.com', 'sess-p6f0006', NOW() - INTERVAL '7 days' + INTERVAL '2 minutes', 82.40, NULL, NULL, NULL, NOW() - INTERVAL '7 days' + INTERVAL '2 minutes');

-- ── Partial flow 7: retool.com — products failed ───────────────────────────
INSERT INTO analytics_events (event_name, domain, session_id, timestamp, fidelity_score, product_count, storefront_url, error_message, created_at) VALUES
  ('domain_submitted',  'retool.com', 'sess-p7g0007', NOW() - INTERVAL '6 days' - INTERVAL '12 hours', NULL, NULL, NULL, NULL, NOW() - INTERVAL '6 days' - INTERVAL '12 hours'),
  ('products_failed',   'retool.com', 'sess-p7g0007', NOW() - INTERVAL '6 days' - INTERVAL '12 hours' + INTERVAL '3 minutes', 77.60, NULL, NULL, 'Printify template not found for brand palette', NOW() - INTERVAL '6 days' - INTERVAL '12 hours' + INTERVAL '3 minutes');

-- ── Partial flow 8: pitch.com — brand extraction only ─────────────────────
INSERT INTO analytics_events (event_name, domain, session_id, timestamp, fidelity_score, product_count, storefront_url, error_message, created_at) VALUES
  ('domain_submitted',  'pitch.com', 'sess-p8h0008', NOW() - INTERVAL '4 days' - INTERVAL '6 hours', NULL, NULL, NULL, NULL, NOW() - INTERVAL '4 days' - INTERVAL '6 hours'),
  ('brand_extracted',   'pitch.com', 'sess-p8h0008', NOW() - INTERVAL '4 days' - INTERVAL '6 hours' + INTERVAL '2 minutes', 68.90, NULL, NULL, NULL, NOW() - INTERVAL '4 days' - INTERVAL '6 hours' + INTERVAL '2 minutes');

-- ── Partial flow 9: intercom.com — Shopify publish failed ─────────────────
INSERT INTO analytics_events (event_name, domain, session_id, timestamp, fidelity_score, product_count, storefront_url, error_message, created_at) VALUES
  ('domain_submitted',    'intercom.com', 'sess-p9i0009', NOW() - INTERVAL '3 days' - INTERVAL '3 hours', NULL, NULL, NULL, NULL, NOW() - INTERVAL '3 days' - INTERVAL '3 hours'),
  ('storefront_failed',   'intercom.com', 'sess-p9i0009', NOW() - INTERVAL '3 days' - INTERVAL '3 hours' + INTERVAL '5 minutes', 85.00, 4, NULL, 'Shopify publish quota exceeded', NOW() - INTERVAL '3 days' - INTERVAL '3 hours' + INTERVAL '5 minutes');

-- ── Partial flow 10: miro.com — dropped after domain submit ───────────────
INSERT INTO analytics_events (event_name, domain, session_id, timestamp, fidelity_score, product_count, storefront_url, error_message, created_at) VALUES
  ('domain_submitted',  'miro.com', 'sess-p10j0010', NOW() - INTERVAL '1 day',    NULL, NULL, NULL, NULL, NOW() - INTERVAL '1 day'),
  ('brand_extract_failed', 'miro.com', 'sess-p10j0010', NOW() - INTERVAL '1 day' + INTERVAL '1 minute', NULL, NULL, NULL, 'Brandfetch returned no assets for domain', NOW() - INTERVAL '1 day' + INTERVAL '1 minute');
