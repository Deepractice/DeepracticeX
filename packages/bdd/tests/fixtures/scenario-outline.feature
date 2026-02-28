Feature: Scenario Outline

  Scenario Outline: Add numbers
    Given the calculator is reset
    When I add <a> and <b>
    Then the result should be <sum>

    Examples:
      | a  | b  | sum |
      | 1  | 2  | 3   |
      | 10 | 20 | 30  |
      | -1 | 1  | 0   |
