import "reflect-metadata";
import { container as tsyringeContainer } from "tsyringe";
import type { RegistrationContext } from "./types";

/**
 * Internal DI container implementation.
 * Used by the fluent API and platform runtimes.
 * Not directly exposed to end users.
 */
export class ServiceContainerImpl {
  private _initialized = false;
  private ctx: RegistrationContextImpl;

  constructor() {
    this.ctx = new RegistrationContextImpl();
  }

  get initialized(): boolean {
    return this._initialized;
  }

  initialize(
    registerFn: ((ctx: RegistrationContext, env: Record<string, unknown>) => void) | null,
    env: Record<string, unknown>
  ): void {
    if (this._initialized) return;
    this._initialized = true;
    this.ctx.clear();
    if (registerFn) {
      registerFn(this.ctx, env);
    }
  }

  resolve<T>(token: string): T {
    return this.ctx.resolve<T>(token);
  }
}

class RegistrationContextImpl implements RegistrationContext {
  value<T>(token: string, val: T): void {
    tsyringeContainer.register(token, { useValue: val });
  }

  bind<T>(token: string, cls: new (...args: any[]) => T): void {
    tsyringeContainer.registerSingleton(token, cls as any);
  }

  transient<T>(token: string, cls: new (...args: any[]) => T): void {
    tsyringeContainer.register(token, { useClass: cls as any });
  }

  resolve<T>(token: string): T {
    return tsyringeContainer.resolve<T>(token);
  }

  clear(): void {
    tsyringeContainer.clearInstances();
  }
}
