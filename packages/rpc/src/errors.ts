/**
 * Re-export error system from @deepracticex/error.
 *
 * Backward compatible — consumers of @deepracticex/rpc can still import
 * ErrorCodes, DomainError, etc. from this package.
 */
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
} from "@deepracticex/error";
