import { describe, test, beforeAll, afterAll } from "bun:test";
import type * as messages from "@cucumber/messages";
import { parseFeatureFile } from "./parser";
import { getStepDefinitions } from "./registry";
import { matchStep } from "./matcher";
import { createWorld } from "./world";
import { getDefaultTimeout } from "./config";
import {
  getBeforeHooks,
  getAfterHooks,
  getBeforeStepHooks,
  getAfterStepHooks,
  getBeforeAllHooks,
  getAfterAllHooks,
} from "./hooks";
import { matchesTags } from "./tag-filter";
import { DataTable } from "./data-table";

export interface LoadFeatureOptions {
  tags?: string;
}

export function loadFeature(
  filePath: string,
  options?: LoadFeatureOptions
): void {
  const { document, pickles } = parseFeatureFile(filePath);
  const featureName =
    document.feature?.name ?? filePath;

  describe(featureName, () => {
    const beforeAllDefs = getBeforeAllHooks();
    const afterAllDefs = getAfterAllHooks();

    if (beforeAllDefs.length > 0) {
      beforeAll(async () => {
        for (const hook of beforeAllDefs) {
          await hook.code();
        }
      });
    }

    if (afterAllDefs.length > 0) {
      afterAll(async () => {
        for (const hook of afterAllDefs) {
          await hook.code();
        }
      });
    }

    for (const pickle of pickles) {
      if (!matchesTags(pickle.tags, options?.tags)) {
        continue;
      }

      const scenarioName = pickle.name;
      const timeout =
        getDefaultTimeout();

      test(
        scenarioName,
        async () => {
          await runScenario(pickle, document);
        },
        timeout
      );
    }
  });
}

async function runScenario(
  pickle: messages.Pickle,
  _document: messages.GherkinDocument
): Promise<void> {
  const world = createWorld();
  const definitions = getStepDefinitions();
  const beforeDefs = getBeforeHooks();
  const afterDefs = getAfterHooks();
  const beforeStepDefs = getBeforeStepHooks();
  const afterStepDefs = getAfterStepHooks();

  // Run Before hooks
  for (const hook of beforeDefs) {
    if (matchesTags(pickle.tags, hook.options?.tags)) {
      await hook.code.call(world);
    }
  }

  try {
    // Run steps
    for (const step of pickle.steps) {
      // BeforeStep hooks
      for (const hook of beforeStepDefs) {
        if (matchesTags(pickle.tags, hook.options?.tags)) {
          await hook.code.call(world);
        }
      }

      const { definition, args } = matchStep(step.text, definitions);

      // Build final args: extracted params + optional DataTable/DocString
      const finalArgs = [...args];
      if (step.argument?.dataTable) {
        finalArgs.push(new DataTable(step.argument.dataTable));
      }
      if (step.argument?.docString) {
        finalArgs.push(step.argument.docString.content);
      }

      await definition.code.call(world, ...finalArgs);

      // AfterStep hooks
      for (const hook of afterStepDefs) {
        if (matchesTags(pickle.tags, hook.options?.tags)) {
          await hook.code.call(world);
        }
      }
    }
  } finally {
    // Run After hooks (always, even on failure)
    for (const hook of afterDefs) {
      if (matchesTags(pickle.tags, hook.options?.tags)) {
        await hook.code.call(world);
      }
    }
  }
}
