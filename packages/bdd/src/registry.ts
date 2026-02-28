import type { IWorld } from "./world";

export type StepPattern = string | RegExp;
export type StepFunction<W extends IWorld = IWorld> = (
  this: W,
  ...args: unknown[]
) => unknown | Promise<unknown>;

export interface StepDefinition {
  pattern: StepPattern;
  code: StepFunction;
  options?: StepOptions;
}

export interface StepOptions {
  timeout?: number;
}

const steps: StepDefinition[] = [];

function defineStep(pattern: StepPattern, code: StepFunction): void;
function defineStep(
  pattern: StepPattern,
  options: StepOptions,
  code: StepFunction
): void;
function defineStep(
  pattern: StepPattern,
  optionsOrCode: StepOptions | StepFunction,
  maybeCode?: StepFunction
): void {
  if (typeof optionsOrCode === "function") {
    steps.push({ pattern, code: optionsOrCode });
  } else {
    steps.push({ pattern, code: maybeCode!, options: optionsOrCode });
  }
}

export const Given = defineStep;
export const When = defineStep;
export const Then = defineStep;
export { defineStep };

export const 假设 = defineStep;
export const 当 = defineStep;
export const 那么 = defineStep;

export function getStepDefinitions(): readonly StepDefinition[] {
  return steps;
}

export function clearStepDefinitions(): void {
  steps.length = 0;
}
