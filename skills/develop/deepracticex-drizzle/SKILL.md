---
name: deepracticex-drizzle
description: Drizzle ORM driver for cross-runtime SQLite (Bun + Node.js 22+). Use when you need type-safe database queries.
---

Feature: Drizzle ORM driver for cross-runtime SQLite
  @deepracticex/drizzle provides a Drizzle ORM driver built on @deepracticex/sqlite.
  Works on both Bun and Node.js 22+ with the same code.

  Scenario: Install
    Given you need type-safe SQLite queries
    Then install the package with drizzle-orm as peer dependency
      """
      bun add @deepracticex/drizzle @deepracticex/sqlite drizzle-orm
      """

  Scenario: Define a schema
    Given you need to define database tables
    Then use drizzle-orm's schema builders
      """typescript
      import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

      const users = sqliteTable("users", {
        id: integer("id").primaryKey({ autoIncrement: true }),
        name: text("name").notNull(),
        email: text("email"),
      });
      """

  Scenario: Create a drizzle instance
    Given you have a @deepracticex/sqlite database
    Then wrap it with drizzle()
      """typescript
      import { openDatabase } from "@deepracticex/sqlite";
      import { drizzle } from "@deepracticex/drizzle";

      const rawDb = openDatabase("./data/app.db");
      const db = drizzle(rawDb, { schema: { users } });
      """

  Scenario: Insert rows
    Given you need to insert data
    Then use db.insert().values().run()
      """typescript
      db.insert(users).values({ name: "Alice", email: "alice@example.com" }).run();
      db.insert(users).values({ name: "Bob", email: "bob@example.com" }).run();
      """

  Scenario: Select all rows
    Given you need to query multiple rows
    Then use db.select().from().all()
      """typescript
      const allUsers = db.select().from(users).all();
      // [{ id: 1, name: "Alice", email: "alice@example.com" }, ...]
      """

  Scenario: Select with where clause
    Given you need to filter rows
    Then use .where() with drizzle-orm operators
      """typescript
      import { eq } from "drizzle-orm";

      const bob = db.select().from(users).where(eq(users.name, "Bob")).all();
      """

  Scenario: Get single row
    Given you need exactly one row or undefined
    Then use .get() instead of .all()
      """typescript
      const user = db.select().from(users).where(eq(users.id, 1)).get();
      // { id: 1, name: "Alice", ... } or undefined
      """

  Scenario: Update rows
    Given you need to update existing data
    Then use db.update().set().where().run()
      """typescript
      db.update(users)
        .set({ email: "new@example.com" })
        .where(eq(users.name, "Alice"))
        .run();
      """

  Scenario: Delete rows
    Given you need to remove data
    Then use db.delete().where().run()
      """typescript
      db.delete(users).where(eq(users.name, "Bob")).run();
      """

  Scenario: Transactions
    Given you need atomic operations
    Then use db.transaction() with a callback
      """typescript
      db.transaction((tx) => {
        tx.insert(users).values({ name: "Alice" }).run();
        tx.insert(users).values({ name: "Bob" }).run();
        // If callback throws, all changes are rolled back
      });
      """

  Scenario: Enable query logging
    Given you want to see executed SQL
    Then pass logger: true in the config
      """typescript
      const db = drizzle(rawDb, { schema: { users }, logger: true });
      """

  Scenario: Column naming convention
    Given you want automatic case conversion
    Then pass casing in the config
      """typescript
      const db = drizzle(rawDb, { casing: "snake_case" });
      // TypeScript camelCase fields map to snake_case columns
      """

  Scenario: Close the database
    Given you are done with the database
    Then close the underlying @deepracticex/sqlite database
      """typescript
      rawDb.close();
      """
    And the drizzle instance does not own the database lifecycle

  Scenario: Peer dependency requirement
    Given drizzle-orm is a peer dependency
    Then drizzle-orm >= 0.38.0 is required
    And install it alongside @deepracticex/drizzle
