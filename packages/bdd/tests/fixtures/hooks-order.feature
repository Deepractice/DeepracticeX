Feature: Hooks execution order

  Scenario: Hooks run in correct order
    Given I record "step"
    Then the execution order should be "beforeAll,before,step"
