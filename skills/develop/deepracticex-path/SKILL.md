---
name: deepracticex-path
description: Cross-runtime path utilities for Bun and Node.js. Use when you need __dirname, package root, or monorepo root.
---

Feature: Cross-runtime path utilities
  @deepracticex/path provides path helpers that work on both Bun and Node.js.
  Solves the common ESM problem of no __dirname by using import.meta.

  Scenario: Install
    Given you need cross-runtime path utilities
    Then install the package
      """
      bun add @deepracticex/path
      """

  Scenario: Get current module directory (__dirname equivalent)
    Given you need the directory of the current file in ESM
    Then use getModuleDir with import.meta
      """typescript
      import { getModuleDir } from "@deepracticex/path";

      const __dirname = getModuleDir(import.meta);
      // Bun: uses import.meta.dir
      // Node.js: uses fileURLToPath(import.meta.url)
      """

  Scenario: Get package root
    Given you need to find the nearest package.json directory
    Then use getPackageRoot with import.meta
      """typescript
      import { getPackageRoot } from "@deepracticex/path";

      const root = getPackageRoot(import.meta);
      // Walks up from current file until package.json is found
      """

  Scenario: Get monorepo root
    Given you are in a monorepo and need the workspace root
    Then use getMonorepoRoot with import.meta
      """typescript
      import { getMonorepoRoot } from "@deepracticex/path";

      const root = getMonorepoRoot(import.meta);
      // Detects: pnpm-workspace.yaml, bun.lock, package-lock.json, yarn.lock
      """

  Scenario: Resolve path from monorepo root
    Given you need to build a path relative to the monorepo root
    Then use resolveFromRoot with import.meta and path segments
      """typescript
      import { resolveFromRoot } from "@deepracticex/path";

      const dataDir = resolveFromRoot(import.meta, "data");
      const config = resolveFromRoot(import.meta, "packages", "config", "settings.json");
      """

  Scenario: Resolve path from package root
    Given you need to build a path relative to the current package
    Then use resolveFromPackage with import.meta and path segments
      """typescript
      import { resolveFromPackage } from "@deepracticex/path";

      const testsDir = resolveFromPackage(import.meta, "tests");
      const fixture = resolveFromPackage(import.meta, "tests", "fixtures", "data.json");
      """

  Scenario: All functions require import.meta
    Given every function takes import.meta as the first argument
    Then always pass import.meta from the calling module
    And this is how the library determines the starting directory for resolution
