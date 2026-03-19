/**
 * Error System
 *
 * Standard error codes (JSON-RPC 2.0 + application-level)
 * and domain error classes for structured error handling.
 */

// ============================================================================
// Error Codes
// ============================================================================

/**
 * Standard error codes combining JSON-RPC 2.0 and application-level codes.
 *
 * JSON-RPC 2.0 standard: -32700 to -32600
 * Application-level: -40xxx (mapped from HTTP status codes)
 */
export const ErrorCodes = {
  // JSON-RPC 2.0 standard
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,

  // Application-level
  AUTHENTICATION_ERROR: -40100,
  FORBIDDEN: -40300,
  NOT_FOUND: -40400,
  CONFLICT: -40900,
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// ============================================================================
// Domain Error Classes
// ============================================================================

/**
 * Base class for all domain errors.
 * The `code` field maps to ErrorCodes keys for JSON-RPC error translation.
 */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
  }
}

export class AuthenticationError extends DomainError {
  constructor(message: string = "Authentication required") {
    super(message, "AUTHENTICATION_ERROR");
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = "Forbidden") {
    super(message, "FORBIDDEN");
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string = "Not found") {
    super(message, "NOT_FOUND");
  }
}

export class ConflictError extends DomainError {
  constructor(message: string = "Conflict") {
    super(message, "CONFLICT");
  }
}

// ============================================================================
// Error Code Mapping
// ============================================================================

/**
 * Maps DomainError string codes to JSON-RPC integer codes.
 * Used by runtime adapters to translate DomainError → JSON-RPC error response.
 */
export const DOMAIN_ERROR_CODE_MAP: Record<string, number> = {
  VALIDATION_ERROR: ErrorCodes.INVALID_PARAMS,
  AUTHENTICATION_ERROR: ErrorCodes.AUTHENTICATION_ERROR,
  FORBIDDEN: ErrorCodes.FORBIDDEN,
  NOT_FOUND: ErrorCodes.NOT_FOUND,
  CONFLICT: ErrorCodes.CONFLICT,
};

/**
 * Maps JSON-RPC error codes to HTTP status codes.
 * Used by adapters that need to set HTTP status on error responses.
 */
export const ERROR_HTTP_STATUS_MAP: Record<number, number> = {
  [ErrorCodes.PARSE_ERROR]: 400,
  [ErrorCodes.INVALID_REQUEST]: 400,
  [ErrorCodes.METHOD_NOT_FOUND]: 404,
  [ErrorCodes.INVALID_PARAMS]: 400,
  [ErrorCodes.INTERNAL_ERROR]: 500,
  [ErrorCodes.AUTHENTICATION_ERROR]: 401,
  [ErrorCodes.FORBIDDEN]: 403,
  [ErrorCodes.NOT_FOUND]: 404,
  [ErrorCodes.CONFLICT]: 409,
};
