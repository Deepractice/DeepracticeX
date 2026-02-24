---
name: prototype-authoring
description: Guide for creating role and organization prototype resources from scratch. Use when you need to create a new prototype that can be summoned and activated, without knowing RoleX storage internals.
---

Feature: Prototype Resource Structure
  A prototype is a directory containing three types of files.
  Together they define a reusable role or organization template.

  Scenario: Directory layout
    Given you are creating a prototype for a role called "designer"
    Then the directory structure is:
      """
      designer/
      ├── resource.json                        — Resource metadata
      ├── individual.json                      — State tree manifest
      ├── designer.individual.feature          — Root node content
      ├── background.background.feature        — Identity child content
      └── coding-standards.principle.feature   — Knowledge content
      """
    And every prototype needs exactly one resource.json and one manifest
    And feature files are optional — nodes without them have no content

  Scenario: Role vs Organization
    Given prototypes can be roles (individuals) or organizations
    When creating a role prototype
    Then the manifest file is individual.json and the root type is "individual"
    When creating an organization prototype
    Then the manifest file is organization.json and the root type is "organization"

Feature: resource.json — Resource Metadata
  Declares the resource for the ResourceX system.
  This file tells ResourceX how to identify and categorize the prototype.

  Scenario: Required fields
    Given you are writing resource.json
    Then it must contain:
      """
      {
        "name": "<prototype-id>",
        "type": "role",
        "tag": "0.1.0",
        "author": "<author-name>",
        "description": "<one-line description>"
      }
      """
    And name must match the id in the manifest
    And type is "role" for individuals, "organization" for organizations
    And tag follows semver

Feature: individual.json — State Tree Manifest
  Defines the tree structure of the prototype.
  Each key in children becomes a node; its type determines the structure kind.

  Scenario: Manifest structure
    Given the manifest declares the full state tree
    Then the format is:
      """
      {
        "id": "<prototype-id>",
        "type": "individual",
        "alias": ["optional", "display names"],
        "children": {
          "<child-id>": {
            "type": "<structure-type>",
            "children": {
              "<grandchild-id>": {
                "type": "<structure-type>"
              }
            }
          }
        }
      }
      """
    And id is the unique identifier used by activate and summon
    And alias is optional — alternative names for the role
    And children is a nested object where keys are node ids

  Scenario: Available structure types
    Given the RoleX core defines these structure types
    Then use "identity" for the role's identity container
    And use "background" as a child of identity for background information
    And use "principle" for transferable knowledge (general rules)
    And use "procedure" for skill metadata (references to SKILL.md via locator)
    And use "goal" for long-term objectives
    And use "duty" for responsibilities inherited from positions

  Scenario: Identity is the standard root child
    Given every individual should have an identity
    Then always include an identity child:
      """
      "children": {
        "identity": {
          "type": "identity",
          "children": {
            "background": {
              "type": "background"
            }
          }
        }
      }
      """
    And background under identity describes who the role is

  Scenario: Adding procedures (skills)
    Given the role needs operational capabilities
    Then add procedure nodes as direct children of the individual:
      """
      "children": {
        "identity": { "type": "identity" },
        "my-skill": {
          "type": "procedure"
        }
      }
      """
    And the procedure id (key) should match the skill name
    And the feature file for the procedure contains the locator and summary

  Scenario: Adding principles (knowledge)
    Given the role has guiding principles
    Then add principle nodes as direct children of the individual:
      """
      "children": {
        "identity": { "type": "identity" },
        "always-test-first": {
          "type": "principle"
        }
      }
      """

