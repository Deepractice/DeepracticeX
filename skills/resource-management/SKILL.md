---
name: resource-management
description: Manage ResourceX resources, register prototypes, and load skills. Use when you need to add, search, distribute, or inspect resources in RoleX, or when you need to register a prototype or load a skill on demand.
---

Feature: ResourceX Concepts
  ResourceX is the resource system that powers RoleX's content management.
  Resources are versioned, typed content bundles stored locally or in a registry.

  Scenario: What is a resource
    Given a resource is a directory containing content and metadata
    Then it has a resource.json manifest defining name, type, tag, and author
    And it contains content files specific to its type (e.g. .feature files, SKILL.md)
    And it is identified by a locator string

  Scenario: Locator formats
    Given a locator is how you reference a resource
    Then it can be a registry identifier — name:tag or author/name:tag
    And it can be a local directory path — ./path/to/resource or /absolute/path
    And it can be a URL — https://github.com/org/repo/tree/main/path
    And when tag is omitted, it defaults to latest

  Scenario: Resource types in RoleX
    Given RoleX registers two resource types with ResourceX
    Then "role" type — individual manifests with .feature files (alias: "individual")
    And "organization" type — organization manifests with .feature files (alias: "org")
    And "skill" type — SKILL.md files loaded via the skill process

  Scenario: resource.json structure
    Given every resource directory must contain a resource.json
    Then the structure is:
      """
      {
        "name": "my-resource",
        "type": "role",
        "tag": "0.1.0",
        "author": "deepractice",
        "description": "What this resource is"
      }
      """
    And name is the resource identifier
    And type determines how the resource is resolved (role, organization, skill)
    And tag is the version string

  Scenario: Storage location
    Given resources are stored locally at ~/.deepractice/resourcex by default
    And the location is configurable via LocalPlatform resourceDir option
    And prototype registrations are stored at ~/.deepractice/rolex/prototype.json

Feature: Resource Loading via use
  Load resources on demand through the unified use entry point.
  The use tool dispatches based on locator format.

  Scenario: use — load a ResourceX resource
    Given you need to load or execute a resource
    When you call use with a regular locator (no ! prefix)
    Then the resource is resolved through ResourceX and its content returned
    And parameters are:
      """
      use("hello-prompt:1.0.0")           // by registry locator
      use("./path/to/resource")            // by local path
      """

  Scenario: skill — load full skill content by locator
    Given a role has a procedure referencing a skill via locator
    When you need the detailed instructions beyond the procedure summary
    Then call skill with the locator from the procedure's Feature description
    And the full SKILL.md content is returned with metadata header
    And this is progressive disclosure layer 2 — on-demand knowledge injection
    And parameters are:
      """
      skill("deepractice/skill-creator")
      skill("https://github.com/Deepractice/DeepracticeX/tree/main/skills/skill-creator")
      """

  Scenario: Progressive disclosure — three layers
    Given RoleX uses progressive disclosure to manage context
    Then layer 1 — procedure: metadata loaded at activate time (role knows what skills exist)
    And layer 2 — skill: full instructions loaded on demand via skill(locator)
    And layer 3 — use: execution of external resources via use(locator)
    And each layer adds detail only when needed, keeping context lean

Feature: Prototype Registration
  Register a ResourceX source as a role or organization prototype.
  Prototypes provide inherited state that merges with an individual's instance state on activation.

  Scenario: What is a prototype
    Given an individual's state has two origins — prototype and instance
    Then prototype state comes from organizational definitions (read-only)
    And instance state is created by the individual through execution (mutable)
    And on activation, both are merged into a virtual combined state

  Scenario: Prototype resource structure for a role
    Given a role prototype is a directory with:
      """
      <role-name>/
      ├── resource.json              (type: "role")
      ├── individual.json            (manifest with id, type, children tree)
      ├── <id>.individual.feature    (persona Gherkin)
      └── <child-id>.<type>.feature  (identity, background, duty, etc.)
      """
    And individual.json defines the tree structure:
      """
      {
        "id": "nuwa",
        "type": "individual",
        "alias": ["nvwa"],
        "children": {
          "identity": {
            "type": "identity",
            "children": {
              "background": { "type": "background" }
            }
          }
        }
      }
      """

  Scenario: Prototype updates
    Given you re-register a prototype with the same id
    Then the source is overwritten — latest registration wins
    And the next activation will load the updated prototype

Feature: Common Workflows
  Typical sequences of operations for resource management.

  Scenario: Register a role prototype from GitHub
    Given you have a role prototype hosted on GitHub
    When you want to use it as a prototype in RoleX
    Then register the prototype source:
      """
      https://github.com/Deepractice/DeepracticeX/tree/main/roles/nuwa
      """
    And then activate the role to verify

  Scenario: Test loading a skill
    Given you want to verify a skill is accessible
    When you call skill with the locator
    Then the full SKILL.md content should be returned
    And example:
      """
      skill("https://github.com/Deepractice/DeepracticeX/tree/main/skills/skill-creator")
      """
