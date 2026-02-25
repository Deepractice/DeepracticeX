import type { Database, Statement } from "@deepracticex/sqlite";
import { entityKind } from "drizzle-orm/entity";
import { NoopLogger, type Logger } from "drizzle-orm/logger";
import type { RelationalSchemaConfig, TablesRelationalConfig } from "drizzle-orm/relations";
import { type Query, fillPlaceholders, sql } from "drizzle-orm/sql/sql";
import type { SQLiteSyncDialect } from "drizzle-orm/sqlite-core/dialect";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import type {
  SelectedFieldsOrdered,
} from "drizzle-orm/sqlite-core/query-builders/select.types";
import type {
  PreparedQueryConfig as PreparedQueryConfigBase,
  SQLiteExecuteMethod,
  SQLiteTransactionConfig,
} from "drizzle-orm/sqlite-core/session";
import {
  SQLitePreparedQuery as PreparedQueryBase,
  SQLiteSession,
} from "drizzle-orm/sqlite-core/session";

// Runtime-only import — not exported from d.ts but exists in JS
// @ts-ignore: internal drizzle utility
import { mapResultRow } from "drizzle-orm/utils";

export interface CommonXSessionOptions {
  logger?: Logger;
}

type PreparedQueryConfig = Omit<PreparedQueryConfigBase, "statement" | "run">;

export class CommonXSession<
  TFullSchema extends Record<string, unknown>,
  TSchema extends TablesRelationalConfig,
> extends SQLiteSession<"sync", void, TFullSchema, TSchema> {
  static readonly [entityKind] = "CommonXSession";

  private logger: Logger;

  constructor(
    private client: Database,
    dialect: SQLiteSyncDialect,
    private schema: RelationalSchemaConfig<TSchema> | undefined,
    options: CommonXSessionOptions = {},
  ) {
    super(dialect);
    this.logger = options.logger ?? new NoopLogger();
  }

  exec(query: string): void {
    this.client.exec(query);
  }

  prepareQuery<T extends Omit<PreparedQueryConfig, "run">>(
    query: Query,
    fields: SelectedFieldsOrdered | undefined,
    executeMethod: SQLiteExecuteMethod,
    isResponseInArrayMode: boolean,
    customResultMapper?: (rows: unknown[][]) => unknown,
  ): CommonXPreparedQuery<T> {
    const stmt = this.client.prepare(query.sql);
    return new CommonXPreparedQuery(
      stmt,
      query,
      this.logger,
      fields,
      executeMethod,
      isResponseInArrayMode,
      customResultMapper,
    );
  }

  transaction<T>(
    transaction: (tx: CommonXTransaction<TFullSchema, TSchema>) => T,
    config: SQLiteTransactionConfig = {},
  ): T {
    const behavior = config.behavior ?? "deferred";
    const tx = new CommonXTransaction<TFullSchema, TSchema>(
      "sync",
      (this as any).dialect,
      this,
      this.schema,
    );
    this.exec(`begin ${behavior}`);
    try {
      const result = transaction(tx);
      this.exec("commit");
      return result;
    } catch (err) {
      this.exec("rollback");
      throw err;
    }
  }
}

export class CommonXTransaction<
  TFullSchema extends Record<string, unknown>,
  TSchema extends TablesRelationalConfig,
> extends SQLiteTransaction<"sync", void, TFullSchema, TSchema> {
  static readonly [entityKind] = "CommonXTransaction";

  transaction<T>(
    transaction: (tx: CommonXTransaction<TFullSchema, TSchema>) => T,
  ): T {
    const savepointName = `sp${this.nestedIndex}`;
    const tx = new CommonXTransaction<TFullSchema, TSchema>(
      "sync",
      (this as any).dialect,
      (this as any).session,
      this.schema,
      this.nestedIndex + 1,
    );
    (this as any).session.run(sql.raw(`savepoint ${savepointName}`));
    try {
      const result = transaction(tx);
      (this as any).session.run(sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      (this as any).session.run(sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
}

export class CommonXPreparedQuery<
  T extends PreparedQueryConfig = PreparedQueryConfig,
> extends PreparedQueryBase<{
  type: "sync";
  run: void;
  all: T["all"];
  get: T["get"];
  values: T["values"];
  execute: T["execute"];
}> {
  static readonly [entityKind] = "CommonXPreparedQuery";

  constructor(
    private stmt: Statement,
    query: Query,
    private logger: Logger,
    private fields: SelectedFieldsOrdered | undefined,
    executeMethod: SQLiteExecuteMethod,
    private _isResponseInArrayMode: boolean,
    private customResultMapper?: (rows: unknown[][]) => unknown,
  ) {
    super("sync", executeMethod, query);
  }

  run(placeholderValues?: Record<string, unknown>): void {
    const params = fillPlaceholders(
      this.query.params,
      placeholderValues ?? {},
    );
    this.logger.logQuery(this.query.sql, params);
    this.stmt.run(...params);
  }

  all(placeholderValues?: Record<string, unknown>): T["all"] {
    const { fields, query, logger, stmt, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = fillPlaceholders(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return stmt.all(...params) as T["all"];
    }
    const rows = this.values(placeholderValues) as unknown[][];
    if (customResultMapper) {
      return customResultMapper(rows) as T["all"];
    }
    return rows.map((row) =>
      mapResultRow(fields!, row, (this as any).joinsNotNullableMap),
    ) as T["all"];
  }

  get(placeholderValues?: Record<string, unknown>): T["get"] {
    const params = fillPlaceholders(
      this.query.params,
      placeholderValues ?? {},
    );
    this.logger.logQuery(this.query.sql, params);
    const row = this.stmt.values(...params)[0];
    if (!row) {
      return undefined as T["get"];
    }
    const { fields, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      return row as T["get"];
    }
    if (customResultMapper) {
      return customResultMapper([row]) as T["get"];
    }
    return mapResultRow(fields!, row, (this as any).joinsNotNullableMap) as T["get"];
  }

  values(placeholderValues?: Record<string, unknown>): T["values"] {
    const params = fillPlaceholders(
      this.query.params,
      placeholderValues ?? {},
    );
    this.logger.logQuery(this.query.sql, params);
    return this.stmt.values(...params) as T["values"];
  }

  /** @internal */
  isResponseInArrayMode(): boolean {
    return this._isResponseInArrayMode;
  }
}
