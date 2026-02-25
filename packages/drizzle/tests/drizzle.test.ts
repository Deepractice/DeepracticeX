import { describe, test, expect, afterEach } from "bun:test";
import { openDatabase, type Database } from "@deepracticex/sqlite";
import { drizzle } from "../src";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { eq } from "drizzle-orm";

const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email"),
});

describe("@deepracticex/drizzle", () => {
  let rawDb: Database;

  afterEach(() => {
    if (rawDb) rawDb.close();
  });

  test("creates drizzle instance from commonx database", () => {
    rawDb = openDatabase(":memory:");
    const db = drizzle(rawDb);
    expect(db).toBeDefined();
  });

  test("creates table and inserts rows", () => {
    rawDb = openDatabase(":memory:");
    const db = drizzle(rawDb, { schema: { users } });

    rawDb.exec(
      "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT)",
    );

    db.insert(users).values({ name: "Alice", email: "alice@test.com" }).run();
    db.insert(users).values({ name: "Bob", email: "bob@test.com" }).run();

    const all = db.select().from(users).all();
    expect(all).toHaveLength(2);
    expect(all[0].name).toBe("Alice");
    expect(all[1].name).toBe("Bob");
  });

  test("select with where clause", () => {
    rawDb = openDatabase(":memory:");
    const db = drizzle(rawDb);

    rawDb.exec(
      "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT)",
    );

    db.insert(users).values({ name: "Alice", email: "alice@test.com" }).run();
    db.insert(users).values({ name: "Bob", email: "bob@test.com" }).run();

    const result = db.select().from(users).where(eq(users.name, "Bob")).all();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Bob");
    expect(result[0].email).toBe("bob@test.com");
  });

  test("update rows", () => {
    rawDb = openDatabase(":memory:");
    const db = drizzle(rawDb);

    rawDb.exec(
      "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT)",
    );

    db.insert(users).values({ name: "Alice", email: "old@test.com" }).run();

    db.update(users)
      .set({ email: "new@test.com" })
      .where(eq(users.name, "Alice"))
      .run();

    const result = db
      .select()
      .from(users)
      .where(eq(users.name, "Alice"))
      .get();
    expect(result?.email).toBe("new@test.com");
  });

  test("delete rows", () => {
    rawDb = openDatabase(":memory:");
    const db = drizzle(rawDb);

    rawDb.exec(
      "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT)",
    );

    db.insert(users).values({ name: "Alice" }).run();
    db.insert(users).values({ name: "Bob" }).run();

    db.delete(users).where(eq(users.name, "Alice")).run();

    const all = db.select().from(users).all();
    expect(all).toHaveLength(1);
    expect(all[0].name).toBe("Bob");
  });

  test("get returns single row or undefined", () => {
    rawDb = openDatabase(":memory:");
    const db = drizzle(rawDb);

    rawDb.exec(
      "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT)",
    );

    const empty = db.select().from(users).where(eq(users.id, 999)).get();
    expect(empty).toBeUndefined();

    db.insert(users).values({ name: "Alice" }).run();
    const row = db.select().from(users).where(eq(users.id, 1)).get();
    expect(row?.name).toBe("Alice");
  });

  test("transactions commit on success", () => {
    rawDb = openDatabase(":memory:");
    const db = drizzle(rawDb);

    rawDb.exec(
      "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT)",
    );

    db.transaction((tx) => {
      tx.insert(users).values({ name: "Alice" }).run();
      tx.insert(users).values({ name: "Bob" }).run();
    });

    const all = db.select().from(users).all();
    expect(all).toHaveLength(2);
  });

  test("transactions rollback on error", () => {
    rawDb = openDatabase(":memory:");
    const db = drizzle(rawDb);

    rawDb.exec(
      "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT)",
    );

    try {
      db.transaction((tx) => {
        tx.insert(users).values({ name: "Alice" }).run();
        throw new Error("rollback!");
      });
    } catch {
      // expected
    }

    const all = db.select().from(users).all();
    expect(all).toHaveLength(0);
  });
});
