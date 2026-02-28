Feature: Calculator
  A simple calculator for basic arithmetic.

  Scenario: Add two numbers
    Given the calculator is reset
    When I add 3 and 5
    Then the result should be 8

  Scenario: Multiply two numbers
    Given the calculator is reset
    When I multiply 4 and 7
    Then the result should be 28
