---
name: deepracticex-id
description: ID generation utilities. Use when you need unique timestamped IDs with prefixes.
---

Feature: ID generation utilities
  @deepracticex/id provides simple, unique ID generation with timestamp + random suffix.
  Format: `{prefix}_{timestamp}_{random}`

  Scenario: Install
    Given you need ID generation
    Then install the package
      """
      bun add @deepracticex/id
      """

  Scenario: Generate a prefixed ID
    Given you need a unique ID with a custom prefix
    Then use generateId with a prefix string
      """typescript
      import { generateId } from "@deepracticex/id";

      const msgId = generateId("msg");       // "msg_1704067200000_a1b2c3d"
      const agentId = generateId("agent");   // "agent_1704067200000_x7y8z9a"
      const sessionId = generateId("sess");  // "sess_1704067200000_k3m4n5p"
      """

  Scenario: Generate a request ID
    Given you need a request/response correlation ID
    Then use generateRequestId which uses "req" as prefix
      """typescript
      import { generateRequestId } from "@deepracticex/id";

      const reqId = generateRequestId();  // "req_1704067200000_a1b2c3"
      """

  Scenario: ID format details
    Given the IDs follow the format `{prefix}_{timestamp}_{random}`
    Then timestamp is Date.now() in milliseconds
    And random is a base-36 string (6-7 chars)
    And IDs are unique but not cryptographically secure
    And suitable for correlation, logging, and database keys
