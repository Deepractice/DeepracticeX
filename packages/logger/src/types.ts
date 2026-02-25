/**
 * Logger Types
 *
 * Type definitions for the logging system.
 */

/**
 * Log level
 */
export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

/**
 * Log context - additional metadata for log entries
 */
export type LogContext = Record<string, unknown>;

/**
 * Logger interface
 */
export interface Logger {
  readonly name: string;
  readonly level: LogLevel;

  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string | Error, context?: LogContext): void;

  isDebugEnabled(): boolean;
  isInfoEnabled(): boolean;
  isWarnEnabled(): boolean;
  isErrorEnabled(): boolean;
}

/**
 * Logger factory interface
 */
export interface LoggerFactory {
  getLogger(name: string): Logger;
}
