import type { Database } from "@deepracticex/sqlite";
import { entityKind } from "drizzle-orm/entity";
import { DefaultLogger } from "drizzle-orm/logger";
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig,
} from "drizzle-orm/relations";
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core/db";
import { SQLiteSyncDialect } from "drizzle-orm/sqlite-core/dialect";
import { CommonXSession, type CommonXSessionOptions } from "./session.js";

export class CommonXDatabase<
  TSchema extends Record<string, unknown> = Record<string, never>,
> extends BaseSQLiteDatabase<"sync", void, TSchema> {
  static readonly [entityKind] = "CommonXDatabase";
}

export interface DrizzleConfig<
  TSchema extends Record<string, unknown> = Record<string, never>,
> {
  schema?: TSchema;
  logger?: boolean | CommonXSessionOptions["logger"];
  casing?: "snake_case" | "camelCase";
}

export function drizzle<
  TSchema extends Record<string, unknown> = Record<string, never>,
>(client: Database, config: DrizzleConfig<TSchema> = {}): CommonXDatabase<TSchema> {
  const dialect = new SQLiteSyncDialect({ casing: config.casing });

  let logger: CommonXSessionOptions["logger"];
  if (config.logger === true) {
    logger = new DefaultLogger();
  } else if (config.logger !== false && config.logger !== undefined) {
    logger = config.logger;
  }

  let schema: any;
  if (config.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config.schema,
      createTableRelationsHelpers,
    );
    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap,
    };
  }

  const session = new CommonXSession(client, dialect, schema, { logger });
  const db = new CommonXDatabase("sync", dialect, session, schema) as CommonXDatabase<TSchema>;
  (db as any).$client = client;
  return db;
}
