import { readMigrationFiles, type MigrationConfig } from "drizzle-orm/migrator";
import type { CommonXDatabase } from "./driver.js";

export function migrate<TSchema extends Record<string, unknown>>(
  db: CommonXDatabase<TSchema>,
  config: MigrationConfig,
): void {
  const migrations = readMigrationFiles(config);
  (db as any).dialect.migrate(migrations, (db as any).session, config);
}
