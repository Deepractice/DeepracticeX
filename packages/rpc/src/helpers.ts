/**
 * RPC Response Helpers
 *
 * Convenience functions for creating typed RPC responses.
 */

import type { RpcError, RpcResult } from "./types";

/** Create a success response */
export function ok<T>(data: T): RpcResult<T> {
  return { success: true, data };
}

/** Create an error response */
export function err(code: number, message: string): RpcError {
  return { success: false, code, message };
}
