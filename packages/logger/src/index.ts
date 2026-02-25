/**
 * Logger module
 *
 * Provides lazy-initialized logging with pluggable backends.
 *
 * @example
 * ```typescript
 * import { createLogger } from "commonxjs/logger";
 *
 * // Safe at module level (before Runtime configured)
 * const logger = createLogger("engine/AgentEngine");
 *
 * // Later, at runtime
 * logger.info("Agent initialized", { agentId: "xxx" });
 * ```
 */

export type { LogLevel, LogContext, Logger, LoggerFactory } from "./types";
export { ConsoleLogger, type ConsoleLoggerOptions } from "./ConsoleLogger";
export {
  LoggerFactoryImpl,
  type LoggerFactoryConfig,
  setLoggerFactory,
  createLogger,
} from "./LoggerFactoryImpl";
