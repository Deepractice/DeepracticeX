---
name: deepracticex-logger
description: Lazy-initialized logging with pluggable backends. Use when you need structured logging across modules.
---

Feature: Lazy-initialized logging with pluggable backends
  @deepracticex/logger provides a logging system with lazy initialization.
  Loggers can be created at module level before any configuration happens.
  The actual backend is resolved on first use.

  Scenario: Install
    Given you need logging in your project
    Then install the package
      """
      bun add @deepracticex/logger
      """

  Scenario: Create a logger
    Given you need logging in a module
    Then call createLogger with a hierarchical namespace
      """typescript
      import { createLogger } from "@deepracticex/logger";

      // Safe to call at module top-level — logger is lazy
      const logger = createLogger("engine/AgentEngine");
      """

  Scenario: Log messages at different levels
    Given you have a logger instance
    Then use debug, info, warn, error methods
      """typescript
      logger.debug("Processing request");
      logger.info("Server started", { port: 3000 });
      logger.warn("Rate limit approaching", { current: 95, max: 100 });
      logger.error("Connection failed", { host: "db.example.com" });
      logger.error(new Error("Something went wrong"));
      """

  Scenario: Check if level is enabled
    Given you want to avoid expensive log message construction
    Then use isXxxEnabled() methods
      """typescript
      if (logger.isDebugEnabled()) {
        logger.debug("Detailed state", { state: computeExpensiveState() });
      }
      """

  Scenario: Plug in a custom logger backend
    Given you want to use a different logging framework
    Then call setLoggerFactory with a LoggerFactory implementation
      """typescript
      import { setLoggerFactory, type LoggerFactory, type Logger } from "@deepracticex/logger";

      const myFactory: LoggerFactory = {
        getLogger(name: string): Logger {
          // Return your custom Logger implementation
          return new MyCustomLogger(name);
        }
      };

      setLoggerFactory(myFactory);
      // All existing loggers will now use the new factory on next call
      """

  Scenario: Default console output format
    Given no custom factory is configured
    Then the built-in ConsoleLogger is used
    And output format is: `{timestamp} {LEVEL} [{namespace}] {message} {context?}`
    And example: `2026-02-25T06:00:00.000Z INFO  [engine/AgentEngine] Server started { port: 3000 }`

  Scenario: Log levels
    Given the available log levels in order
    Then "debug" shows all messages
    And "info" shows info, warn, error
    And "warn" shows warn, error
    And "error" shows only error
    And "silent" suppresses all messages
    And default level is "info"

  Scenario: TypeScript types
    Given you need to type logger objects
    Then import the types
      """typescript
      import {
        createLogger,
        setLoggerFactory,
        type Logger,
        type LoggerFactory,
        type LogLevel,    // "debug" | "info" | "warn" | "error" | "silent"
        type LogContext,  // Record<string, unknown>
      } from "@deepracticex/logger";
      """
