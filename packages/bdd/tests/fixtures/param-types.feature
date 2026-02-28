Feature: Parameter types

  Scenario: String parameter
    Given a user named "Alice"
    Then the user name should be "Alice"

  Scenario: Float parameter
    Given a price of 19.99
    Then the price should be 19.99

  Scenario: Word parameter
    Given the color red
    Then the color should be red

  Scenario: Int parameter
    Given a quantity of 42
    Then the quantity should be 42
