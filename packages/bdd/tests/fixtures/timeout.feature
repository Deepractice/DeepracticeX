Feature: Timeout configuration

  Scenario: Step completes within timeout
    Given a step that takes 50ms
    Then it should pass
