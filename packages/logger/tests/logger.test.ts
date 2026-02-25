import { describe, test, expect } from "bun:test";
import { createLogger, setLoggerFactory, type LoggerFactory, type Logger } from "../src";

describe("logger", () => {
  describe("createLogger", () => {
    test("creates logger with namespace", () => {
      const logger = createLogger("test/module");

      expect(logger).toBeDefined();
      expect(logger.debug).toBeFunction();
      expect(logger.info).toBeFunction();
      expect(logger.warn).toBeFunction();
      expect(logger.error).toBeFunction();
    });

    test("logger methods can be called", () => {
      const logger = createLogger("test/module");

      expect(() => {
        logger.debug("debug message");
        logger.info("info message");
        logger.warn("warn message");
        logger.error("error message");
      }).not.toThrow();
    });

    test("logger methods accept context object", () => {
      const logger = createLogger("test/module");

      expect(() => {
        logger.info("message with context", { key: "value", count: 42 });
      }).not.toThrow();
    });
  });

  describe("setLoggerFactory", () => {
    test("allows custom logger factory", () => {
      const logs: string[] = [];

      const customFactory: LoggerFactory = {
        getLogger: (namespace: string): Logger => ({
          name: namespace,
          level: "info",
          debug: (msg) => logs.push(`[${namespace}] DEBUG: ${msg}`),
          info: (msg) => logs.push(`[${namespace}] INFO: ${msg}`),
          warn: (msg) => logs.push(`[${namespace}] WARN: ${msg}`),
          error: (msg) => logs.push(`[${namespace}] ERROR: ${msg}`),
          isDebugEnabled: () => true,
          isInfoEnabled: () => true,
          isWarnEnabled: () => true,
          isErrorEnabled: () => true,
        }),
      };

      setLoggerFactory(customFactory);
      const logger = createLogger("custom/test");

      logger.info("test message");

      expect(logs).toContain("[custom/test] INFO: test message");
    });
  });
});