Feature: Feature Files — Node Content
  Each node in the manifest can have a corresponding .feature file.
  The file provides the Gherkin content that becomes the node's information.

  Scenario: File naming convention
    Given a node has id "background" and type "background"
    Then its feature file is named: background.background.feature
    And the pattern is: <node-id>.<node-type>.feature
    And the root node uses: <prototype-id>.<root-type>.feature

  Scenario: Root node feature file
    Given the prototype id is "designer" and root type is "individual"
    Then the root feature file is: designer.individual.feature
    And it describes who the role is at the highest level:
      """
      Feature: Designer — a UI/UX design specialist
        Creates user interfaces with attention to usability and aesthetics.

        Scenario: Core competencies
          Given this role specializes in visual design
          Then it can create wireframes, mockups, and prototypes
          And it follows design system principles
      """

  Scenario: Procedure feature file
    Given a procedure node has id "my-skill" and type "procedure"
    Then its feature file is: my-skill.procedure.feature
    And the Feature description line must be the ResourceX locator:
      """
      Feature: My Skill
        https://github.com/org/repo/tree/main/skills/my-skill

        Scenario: When to use this skill
          Given I need to perform specific operations
          Then load this skill for detailed instructions
      """
    And the locator points to the directory containing SKILL.md

  Scenario: Nodes without feature files
    Given a node exists in the manifest but has no feature file
    Then the node is created with empty information
    And this is valid — not every node needs content

Feature: Complete Example — Creating a Developer Role
  Step-by-step walkthrough of creating a prototype from scratch.

  Scenario: Step 1 — Create the directory
    Given you want to create a "backend-dev" prototype
    Then create the directory with all files:
      """
      backend-dev/
      ├── resource.json
      ├── individual.json
      ├── backend-dev.individual.feature
      ├── background.background.feature
      ├── tdd-first.principle.feature
      └── code-review.procedure.feature
      """

  Scenario: Step 2 — Write resource.json
    Given the prototype metadata:
      """
      {
        "name": "backend-dev",
        "type": "role",
        "tag": "0.1.0",
        "author": "your-name",
        "description": "Backend developer role with TDD practices"
      }
      """

  Scenario: Step 3 — Write individual.json
    Given the state tree:
      """
      {
        "id": "backend-dev",
        "type": "individual",
        "alias": ["Backend Developer"],
        "children": {
          "identity": {
            "type": "identity",
            "children": {
              "background": {
                "type": "background"
              }
            }
          },
          "tdd-first": {
            "type": "principle"
          },
          "code-review": {
            "type": "procedure"
          }
        }
      }
      """

  Scenario: Step 4 — Write feature files
    Given the root file backend-dev.individual.feature:
      """
      Feature: Backend Developer
        A server-side engineer focused on API design and data modeling.

        Scenario: Technical focus
          Given this role builds backend systems
          Then it designs REST and GraphQL APIs
          And it models data with relational and document databases
      """
    And the background file background.background.feature:
      """
      Feature: Backend Developer Background
        Experienced in TypeScript, Node.js, and distributed systems.

        Scenario: Technology stack
          Given the primary language is TypeScript
          Then the runtime is Node.js or Bun
          And databases include PostgreSQL and Redis
      """
    And the principle file tdd-first.principle.feature:
      """
      Feature: Always write tests before implementation
        Tests define the contract. Code fulfills it.

        Scenario: New feature development
          Given a new feature is requested
          When starting implementation
          Then write failing tests first
          And implement until tests pass
      """
    And the procedure file code-review.procedure.feature:
      """
      Feature: Code Review
        https://github.com/org/repo/tree/main/skills/code-review

        Scenario: When to use this skill
          Given code needs to be reviewed
          Then load this skill for review guidelines and checklists
      """

  Scenario: Step 5 — Register and activate
    Given all files are written
    Then summon the prototype:
      """
      !prototype.summon with source pointing to the backend-dev directory
      """
    And activate it:
      """
      activate("backend-dev")
      """
    And the prototype state merges with the instance on activation

Feature: Key Rules
  Important constraints to remember when authoring prototypes.

  Scenario: Name consistency
    Given the prototype id appears in multiple places
    Then resource.json name must equal individual.json id
    And the root feature file must be named <id>.<type>.feature
    And all three must match exactly

  Scenario: Feature file names must match manifest
    Given a child node has key "my-node" and type "principle"
    Then the feature file must be named my-node.principle.feature
    And using the wrong name means the content will not be loaded

  Scenario: Prototype nodes are read-only after activation
    Given a prototype is activated and merged with an instance
    Then prototype-origin nodes cannot be modified or forgotten
    And only instance-origin nodes (created by the individual) are mutable
    And this protects the prototype's base configuration

  Scenario: Keep prototypes focused
    Given a prototype defines a role's starting point
    Then include identity and foundational knowledge
    And include procedures that the role needs from day one
    And do not include goals or plans — those are runtime concerns created by the individual
