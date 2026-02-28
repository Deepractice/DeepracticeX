import type * as messages from "@cucumber/messages";

export class DataTable {
  private readonly rawTable: string[][];

  constructor(sourceTable: messages.PickleTable | string[][]) {
    if (Array.isArray(sourceTable)) {
      this.rawTable = sourceTable;
    } else {
      this.rawTable = sourceTable.rows.map((row) =>
        row.cells.map((cell) => cell.value)
      );
    }
  }

  raw(): string[][] {
    return this.rawTable.map((row) => [...row]);
  }

  rows(): string[][] {
    return this.rawTable.slice(1).map((row) => [...row]);
  }

  hashes(): Record<string, string>[] {
    const headers = this.rawTable[0];
    return this.rawTable.slice(1).map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
  }

  rowsHash(): Record<string, string> {
    const obj: Record<string, string> = {};
    for (const row of this.rawTable) {
      obj[row[0]] = row[1];
    }
    return obj;
  }

  transpose(): DataTable {
    const transposed: string[][] = [];
    const rows = this.rawTable;
    if (rows.length === 0) return new DataTable([]);
    for (let col = 0; col < rows[0].length; col++) {
      transposed.push(rows.map((row) => row[col]));
    }
    return new DataTable(transposed);
  }
}
