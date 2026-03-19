/**
 * RPC Protocol Types
 *
 * Unified type definitions for RPC method metadata and protocol exchange.
 * Used by AgentX, RoleX, SandboX, and ServiceX.
 */

// ============================================================================
// Method Metadata
// ============================================================================

/**
 * Describes a single RPC method — its name, purpose, and access control.
 *
 * @example
 * ```typescript
 * const method: RpcMethodSchema = {
 *   name: "image.create",
 *   description: "Create a new agent image",
 *   permissions: [],  // public
 * };
 * ```
 */
export interface RpcMethodSchema {
  /** Method name in resource.verb format (e.g. "image.create", "session.validate") */
  name: string;
  /** Human-readable description of what this method does */
  description: string;
  /** Access control: undefined = auth required, [] = public, ["admin"] = specific role */
  permissions?: string[];
}

/**
 * A complete RPC protocol exported by an open source SDK.
 * Describes all methods the SDK provides under a namespace.
 *
 * @example
 * ```typescript
 * const protocol: RpcProtocol = {
 *   namespace: "agentx",
 *   version: "1.0.0",
 *   methods: [
 *     { name: "image.create", description: "Create a new agent image" },
 *     { name: "image.get", description: "Get an agent image by ID" },
 *   ],
 * };
 * ```
 */
export interface RpcProtocol {
  /** Protocol namespace (e.g. "agentx", "rolex", "sandbox") */
  namespace: string;
  /** Protocol version (semver) */
  version: string;
  /** All RPC methods provided by this protocol */
  methods: RpcMethodSchema[];
}

// ============================================================================
// Response Types
// ============================================================================

/** Successful RPC response */
export interface RpcResult<T = unknown> {
  success: true;
  data: T;
}

/** Failed RPC response */
export interface RpcError {
  success: false;
  code: number;
  message: string;
}

/** Discriminated union for RPC responses */
export type RpcResponse<T = unknown> = RpcResult<T> | RpcError;

// ============================================================================
// JSON-RPC 2.0 Wire Format
// ============================================================================

/** JSON-RPC 2.0 request envelope */
export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

/** JSON-RPC 2.0 success response envelope */
export interface JsonRpcResponse<T = unknown> {
  jsonrpc: "2.0";
  id?: string | number | null;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}
