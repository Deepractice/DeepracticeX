---
name: organization-management
description: Manage organizations — found, charter, dissolve, hire, fire. Use when you need to create organizations, define their mission, manage membership, or dissolve them.
---

Feature: Organization Lifecycle
  Manage the full lifecycle of organizations in the RoleX world.
  Organizations group individuals via membership and can have a charter.

  Scenario: found — create an organization
    Given you want to create a new organization
    When you call use with !org.found
    Then a new organization node is created under society
    And individuals can be hired into it
    And a charter can be defined for it
    And parameters are:
      """
      use("!org.found", {
        content: "Feature: Deepractice\n  An AI agent framework company",
        id: "dp",
        alias: ["deepractice"]    // optional
      })
      """

  Scenario: found — organization writing guidelines
    Given the organization Feature describes the group's purpose
    Then the Feature title names the organization
    And the description captures mission, domain, and scope
    And Scenarios are optional — use them for distinct organizational concerns

  Scenario: charter — define the organization's mission
    Given an organization needs a formal mission and governance
    When you call use with !org.charter
    Then the charter is stored under the organization
    And parameters are:
      """
      use("!org.charter", {
        org: "dp",
        content: "Feature: Build great AI\n  Scenario: Mission\n    Given we believe AI agents need identity\n    Then we build frameworks for role-based agents"
      })
      """

  Scenario: dissolve — dissolve an organization
    Given an organization is no longer needed
    When you call use with !org.dissolve
    Then the organization is archived to past
    And parameters are:
      """
      use("!org.dissolve", { org: "dp" })
      """

Feature: Membership
  Manage who belongs to an organization.
  Membership is a link between organization and individual.

  Scenario: hire — add a member
    Given an individual should join an organization
    When you call use with !org.hire
    Then a membership link is created between the organization and the individual
    And the individual can then be appointed to positions
    And parameters are:
      """
      use("!org.hire", { org: "dp", individual: "sean" })
      """

  Scenario: fire — remove a member
    Given an individual should leave an organization
    When you call use with !org.fire
    Then the membership link is removed
    And parameters are:
      """
      use("!org.fire", { org: "dp", individual: "sean" })
      """

Feature: Common Workflows

  Scenario: Set up a complete organization
    Given you need an organization with charter and members
    Then follow this sequence:
      """
      1. use("!org.found", { id: "dp", content: "Feature: Deepractice\n  ..." })
      2. use("!org.charter", { org: "dp", content: "Feature: ...\n  ..." })
      3. use("!org.hire", { org: "dp", individual: "sean" })
      """

  Scenario: Organization with positions
    Given you need members with specific roles
    Then combine with position-management:
      """
      1. use("!org.found", { id: "dp", content: "Feature: Deepractice" })
      2. use("!position.establish", { id: "architect", content: "Feature: Architect" })
      3. use("!org.hire", { org: "dp", individual: "sean" })
      4. use("!position.appoint", { position: "architect", individual: "sean" })
      """
