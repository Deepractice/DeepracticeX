import type { IWorld } from "./world";

export interface TestCaseHookFunction<W extends IWorld = IWorld> {
  (this: W): unknown | Promise<unknown>;
}

export interface TestRunHookFunction {
  (): unknown | Promise<unknown>;
}

export interface HookOptions {
  name?: string;
  tags?: string;
  timeout?: number;
}

export interface HookDefinition {
  code: TestCaseHookFunction;
  options?: HookOptions;
}

export interface RunHookDefinition {
  code: TestRunHookFunction;
  options?: { timeout?: number };
}

const beforeHooks: HookDefinition[] = [];
const afterHooks: HookDefinition[] = [];
const beforeStepHooks: HookDefinition[] = [];
const afterStepHooks: HookDefinition[] = [];
const beforeAllHooks: RunHookDefinition[] = [];
const afterAllHooks: RunHookDefinition[] = [];

// Before
function Before<W extends IWorld = IWorld>(code: TestCaseHookFunction<W>): void;
function Before<W extends IWorld = IWorld>(
  tags: string,
  code: TestCaseHookFunction<W>
): void;
function Before<W extends IWorld = IWorld>(
  options: HookOptions,
  code: TestCaseHookFunction<W>
): void;
function Before(
  codeOrTagsOrOptions:
    | TestCaseHookFunction
    | string
    | HookOptions,
  maybeCode?: TestCaseHookFunction
): void {
  if (typeof codeOrTagsOrOptions === "function") {
    beforeHooks.push({ code: codeOrTagsOrOptions });
  } else if (typeof codeOrTagsOrOptions === "string") {
    beforeHooks.push({
      code: maybeCode!,
      options: { tags: codeOrTagsOrOptions },
    });
  } else {
    beforeHooks.push({ code: maybeCode!, options: codeOrTagsOrOptions });
  }
}

// After
function After<W extends IWorld = IWorld>(code: TestCaseHookFunction<W>): void;
function After<W extends IWorld = IWorld>(
  tags: string,
  code: TestCaseHookFunction<W>
): void;
function After<W extends IWorld = IWorld>(
  options: HookOptions,
  code: TestCaseHookFunction<W>
): void;
function After(
  codeOrTagsOrOptions:
    | TestCaseHookFunction
    | string
    | HookOptions,
  maybeCode?: TestCaseHookFunction
): void {
  if (typeof codeOrTagsOrOptions === "function") {
    afterHooks.push({ code: codeOrTagsOrOptions });
  } else if (typeof codeOrTagsOrOptions === "string") {
    afterHooks.push({
      code: maybeCode!,
      options: { tags: codeOrTagsOrOptions },
    });
  } else {
    afterHooks.push({ code: maybeCode!, options: codeOrTagsOrOptions });
  }
}

// BeforeStep
function BeforeStep<W extends IWorld = IWorld>(
  code: TestCaseHookFunction<W>
): void;
function BeforeStep<W extends IWorld = IWorld>(
  tags: string,
  code: TestCaseHookFunction<W>
): void;
function BeforeStep<W extends IWorld = IWorld>(
  options: HookOptions,
  code: TestCaseHookFunction<W>
): void;
function BeforeStep(
  codeOrTagsOrOptions:
    | TestCaseHookFunction
    | string
    | HookOptions,
  maybeCode?: TestCaseHookFunction
): void {
  if (typeof codeOrTagsOrOptions === "function") {
    beforeStepHooks.push({ code: codeOrTagsOrOptions });
  } else if (typeof codeOrTagsOrOptions === "string") {
    beforeStepHooks.push({
      code: maybeCode!,
      options: { tags: codeOrTagsOrOptions },
    });
  } else {
    beforeStepHooks.push({
      code: maybeCode!,
      options: codeOrTagsOrOptions,
    });
  }
}

// AfterStep
function AfterStep<W extends IWorld = IWorld>(
  code: TestCaseHookFunction<W>
): void;
function AfterStep<W extends IWorld = IWorld>(
  tags: string,
  code: TestCaseHookFunction<W>
): void;
function AfterStep<W extends IWorld = IWorld>(
  options: HookOptions,
  code: TestCaseHookFunction<W>
): void;
function AfterStep(
  codeOrTagsOrOptions:
    | TestCaseHookFunction
    | string
    | HookOptions,
  maybeCode?: TestCaseHookFunction
): void {
  if (typeof codeOrTagsOrOptions === "function") {
    afterStepHooks.push({ code: codeOrTagsOrOptions });
  } else if (typeof codeOrTagsOrOptions === "string") {
    afterStepHooks.push({
      code: maybeCode!,
      options: { tags: codeOrTagsOrOptions },
    });
  } else {
    afterStepHooks.push({
      code: maybeCode!,
      options: codeOrTagsOrOptions,
    });
  }
}

// BeforeAll
function BeforeAll(code: TestRunHookFunction): void;
function BeforeAll(
  options: { timeout?: number },
  code: TestRunHookFunction
): void;
function BeforeAll(
  codeOrOptions: TestRunHookFunction | { timeout?: number },
  maybeCode?: TestRunHookFunction
): void {
  if (typeof codeOrOptions === "function") {
    beforeAllHooks.push({ code: codeOrOptions });
  } else {
    beforeAllHooks.push({ code: maybeCode!, options: codeOrOptions });
  }
}

// AfterAll
function AfterAll(code: TestRunHookFunction): void;
function AfterAll(
  options: { timeout?: number },
  code: TestRunHookFunction
): void;
function AfterAll(
  codeOrOptions: TestRunHookFunction | { timeout?: number },
  maybeCode?: TestRunHookFunction
): void {
  if (typeof codeOrOptions === "function") {
    afterAllHooks.push({ code: codeOrOptions });
  } else {
    afterAllHooks.push({ code: maybeCode!, options: codeOrOptions });
  }
}

export { Before, After, BeforeStep, AfterStep, BeforeAll, AfterAll };

export const 之前 = Before;
export const 之后 = After;

export function getBeforeHooks(): readonly HookDefinition[] {
  return beforeHooks;
}
export function getAfterHooks(): readonly HookDefinition[] {
  return afterHooks;
}
export function getBeforeStepHooks(): readonly HookDefinition[] {
  return beforeStepHooks;
}
export function getAfterStepHooks(): readonly HookDefinition[] {
  return afterStepHooks;
}
export function getBeforeAllHooks(): readonly RunHookDefinition[] {
  return beforeAllHooks;
}
export function getAfterAllHooks(): readonly RunHookDefinition[] {
  return afterAllHooks;
}

export function clearHooks(): void {
  beforeHooks.length = 0;
  afterHooks.length = 0;
  beforeStepHooks.length = 0;
  afterStepHooks.length = 0;
  beforeAllHooks.length = 0;
  afterAllHooks.length = 0;
}
