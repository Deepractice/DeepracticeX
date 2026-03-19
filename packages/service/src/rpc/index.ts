/**
 * Service-level RPC type contracts.
 *
 * Imports shared error codes from @deepracticex/error.
 * Defines service-specific types: AuthContext, RpcContext, handler signatures.
 */

// Re-export from @deepracticex/error — single source of truth
export {
  ErrorCodes,
  DOMAIN_ERROR_CODE_MAP,
  ERROR_HTTP_STATUS_MAP,
} from "@deepracticex/error";

export const JSONRPC_VERSION = "2.0";

// ==================== Auth ====================

/**
 * Auth context injected into RPC handlers by the runtime.
 */
export interface AuthContext {
  userId: string;
  tenantId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

// ==================== RPC Context ====================

/**
 * Context available to each RPC method handler.
 */
export interface RpcContext {
  /** Authenticated user info (null if public method). */
  auth: AuthContext;
  /** Resolve a dependency from the service container. */
  resolve<T>(token: string): T;
  /** Raw environment variables (platform-injected). */
  env: Record<string, unknown>;
}

// ==================== Method Handler ====================

/**
 * A single RPC method handler.
 */
export type RpcMethodHandler<TParams = any, TResult = any> = (
  params: TParams,
  ctx: RpcContext
) => Promise<TResult> | TResult;

/**
 * RPC method definition with metadata.
 *
 * - `permissions: undefined` → requires authentication (default)
 * - `permissions: []` → public, no auth needed
 * - `permissions: ["admin"]` → requires auth + specific permission
 */
export interface RpcMethodDefinition {
  handler: RpcMethodHandler;
  description?: string;
  permissions?: string[];
}

/**
 * A method entry: either a bare handler or a full definition with metadata.
 */
export type RpcMethodEntry = RpcMethodHandler | RpcMethodDefinition;

/**
 * Map of method names to their handlers or definitions.
 */
export type RpcMethods = Record<string, RpcMethodEntry>;

/**
 * Normalized method map — all entries resolved to full definitions.
 * Used internally by ServiceDefinition and runtime adapters.
 */
export type NormalizedRpcMethods = Record<string, RpcMethodDefinition>;

/**
 * Check if a method entry is a full definition (not a bare handler).
 */
export function isMethodDefinition(entry: RpcMethodEntry): entry is RpcMethodDefinition {
  return typeof entry === "object" && entry !== null && "handler" in entry;
}

/**
 * Normalize a method entry to a full definition.
 */
export function normalizeMethod(entry: RpcMethodEntry): RpcMethodDefinition {
  if (isMethodDefinition(entry)) {
    return entry;
  }
  return { handler: entry };
}

// ==================== JSON-RPC 2.0 Request/Response ====================

/**
 * JSON-RPC 2.0 request.
 */
export interface RpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

/**
 * JSON-RPC 2.0 success response.
 */
export interface RpcSuccessResponse<T = unknown> {
  jsonrpc: "2.0";
  id: string | number | null;
  result: T;
}

/**
 * JSON-RPC 2.0 error object.
 */
export interface RpcError {
  code: number;
  message: string;
  data?: unknown;
}

/**
 * JSON-RPC 2.0 error response.
 */
export interface RpcErrorResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  error: RpcError;
}

export type RpcResponse<T = unknown> = RpcSuccessResponse<T> | RpcErrorResponse;

// ==================== Schema ====================

/**
 * Method schema for /rpc/methods.
 */
export interface MethodSchema {
  name: string;
  description?: string;
  permissions?: string[];
}

/**
 * Service schema returned by /rpc/methods.
 */
export interface ServiceSchema {
  name: string;
  methods: MethodSchema[];
}
