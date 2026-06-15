# Workspace for a1972e30-cf0f-4b49-aa43-cf18746a4013

## Company GitHub Repository
- **Repository:** https://github.com/iakobidzedavid/branded-fit
- **Owner/Repo:** iakobidzedavid/branded-fit
- **Branch:** main

This workspace is cloned from the company repository.

## Current Codebase Structure

The following is the ACTUAL file tree from the GitHub repository.
Use these exact paths when creating or modifying files.

```
branded-fit/
  .env.example
  .gitignore
  README.md
  TEST_GUIDE.md
  brandfetch-integration-test.ts
  brandfetch-validation-test.ts
  e2e-ui-test.js
  e2e-ui-test.ts
  next-env.d.ts
  next.config.ts
  package-lock.json
  package.json
  postcss.config.js
  printify-integration-test.ts
  tailwind.config.ts
  test-harness.js
  test-harness.ts
  tsconfig.json
  tsconfig.tsbuildinfo
  vercel.json
  .claude/
    CLAUDE.md
    blueprint.md
    settings.json
    agents/
  documents/
    .gitkeep
    2026-06-02_ab_testing_guide.md
    2026-06-02_analytics_implementation_guide.md
    2026-06-02_analytics_schema_migration.md
    2026-06-02_landing_page_implementation.md
    2026-06-02_pipeline_implementation.md
    2026-06-02_weekly_reporting_setup.md
    2026-06-03_api_shopify_task_completion.md
    2026-06-03_brandfetch_extraction_pipeline.md
    2026-06-03_brandfetch_implementation_guide.md
    2026-06-03_brandfetch_integration_test_report.md
    2026-06-03_brandfetch_task_completion_summary.md
    2026-06-03_e2e_test_report.md
    2026-06-03_end_to_end_test_report.md
    2026-06-03_orchestration_endpoint_implementation.md
    2026-06-03_printify_mockup_pipeline.md
    2026-06-03_printify_mockup_pipeline_report.md
    2026-06-03_product_upload_implementation.md
    2026-06-03_shopify_api_integration.md
    2026-06-03_shopify_endpoint_implementation.md
    2026-06-03_shopify_implementation_summary.md
    2026-06-03_task_completion_summary.md
    2026-06-04_orchestration_test_results.md
    2026-06-04_test-results.md
    2026-06-04_test_results.md
    2026-06-05_admin_analytics_verification.md
    2026-06-05_analytics_endpoint_test_guide.md
    2026-06-05_analytics_endpoint_test_results.md
    2026-06-05_analytics_timeseries_verification.md
    2026-06-05_deployment-log.md
    2026-06-05_test-results.md
    2026-06-08_analytics_dashboard_deployment_verification.md
    2026-06-08_analytics_dashboard_live_verification.md
    2026-06-08_analytics_endpoint_verification.md
    2026-06-08_analytics_seed_final_report.md
    2026-06-08_analytics_seed_report.md
    2026-06-08_analytics_seed_v2_report.md
    2026-06-08_analytics_step23_step24_instrumentation.md
    2026-06-08_e2e_funnel_test_report.md
    2026-06-08_entonomy_brand_audit.md
    2026-06-11_analytics_event_spec.md
    2026-06-14_auth_gate_seed_verification.md
    2026-06-14_deployment_verification.md
    2026-06-14_drift_resolution_verification_report.md
    2026-06-14_e2e_orchestration_test_report.md
    2026-06-14_smoke_test_production_command_console.md
    2026-06-14_vercel_env_vars_audit.md
    2026-06-15T07-35-47.184Z_01-initial-form.png
    2026-06-15T07-35-48.293Z_02-after-submission.png
    2026-06-15T07-35-49.378Z_03-final-state.png
    2026-06-15_command_console_e2e_test_index.md
    2026-06-15_command_console_e2e_test_report.md
    2026-06-15_deployment_failure_root_cause_analysis.md
    2026-06-15_deployment_root_cause_analysis.md
    2026-06-15_drift_remediation_verification_report.md
    2026-06-15_e2e_live_orchestration_test_report.md
    2026-06-15_mvbp_deployment_e2e_report.md
    2026-06-15_pipeline_fix_verification_report.md
    2026-06-15_vercel_deployment_verification.md
    DELIVERABLES_CHECKLIST.md
  public/
    mockups/
  src/
    app/
      globals.css
      layout.tsx
      page.tsx
      admin/
      analytics/
      analytics-setup/
      api/
      command-console/
      diagnostics/
      pilot-checkout/
      pricing/
      store/
      test-suite/
    components/
      AdminLogin.tsx
      EventSummaryCards.tsx
      EventTypeTable.tsx
      FunnelChart.tsx
      PipelineMetricsCards.tsx
      TimeSeriesChart.tsx
      TimeSeriesFilterPanel.tsx
    lib/
      analytics.ts
      database.types.ts
      mockup-generator.ts
      orchestration-state.ts
      shopify.test.ts
      shopify.ts
      stores.ts
      supabase.ts
  supabase/
    seed.sql
    .temp/
    migrations/
```

BEFORE writing any code, use Read and Glob tools to understand existing files.
Place new files in the correct directories shown above.

## Deliverables & Documents

All research, reports, plans, and documents MUST be saved in the
`docs/` directory with a date prefix (YYYY-MM-DD) for future reference:

  docs/2026-06-15_market_research.md
  docs/2026-06-15_technical_feasibility.md
  docs/2026-06-15_competitor_analysis.md

Always include the date prefix so future agents know when the document
was created.

## Application Development

This company's application is built and deployed via **Claude CLI** (AI code generation).
Claude CLI generates production-ready code, pushes to GitHub feature branches, and creates PRs.

### How App Development Works
- Development tasks describe WHAT to build in the task description
- Claude CLI has full codebase access — it reads existing code, writes new files, and runs builds
- Changes are committed to feature branches and submitted as GitHub PRs for review
- You can write code directly when working on development tasks

### Document Storage
- `documents/` — Research, reports, analysis, plans (Markdown)
- Save all non-code deliverables as Markdown files in the `documents/` directory

### For Development Tasks
- Read existing code to understand patterns and conventions
- Write production-ready code that follows project style
- Run tests and fix any failures before committing
- Create a feature branch, commit changes, and push for review

Files are also synced to S3 automatically after execution.