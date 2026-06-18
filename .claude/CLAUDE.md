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
  next-env.d.ts
  next.config.ts
  package-lock.json
  package.json
  postcss.config.js
  tailwind.config.ts
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
  src/
    app/
      globals.css
      layout.tsx
      page.tsx
      analytics/
      api/
      command-console/
      pilot-checkout/
    lib/
      analytics.ts
      orchestration-state.ts
      supabase.ts
```

BEFORE writing any code, use Read and Glob tools to understand existing files.
Place new files in the correct directories shown above.

## Deliverables & Documents

All research, reports, plans, and documents MUST be saved in the
`docs/` directory with a date prefix (YYYY-MM-DD) for future reference:

  docs/2026-06-03_market_research.md
  docs/2026-06-03_technical_feasibility.md
  docs/2026-06-03_competitor_analysis.md

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