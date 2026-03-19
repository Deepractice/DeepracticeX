/**
 * RpcHandlerRegistry — generic RPC method registry with dispatch.
 *
 * The universal pattern for all Deepractice open source projects:
 * register methods, dispatch requests, export protocol metadata.
 *
 * @example
 * ```typescript
 * import { RpcHandlerRegistry, ok, err, ErrorCodes } from "@deepracticex/rpc";
 *
 * interface MyRuntime {
 *   db: Database;
 * }
 *
 * const registry = new RpcHandlerRegistry<MyRuntime>();
 *
 * registry.register("user.create", "Create a new user", async (ctx, params) => {
 *   const { name } = params as { name: string };
 *   const user = await ctx.db.insert({ name });
 *   return ok(user);
 * });
 *
 * // Dispatch
 * const response = await registry.handle(myRuntime, "user.create", { name: "Alice" });
 *
 * // Export protocol
 * const proto = registry.protocol("myservice", "1.0.0");
 * ```
 */

import type { RpcMethodSchema, RpcProtocol, RpcResponse } from "./types";
import { err } from "./helpers";
import { ErrorCodes } from "./errors";

// ============================================================================
// Types
// ============================================================================

/**
 * RPC handler function.
 * TContext is the runtime/service context passed to every handler.
 */
export type RpcHandler<TContext = unknown> = (
  ctx: TContext,
  params: unknown,
) => Promise<RpcResponse>;

/** Method definition: handler + metadata */
export interface RpcMethodDefinition<TContext = unknown> {
  handler: RpcHandler<TContext>;
  description: string;
}

// ============================================================================
// Registry
// ============================================================================

export class RpcHandlerRegistry<TContext = unknown> {
  private readonly definitions = new Map<string, RpcMethodDefinition<TContext>>();

  /**
   * Register an RPC method handler with description.
   */
  register(method: string, description: string, handler: RpcHandler<TContext>): this {
    this.definitions.set(method, { handler, description });
    return this;
  }

  /**
   * Check if a method is registered.
   */
  has(method: string): boolean {
    return this.definitions.has(method);
  }

  /**
   * Get all registered method names.
   */
  methods(): string[] {
    return [...this.definitions.keys()];
  }

  /**
   * Get all registered methods with metadata.
   */
  rpcMethods(): RpcMethodSchema[] {
    return [...this.definitions.entries()].map(([name, def]) => ({
      name,
      description: def.description,
    }));
  }

  /**
   * Export a complete RPC protocol definition.
   */
  protocol(namespace: string, version: string): RpcProtocol {
    return {
      namespace,
      version,
      methods: this.rpcMethods(),
    };
  }

  /**
   * Handle an RPC request — dispatch to registered handler.
   */
  async handle(ctx: TContext, method: string, params: unknown): Promise<RpcResponse> {
    const def = this.definitions.get(method);
    if (!def) {
      return err(ErrorCodes.METHOD_NOT_FOUND, `Method not found: ${method}`);
    }

    try {
      return await def.handler(ctx, params);
    } catch (error) {
      return err(
        ErrorCodes.INTERNAL_ERROR,
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
