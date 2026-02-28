import {
  ParameterTypeRegistry,
  ParameterType,
} from "@cucumber/cucumber-expressions";

let defaultTimeout = 5000;

export function setDefaultTimeout(milliseconds: number): void {
  defaultTimeout = milliseconds;
}

export function getDefaultTimeout(): number {
  return defaultTimeout;
}

const parameterTypeRegistry = new ParameterTypeRegistry();

export function defineParameterType<T>({
  name,
  regexp,
  transformer,
  useForSnippets,
  preferForRegexpMatch,
}: {
  name: string;
  regexp: readonly RegExp[] | readonly string[] | RegExp | string;
  transformer?: (...match: string[]) => T;
  useForSnippets?: boolean;
  preferForRegexpMatch?: boolean;
}): void {
  parameterTypeRegistry.defineParameterType(
    new ParameterType(
      name,
      regexp,
      null,
      transformer,
      useForSnippets,
      preferForRegexpMatch
    )
  );
}

export function getParameterTypeRegistry(): ParameterTypeRegistry {
  return parameterTypeRegistry;
}
