Feature: Counter via configure

  Scenario: Add two numbers
    Given the counter starts at 0
    When I add 5
    Then the counter should equal 5

  Scenario: Subtract
    Given the counter starts at 10
    When I subtract 3
    Then the counter should equal 7
