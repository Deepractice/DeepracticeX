---
name: position-management
description: Manage positions — establish, charge, require, abolish, appoint, dismiss. Use when you need to create positions, assign duties, declare required skills, manage appointments, or abolish positions.
---

Feature: Position Lifecycle
  Manage the full lifecycle of positions in the RoleX world.
  Positions are independent entities that can be charged with duties
  and linked to individuals via appointment.

  Scenario: establish — create a position
    Given you want to define a new role or position
    When you call use with !position.establish
    Then a new position entity is created under society
    And it can be charged with duties and individuals can be appointed to it
    And parameters are:
      """
      use("!position.establish", {
        content: "Feature: Backend Architect\n  Responsible for system design and API architecture",
        id: "architect",
        alias: ["backend-architect"]    // optional
      })
      """

  Scenario: establish — position writing guidelines
    Given the position Feature describes a role
    Then the Feature title names the position
    And the description captures responsibilities, scope, and expectations
    And Scenarios are optional — use them for distinct aspects of the role

  Scenario: charge — assign a duty to a position
    Given a position needs specific responsibilities defined
    When you call use with !position.charge
    Then a duty node is created under the position
    And individuals appointed to this position inherit the duty
    And parameters are:
      """
      use("!position.charge", {
        position: "architect",
        content: "Feature: Design systems\n  Scenario: API design\n    Given a new service is needed\n    Then design the API contract first",
        id: "design-systems"    // optional
      })
      """

  Scenario: require — declare a required skill for a position
    Given a position requires individuals to have specific skills
    When you call use with !position.require
    Then a procedure node is created under the position
    And individuals appointed to this position will automatically receive the skill
    And upserts by id — if the same id exists, it replaces the old one
    And parameters are:
      """
      use("!position.require", {
        position: "architect",
        content: "Feature: System Design\n  Scenario: When to apply\n    Given a new service is planned\n    Then design the architecture before coding",
        id: "system-design"    // optional, enables upsert
      })
      """

  Scenario: abolish — abolish a position
    Given a position is no longer needed
    When you call use with !position.abolish
    Then the position is archived to past
    And all duties and appointments are removed
    And parameters are:
      """
      use("!position.abolish", { position: "architect" })
      """

Feature: Appointment
  Manage who holds a position.
  Appointment is a link between position and individual.

  Scenario: appoint — assign an individual to a position
    Given an individual should hold a position
    When you call use with !position.appoint
    Then an appointment link is created between the position and the individual
    And the individual inherits the position's duties on activation
    And all required skills (from require) are automatically trained into the individual
    And existing skills with the same id are replaced (upsert)
    And parameters are:
      """
      use("!position.appoint", { position: "architect", individual: "sean" })
      """

  Scenario: dismiss — remove an individual from a position
    Given an individual should no longer hold a position
    When you call use with !position.dismiss
    Then the appointment link is removed
    And parameters are:
      """
      use("!position.dismiss", { position: "architect", individual: "sean" })
      """

Feature: Common Workflows

  Scenario: Create a position with duties and required skills
    Given you need a fully defined position
    Then follow this sequence:
      """
      1. use("!position.establish", { id: "architect", content: "Feature: Architect\n  ..." })
      2. use("!position.charge", { position: "architect", content: "Feature: Design systems\n  ...", id: "design-systems" })
      3. use("!position.charge", { position: "architect", content: "Feature: Review PRs\n  ...", id: "review-prs" })
      4. use("!position.require", { position: "architect", content: "Feature: System Design\n  ...", id: "system-design" })
      """

  Scenario: Full organization setup with positions
    Given you need an organization with positions and members
    Then combine with organization-management:
      """
      1. use("!org.found", { id: "dp", content: "Feature: Deepractice" })
      2. use("!position.establish", { id: "architect", content: "Feature: Architect" })
      3. use("!position.charge", { position: "architect", content: "Feature: Design systems", id: "design-systems" })
      4. use("!position.require", { position: "architect", content: "Feature: System Design\n  ...", id: "system-design" })
      5. use("!individual.born", { id: "sean", content: "Feature: Sean" })
      6. use("!org.hire", { org: "dp", individual: "sean" })
      7. use("!position.appoint", { position: "architect", individual: "sean" })
      """
    And step 7 appoint will auto-train the required skill "system-design" into sean

  Scenario: Position is independent of organization
    Given position is a top-level entity, not a child of organization
    Then a position can exist without any organization
    And an individual can hold a position without being hired into an organization
    And membership (org) and appointment (position) are separate concerns
