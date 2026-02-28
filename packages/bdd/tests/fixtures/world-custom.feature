Feature: Custom World

  Scenario: World state is isolated per scenario
    Given I set value to "first"
    Then the value should be "first"

  Scenario: Fresh world for each scenario
    Given I set value to "second"
    Then the value should be "second"
    And previous scenario value should not leak
