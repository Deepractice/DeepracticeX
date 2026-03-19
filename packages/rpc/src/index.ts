/**
 * @deepracticex/rpc — Unified RPC framework for Deepractice open source projects
 *
 * Provides the standard RPC pattern: registry, dispatch, errors, and protocol export.
 * Used by AgentX, RoleX, SandboX, and ServiceX.
 *
 * @example
 * ```typescript
 * import { RpcHandlerRegistry, ok, err, ErrorCodes } from "@deepracticex/rpc";
 *
 * const registry = new RpcHandlerRegistry<MyRuntime>();
 *
 * registry.register("image.create", "Create a new agent image", async (ctx, params) => {
 *   const { name } = params as { name: string };
 *   return ok({ id: "img_123", name });
 * });
 *
 * // Dispatch
 * const response = await registry.handle(runtime, "image.create", { name: "test" });
 *
 * // Export protocol for ServiceX integration
 * const proto = registry.protocol("agentx", "1.0.0");
 * ```
 */

// Types
export type {
  RpcMethodSchema,
  RpcProtocol,
  RpcResult,
  RpcError,
  RpcResponse,
  JsonRpcRequest,
  JsonRpcResponse,
} from "./types";

// Registry
export {
  RpcHandlerRegistry,
  type RpcHandler,
  type RpcMethodDefinition,
} from "./registry";

// Errors
export {
  ErrorCodes,
  type ErrorCode,
  DomainError,
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  DOMAIN_ERROR_CODE_MAP,
  ERROR_HTTP_STATUS_MAP,
} from "./errors";

// Helpers
export { ok, err } from "./helpers";
