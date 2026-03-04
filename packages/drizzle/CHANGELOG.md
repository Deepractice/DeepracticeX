# @deepracticex/drizzle

## 0.3.1

### Patch Changes

- ae4648e: Fix: include migrate() in published build (was missing from 0.3.0 due to CI ordering).

## 0.3.0

### Minor Changes

- c561042: Add `migrate()` function for running drizzle-kit generated SQL migrations with CommonXDatabase.

## 0.2.3

### Patch Changes

- 358f030: Fix: workspace:\* now properly resolved to semver range during publish.

## 0.2.2

### Patch Changes

- ce2bfa1: Fix: republish with workspace:\* properly resolved to semver range.

## 0.2.1

### Patch Changes

- c1249c2: Fix workspace:\* dependency not resolved during initial publish.

## 0.2.0

### Minor Changes

- 14f62a4: Initial release of @deepracticex infrastructure packages.

  - `@deepracticex/sqlite` — Unified SQLite abstraction (Bun + Node.js 22+)
  - `@deepracticex/logger` — Lazy-initialized logging with pluggable backends
  - `@deepracticex/path` — Cross-runtime path utilities
  - `@deepracticex/id` — ID generation utilities
  - `@deepracticex/drizzle` — Drizzle ORM driver for cross-runtime SQLite

### Patch Changes

- Updated dependencies [14f62a4]
  - @deepracticex/sqlite@0.2.0
