Feature: Custom parameter types

  Scenario: Custom color parameter
    Given the sky is blue
    Then the sky color RGB should be "0,0,255"

  Scenario: Custom date parameter
    Given today is 2026-02-28
    Then the year should be 2026
