import { resolve } from "node:path";
import { setDefaultTimeout } from "./config";
import { loadFeature } from "./runner";

export interface BDDConfig {
  /** Glob pattern(s) for .feature files */
  features: string | string[];
  /** Glob pattern(s) for step/hook definition files */
  steps?: string | string[];
  /** Global tag filter expression, e.g. "@smoke and not @slow" */
  tags?: string;
  /** Default timeout in milliseconds */
  timeout?: number;
}

export async function configure(config: BDDConfig): Promise<void> {
  if (config.timeout != null) {
    setDefaultTimeout(config.timeout);
  }

  // 1. Scan and import step/hook files — registers Given/When/Then/Before/After
  if (config.steps) {
    const patterns = Array.isArray(config.steps)
      ? config.steps
      : [config.steps];
    for (const pattern of patterns) {
      const glob = new Bun.Glob(pattern);
      for await (const file of glob.scan({ cwd: "." })) {
        await import(resolve(file));
      }
    }
  }

  // 2. Scan and load feature files — registers describe/test with bun:test
  const featurePatterns = Array.isArray(config.features)
    ? config.features
    : [config.features];
  for (const pattern of featurePatterns) {
    const glob = new Bun.Glob(pattern);
    for await (const file of glob.scan({ cwd: "." })) {
      loadFeature(resolve(file), { tags: config.tags });
    }
  }
}
