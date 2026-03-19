/**
 * Base class for domain entities.
 * Entities are identified by a unique ID and compared by identity, not by value.
 */
export abstract class Entity<T = string> {
  constructor(public readonly id: T) {}

  equals(other: Entity<T>): boolean {
    return this.id === other.id;
  }
}
