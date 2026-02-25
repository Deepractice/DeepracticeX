---
name: deepracticex-sqlite
description: Unified SQLite abstraction for Bun and Node.js 22+. Use when you need cross-runtime SQLite database access.
---

Feature: Cross-runtime SQLite database access
  @deepracticex/sqlite provides a unified SQLite interface that works on both
  Bun (bun:sqlite) and Node.js 22+ (node:sqlite). Runtime is auto-detected.

  Scenario: Install
    Given you need SQLite in a cross-runtime project
    Then install the package
      """
      bun add @deepracticex/sqlite
      """

  Scenario: Open a database
    Given you need a SQLite database connection
    Then use openDatabase with a file path or ":memory:"
      """typescript
      import { openDatabase } from "@deepracticex/sqlite";

      // In-memory database
      const db = openDatabase(":memory:");

      // File-based database (parent directories are created automatically)
      const db = openDatabase("./data/app.db");
      """

  Scenario: Execute raw SQL
    Given you need to run DDL or statements without return values
    Then use db.exec()
      """typescript
      db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT)");
      db.exec("PRAGMA journal_mode=WAL");
      """

  Scenario: Prepared statements — insert
    Given you need to insert data
    Then use db.prepare().run()
      """typescript
      const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
      const result = stmt.run("Alice", "alice@example.com");
      // result.changes: number of rows affected
      // result.lastInsertRowid: ID of inserted row
      """

  Scenario: Prepared statements — query single row
    Given you need one row
    Then use stmt.get() which returns the row object or undefined
      """typescript
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(1);
      // { id: 1, name: "Alice", email: "alice@example.com" } or undefined
      """

  Scenario: Prepared statements — query all rows
    Given you need multiple rows
    Then use stmt.all() which returns an array of row objects
      """typescript
      const users = db.prepare("SELECT * FROM users").all();
      // [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]
      """

  Scenario: Prepared statements — query as arrays
    Given you need rows as column value arrays (used by Drizzle ORM internally)
    Then use stmt.values() which returns unknown[][]
      """typescript
      const rows = db.prepare("SELECT id, name FROM users").values();
      // [[1, "Alice"], [2, "Bob"]]
      """

  Scenario: Close the database
    Given you are done with the database
    Then call db.close()
      """typescript
      db.close();
      """

  Scenario: TypeScript types
    Given you need to type database objects
    Then import the interfaces
      """typescript
      import { openDatabase, type Database, type Statement, type RunResult } from "@deepracticex/sqlite";
      """
    And Database has: exec(sql), prepare(sql), close()
    And Statement has: run(...params), get(...params), all(...params), values(...params)
    And RunResult has: changes (number), lastInsertRowid (number | bigint)

  Scenario: Runtime requirements
    Given the package auto-detects the runtime
    Then Bun uses bun:sqlite (built-in, no extra install)
    And Node.js 22+ uses node:sqlite (built-in, no extra install)
    And older Node.js versions will throw "No SQLite runtime available"
