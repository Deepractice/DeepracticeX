# @deepracticex/drizzle

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
