import { describe, test, expect } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  getModuleDir,
  getPackageRoot,
  getMonorepoRoot,
  resolveFromRoot,
  resolveFromPackage,
} from "../src";

describe("path utilities", () => {
  describe("getModuleDir", () => {
    test("returns directory of current module", () => {
      const dir = getModuleDir(import.meta);

      expect(dir).toBeString();
      expect(dir).toEndWith("/path/tests");
    });

    test("returns absolute path", () => {
      const dir = getModuleDir(import.meta);

      expect(dir.startsWith("/")).toBe(true);
    });
  });

  describe("getPackageRoot", () => {
    test("returns package root containing package.json", () => {
      const root = getPackageRoot(import.meta);

      expect(root).toBeString();
      expect(root).toEndWith("/path");
    });

    test("package root contains package.json", () => {
      const root = getPackageRoot(import.meta);

      expect(existsSync(join(root, "package.json"))).toBe(true);
    });
  });

  describe("getMonorepoRoot", () => {
    test("returns root directory", () => {
      const root = getMonorepoRoot(import.meta);

      expect(root).toBeString();
      expect(root).toEndWith("/DeepracticeX");
    });

    test("root contains lock file or package.json", () => {
      const root = getMonorepoRoot(import.meta);

      const hasBunLock = existsSync(join(root, "bun.lock"));
      const hasBunLockb = existsSync(join(root, "bun.lockb"));
      const hasPackageJson = existsSync(join(root, "package.json"));

      expect(hasBunLock || hasBunLockb || hasPackageJson).toBe(true);
    });
  });

  describe("resolveFromRoot", () => {
    test("resolves path relative to root", () => {
      const path = resolveFromRoot(import.meta, "packages");

      expect(path).toEndWith("/DeepracticeX/packages");
    });

    test("handles nested path segments", () => {
      const path = resolveFromRoot(import.meta, "packages", "sqlite", "src");

      expect(path).toEndWith("/DeepracticeX/packages/sqlite/src");
    });
  });

  describe("resolveFromPackage", () => {
    test("resolves path relative to package root", () => {
      const path = resolveFromPackage(import.meta, "src");

      expect(path).toEndWith("/path/src");
    });

    test("handles nested path segments", () => {
      const path = resolveFromPackage(import.meta, "src", "path.ts");

      expect(path).toEndWith("/path/src/path.ts");
    });
  });
});
