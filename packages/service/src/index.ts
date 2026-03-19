/**
 * @deepracticex/service — Platform-agnostic service framework
 *
 * Define DDD services with a fluent API, run anywhere.
 * Combines domain primitives, DI, repository patterns, and RPC method registration.
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

// Builder
export { createService } from "./builder";

// Container (internal, for runtime adapters)
export type { RegisterFn, RegistrationContext, Runtime, ServiceDefinition } from "./container";
export { ServiceContainerImpl } from "./container";

// Decorators
export { inject, injectable, singleton } from "./decorators";

// Domain
export { Entity } from "./domain";
export { ValueObject } from "./domain";
export { Id } from "./domain";

// Domain errors — from @deepracticex/error (single source of truth)
export {
  DomainError,
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "@deepracticex/error";

// Event
export { createEvent } from "./event";
export type { PlatformEvent, UserCreatedEvent, UserCreatedPayload } from "./event";

// Repository
export type { Repository } from "./repository";
export { DrizzleRepository } from "./repository";

// RPC types
export type {
  AuthContext,
  MethodSchema,
  NormalizedRpcMethods,
  RpcContext,
  RpcError,
  RpcErrorResponse,
  RpcMethodDefinition,
  RpcMethodEntry,
  RpcMethodHandler,
  RpcMethods,
  RpcRequest,
  RpcResponse,
  RpcSuccessResponse,
  ServiceSchema,
} from "./rpc";

// RPC constants & helpers
export {
  DOMAIN_ERROR_CODE_MAP,
  ERROR_HTTP_STATUS_MAP,
  ErrorCodes,
  isMethodDefinition,
  JSONRPC_VERSION,
  normalizeMethod,
} from "./rpc";
