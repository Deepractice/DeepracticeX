/**
 * @deepracticex/error — Unified error system for Deepractice open source projects
 *
 * Standard error codes (JSON-RPC 2.0 + application-level),
 * domain error classes, and error code mappings.
 *
 * Used by @deepracticex/rpc, @deepracticex/service, and all platform adapters.
 */

// Error codes
export {
  ErrorCodes,
  type ErrorCode,
} from "./errors";

// Domain error classes
export {
  DomainError,
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "./errors";

// Error code mappings
export {
  DOMAIN_ERROR_CODE_MAP,
  ERROR_HTTP_STATUS_MAP,
} from "./errors";
