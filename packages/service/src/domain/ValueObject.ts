/**
 * Base class for value objects.
 * Value objects are compared by their value, not by identity.
 */
export abstract class ValueObject<T> {
  protected abstract get value(): T;

  equals(other: ValueObject<T>): boolean {
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }
}
