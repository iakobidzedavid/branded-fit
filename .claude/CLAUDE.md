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
    2026-06-08_analytics_seed_report.md
    2026-06-08_e2e_funnel_test_report.md
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
      api/
      command-console/
      pilot-checkout/
      store/
      test-suite/
    components/
      EventSummaryCards.tsx
      FunnelChart.tsx
      TimeSeriesChart.tsx
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

  docs/2026-06-08_market_research.md
  docs/2026-06-08_technical_feasibility.md
  docs/2026-06-08_competitor_analysis.md

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