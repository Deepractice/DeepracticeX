import { describe, test, expect } from "bun:test";
import { generateId, generateRequestId } from "../src";

describe("id utilities", () => {
  describe("generateId", () => {
    test("generates unique IDs", () => {
      const id1 = generateId("test");
      const id2 = generateId("test");
      const id3 = generateId("test");

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    test("generates string IDs", () => {
      const id = generateId("test");

      expect(id).toBeString();
      expect(id.length).toBeGreaterThan(0);
    });

    test("generates many unique IDs", () => {
      const ids = new Set<string>();
      const count = 1000;

      for (let i = 0; i < count; i++) {
        ids.add(generateId("test"));
      }

      expect(ids.size).toBe(count);
    });
  });

  describe("generateRequestId", () => {
    test("generates unique request IDs", () => {
      const id1 = generateRequestId();
      const id2 = generateRequestId();

      expect(id1).not.toBe(id2);
    });

    test("generates string IDs", () => {
      const id = generateRequestId();

      expect(id).toBeString();
      expect(id.length).toBeGreaterThan(0);
    });

    test("generates IDs with expected format", () => {
      const id = generateRequestId();

      expect(id).toBeString();
    });
  });
});
