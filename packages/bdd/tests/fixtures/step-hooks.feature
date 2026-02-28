Feature: BeforeStep and AfterStep hooks

  Scenario: Step hooks wrap each step
    Given step one runs
    And step two runs
    Then the step hook log should be correct
