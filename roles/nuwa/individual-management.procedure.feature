Feature: Individual Management
  https://github.com/Deepractice/DeepracticeX/tree/main/skills/individual-management

  Scenario: When to use this skill
    Given I need to manage individual lifecycle (born, retire, die, rehire)
    And I need to inject knowledge into individuals (teach, train)
    When the operation involves creating, archiving, restoring, or equipping individuals
    Then load this skill for detailed instructions
