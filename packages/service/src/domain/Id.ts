/**
 * ID generation and validation utilities.
 * Format: {prefix}_{timestamp36}_{random}
 */
export class Id {
  static generate(prefix: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `${prefix}_${timestamp}_${random}`;
  }

  static isValid(id: string, prefix: string): boolean {
    return id.startsWith(`${prefix}_`);
  }
}
