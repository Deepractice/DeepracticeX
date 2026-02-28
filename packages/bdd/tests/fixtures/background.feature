Feature: Background support

  Background:
    Given the counter is set to 10

  Scenario: Increment
    When I increment the counter
    Then the counter should be 11

  Scenario: Decrement
    When I decrement the counter
    Then the counter should be 9
