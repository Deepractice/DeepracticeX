Feature: Position Management
  https://github.com/Deepractice/DeepracticeX/tree/main/skills/position-management

  Scenario: When to use this skill
    Given I need to manage positions (establish, charge, abolish)
    And I need to manage appointments (appoint, dismiss)
    When the operation involves creating roles, assigning duties, or staffing positions
    Then load this skill for detailed instructions
