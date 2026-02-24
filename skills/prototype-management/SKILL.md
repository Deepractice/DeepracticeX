---
name: prototype-management
description: Manage prototypes — summon, banish, list. Use when you need to register role/organization templates from ResourceX sources, remove them, or inspect the registry.
---

Feature: Prototype Lifecycle
  Manage prototypes in the RoleX world.
  A prototype is a pre-configured State template (identity, duties, procedures, etc.)
  that merges with an individual's runtime state on activation.

  Scenario: summon — register a prototype from a source
    Given you have a ResourceX source (local path or locator) containing a role/organization template
    When you call use with !prototype.summon
    Then the source is ingested to extract its id
    And the id → source mapping is stored in the prototype registry
    And on activate, the prototype state merges with the instance state
    And parameters are:
      """
      use("!prototype.summon", {
        source: "/path/to/DeepracticeX/roles/nuwa"
      })
      """

  Scenario: summon — what happens on activate after summoning
    Given a prototype "nuwa" has been summoned
    When activate("nuwa") is called
    Then if the individual does not exist in runtime, it is auto-born
    And the prototype state provides the base (identity, procedures, etc.)
    And the instance state provides the overlay (goals, plans, tasks, etc.)
    And the merged state is returned

  Scenario: banish — unregister a prototype
    Given a prototype is no longer needed
    When you call use with !prototype.banish
    Then the id is removed from the prototype registry
    And future activations will no longer merge this prototype
    And parameters are:
      """
      use("!prototype.banish", { id: "nuwa" })
      """

  Scenario: list — list all registered prototypes
    Given you want to see what prototypes are available
    When you call use with !prototype.list
    Then the id → source mapping of all registered prototypes is returned
    And parameters are:
      """
      use("!prototype.list")
      """

Feature: Prototype Binding Rules
  How prototypes bind to runtime individuals.

  Scenario: Binding is by id
    Given a prototype has id "nuwa" (extracted from its manifest)
    And an individual is born with id "nuwa"
    Then on activate, the prototype state is resolved by the individual's id
    And this means: one prototype binds to exactly one individual

  Scenario: Auto-born on activate
    Given a prototype "nuwa" is registered but no runtime individual exists
    When activate("nuwa") is called
    Then the individual is automatically born into the runtime
    And the prototype state merges with the fresh instance
    And the caller does not need to call born separately

  Scenario: No prototype is also valid
    Given an individual "sean" exists in runtime but has no registered prototype
    When activate("sean") is called
    Then the activation proceeds normally with instance state only
    And no merge happens — the individual is fully instance-driven

Feature: Common Workflows

  Scenario: First-time setup — summon and activate
    Given a new role template is available at a ResourceX source
    Then follow this sequence:
      """
      1. use("!prototype.summon", { source: "/path/to/roles/nuwa" })
      2. activate("nuwa")
      """
    And step 1 registers the prototype
    And step 2 auto-borns the individual and merges the prototype

  Scenario: Inspect and clean up prototypes
    Given you want to audit the prototype registry
    Then:
      """
      1. use("!prototype.list")           — see all registered prototypes
      2. use("!prototype.banish", { id: "old-role" })  — remove stale entries
      """
