/**
 * Fluent builder for defining and running a service.
 *
 * Everything before `.run()` is platform-agnostic — pure service definition.
 * `.run()` binds to a platform runtime and produces the runnable export.
 */

import type {
  RegisterFn,
  RpcContext,
  RpcMethodHandler,
  RpcMethods,
  Runtime,
  ServiceDefinition,
} from "./index";
import { normalizeMethod } from "./rpc";

/**
 * RPC Protocol definition — can be from @deepracticex/rpc or any compatible shape.
 */
interface RpcProtocolLike {
  namespace: string;
  version: string;
  methods: { name: string; description?: string; permissions?: string[] }[];
}

/**
 * Proxy handler — receives method name (without service prefix), params, and context.
 */
type ProxyHandler = (
  method: string,
  params: unknown,
  ctx: RpcContext
) => Promise<unknown> | unknown;

/**
 * Fluent builder for defining and running a service.
 */
interface ServiceBuilder {
  /**
   * Declare RPC methods.
   *
   * Two calling conventions:
   *
   * **Inline** — methods with handlers defined together:
   * ```ts
   * .rpc({
   *   "session.create": async (params, ctx) => { ... },
   *   "key.create": {
   *     handler: async (params, ctx) => { ... },
   *     description: "Create an API key",
   *     permissions: ["admin"],
   *   },
   * })
   * ```
   *
   * **Protocol + handlers** — separate protocol (source of truth) from handlers:
   * ```ts
   * .rpc(protocol, {
   *   "session.create": async (p, ctx) => { ... },
   *   "key.create": async (p, ctx) => { ... },
   * })
   * ```
   * Protocol provides name, description, permissions. Handlers provide implementation.
   */
  rpc(methods: RpcMethods): ServiceBuilder;
  rpc(protocol: RpcProtocolLike, handlers: Record<string, RpcMethodHandler>): ServiceBuilder;

  /**
   * Register all methods from a protocol, proxied through a single handler.
   *
   * Ideal for SDK proxy services (Runtime → AgentX, Context → RoleX).
   * The proxy handler receives the method name (as defined in protocol, without prefix),
   * params, and context.
   *
   * ```ts
   * .proxy(agentxProtocol, async (method, params, ctx) =>
   *   proxyToAgentX(ctx.env, ctx.auth.tenantId, method, params))
   * ```
   */
  proxy(protocol: RpcProtocolLike, handler: ProxyHandler): ServiceBuilder;

  /** Declare public methods (no auth required). Can be called multiple times. */
  publicMethods(names: string[]): ServiceBuilder;
  /** Declare dependency registration. */
  register(fn: RegisterFn): ServiceBuilder;
  /** Bind to a platform runtime and produce the runnable export. */
  run<T>(runtime: Runtime<T>): T;
}

class ServiceBuilderImpl implements ServiceBuilder {
  private _definition: ServiceDefinition;

  constructor(name: string) {
    this._definition = {
      name,
      methods: {},
      registerFn: null,
    };
  }

  rpc(
    methodsOrProtocol: RpcMethods | RpcProtocolLike,
    handlers?: Record<string, RpcMethodHandler>,
  ): ServiceBuilder {
    if (handlers && "methods" in methodsOrProtocol && "namespace" in methodsOrProtocol) {
      // Protocol + handlers mode
      const protocol = methodsOrProtocol as RpcProtocolLike;
      for (const method of protocol.methods) {
        const handler = handlers[method.name];
        if (!handler) {
          throw new Error(
            `[${this._definition.name}] Missing handler for protocol method "${method.name}"`,
          );
        }
        this._definition.methods[method.name] = {
          handler,
          description: method.description,
          permissions: method.permissions,
        };
      }
    } else {
      // Inline methods mode
      const methods = methodsOrProtocol as RpcMethods;
      for (const [name, entry] of Object.entries(methods)) {
        this._definition.methods[name] = normalizeMethod(entry);
      }
    }
    return this;
  }

  proxy(protocol: RpcProtocolLike, handler: ProxyHandler): ServiceBuilder {
    for (const method of protocol.methods) {
      this._definition.methods[method.name] = {
        handler: (params: unknown, ctx: RpcContext) => handler(method.name, params, ctx),
        description: method.description,
        permissions: method.permissions,
      };
    }
    return this;
  }

  publicMethods(names: string[]): ServiceBuilder {
    for (const name of names) {
      const method = this._definition.methods[name];
      if (method) {
        method.permissions = [];
      }
    }
    return this;
  }

  register(fn: RegisterFn): ServiceBuilder {
    this._definition.registerFn = fn;
    return this;
  }

  run<T>(runtime: Runtime<T>): T {
    return runtime.create(this._definition);
  }
}

/**
 * Create a service with a fluent API.
 *
 * Everything before `.run()` is platform-agnostic — pure service definition.
 * `.run()` binds to a platform runtime and produces the runnable export.
 *
 * @example
 * ```ts
 * import { createService } from "@deepracticex/service";
 * import { cloudflare } from "@deepractice-ai/servicex-cloudflare";
 *
 * export default createService("auth")
 *   .rpc(protocol, handlers)
 *   .run(cloudflare());
 * ```
 */
export function createService(name: string): ServiceBuilder {
  return new ServiceBuilderImpl(name);
}
