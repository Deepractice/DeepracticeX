import { describe, test, expect, afterEach } from "bun:test";
import { openDatabase, type Database } from "../src";

describe("sqlite", () => {
  let db: Database;

  afterEach(() => {
    if (db) {
      db.close();
    }
  });

  describe("openDatabase", () => {
    test("opens in-memory database", () => {
      db = openDatabase(":memory:");

      expect(db).toBeDefined();
      expect(db.exec).toBeFunction();
      expect(db.prepare).toBeFunction();
      expect(db.close).toBeFunction();
    });

    test("executes SQL statements", () => {
      db = openDatabase(":memory:");

      expect(() => {
        db.exec("CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)");
      }).not.toThrow();
    });
  });

  describe("prepare", () => {
    test("prepares and runs insert statement", () => {
      db = openDatabase(":memory:");
      db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");

      const stmt = db.prepare("INSERT INTO users (name) VALUES (?)");
      const result = stmt.run("Alice");

      expect(result.changes).toBe(1);
      expect(result.lastInsertRowid).toBe(1);
    });

    test("prepares and gets single row", () => {
      db = openDatabase(":memory:");
      db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
      db.prepare("INSERT INTO users (name) VALUES (?)").run("Alice");

      const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
      const row = stmt.get(1) as { id: number; name: string };

      expect(row).toBeDefined();
      expect(row.id).toBe(1);
      expect(row.name).toBe("Alice");
    });

    test("prepares and gets all rows", () => {
      db = openDatabase(":memory:");
      db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
      db.prepare("INSERT INTO users (name) VALUES (?)").run("Alice");
      db.prepare("INSERT INTO users (name) VALUES (?)").run("Bob");
      db.prepare("INSERT INTO users (name) VALUES (?)").run("Charlie");

      const stmt = db.prepare("SELECT * FROM users ORDER BY id");
      const rows = stmt.all() as { id: number; name: string }[];

      expect(rows).toHaveLength(3);
      expect(rows[0].name).toBe("Alice");
      expect(rows[1].name).toBe("Bob");
      expect(rows[2].name).toBe("Charlie");
    });

    test("returns null/undefined for non-existent row", () => {
      db = openDatabase(":memory:");
      db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");

      const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
      const row = stmt.get(999);

      // SQLite returns null for non-existent rows
      expect(row == null).toBe(true);
    });

    test("values returns rows as arrays", () => {
      db = openDatabase(":memory:");
      db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
      db.prepare("INSERT INTO users (name) VALUES (?)").run("Alice");
      db.prepare("INSERT INTO users (name) VALUES (?)").run("Bob");

      const stmt = db.prepare("SELECT * FROM users ORDER BY id");
      const rows = stmt.values();

      expect(rows).toHaveLength(2);
      expect(rows[0]).toEqual([1, "Alice"]);
      expect(rows[1]).toEqual([2, "Bob"]);
    });

    test("returns empty array for no matching rows", () => {
      db = openDatabase(":memory:");
      db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");

      const stmt = db.prepare("SELECT * FROM users");
      const rows = stmt.all();

      expect(rows).toBeArray();
      expect(rows).toHaveLength(0);
    });
  });

  describe("transactions", () => {
    test("supports multiple operations", () => {
      db = openDatabase(":memory:");
      db.exec("CREATE TABLE accounts (id INTEGER PRIMARY KEY, balance INTEGER)");
      db.prepare("INSERT INTO accounts (balance) VALUES (?)").run(100);
      db.prepare("INSERT INTO accounts (balance) VALUES (?)").run(50);

      // Transfer
      db.prepare("UPDATE accounts SET balance = balance - ? WHERE id = ?").run(30, 1);
      db.prepare("UPDATE accounts SET balance = balance + ? WHERE id = ?").run(30, 2);

      const rows = db.prepare("SELECT * FROM accounts ORDER BY id").all() as {
        id: number;
        balance: number;
      }[];

      expect(rows[0].balance).toBe(70);
      expect(rows[1].balance).toBe(80);
    });
  });
});
