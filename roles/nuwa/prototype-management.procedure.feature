Feature: Prototype Management
  prototype-management:0.1.0

  Scenario: When to use this skill
    Given I need to manage prototypes (summon, banish, list)
    And I need to register role templates from ResourceX sources
    When the operation involves prototype lifecycle or registry inspection
    Then load this skill for detailed instructions
