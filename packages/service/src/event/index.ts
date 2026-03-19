/**
 * Platform event contracts.
 * Defines the shape of events flowing through the platform queue.
 */

/**
 * Base event interface — all platform events must conform to this shape.
 */
export interface PlatformEvent<TType extends string = string, TPayload = Record<string, unknown>> {
  type: TType;
  payload: TPayload;
  timestamp: number;
  traceId?: string;
}

/**
 * Helper to create a typed platform event.
 */
export function createEvent<TType extends string, TPayload>(
  type: TType,
  payload: TPayload,
  traceId?: string
): PlatformEvent<TType, TPayload> {
  return { type, payload, timestamp: Date.now(), traceId };
}

// Well-known event types
export interface UserCreatedPayload {
  userId: string;
  name: string;
  email: string;
}

export type UserCreatedEvent = PlatformEvent<"user.created", UserCreatedPayload>;
