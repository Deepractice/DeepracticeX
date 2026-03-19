import type { Entity } from "../domain/Entity";

/**
 * Base repository interface for domain entities.
 */
export interface Repository<T extends Entity<string>> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

export { DrizzleRepository } from "./DrizzleRepository";
