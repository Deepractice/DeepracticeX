@auth
Feature: Tag filtering

  @smoke
  Scenario: Smoke test passes
    Given a passing step

  @slow
  Scenario: Slow test passes
    Given a passing step

  @pending
  Scenario: Pending scenario should be skipped
    Given a step that should not run
