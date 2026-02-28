import {
  CucumberExpression,
  RegularExpression,
  type Expression,
} from "@cucumber/cucumber-expressions";
import type { StepDefinition } from "./registry";
import { getParameterTypeRegistry } from "./config";

export interface MatchResult {
  definition: StepDefinition;
  args: unknown[];
}

function buildExpression(pattern: string | RegExp): Expression {
  const registry = getParameterTypeRegistry();
  if (typeof pattern === "string") {
    return new CucumberExpression(pattern, registry);
  }
  return new RegularExpression(pattern, registry);
}

export function matchStep(
  text: string,
  definitions: readonly StepDefinition[]
): MatchResult {
  const matches: MatchResult[] = [];

  for (const definition of definitions) {
    const expression = buildExpression(definition.pattern);
    const result = expression.match(text);
    if (result) {
      const args = result.map((arg) => arg.getValue(null));
      matches.push({ definition, args });
    }
  }

  if (matches.length === 0) {
    throw new Error(
      `Step undefined: "${text}"\n` +
        `You can implement it with:\n` +
        `  Given("${text}", function () {\n` +
        `    // TODO\n` +
        `  });`
    );
  }

  if (matches.length > 1) {
    const patterns = matches
      .map((m) => `  ${m.definition.pattern}`)
      .join("\n");
    throw new Error(
      `Ambiguous step: "${text}"\nMatches:\n${patterns}`
    );
  }

  return matches[0];
}
