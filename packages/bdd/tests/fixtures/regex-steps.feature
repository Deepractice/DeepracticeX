Feature: Regex step patterns

  Scenario: Match with regex
    Given I have 5 items in my cart
    When I remove 2 items
    Then I should have 3 items
