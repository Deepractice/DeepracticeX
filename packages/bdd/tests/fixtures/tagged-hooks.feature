@api
Feature: Tagged hooks

  @auth
  Scenario: Auth scenario triggers auth hook
    Given I check the setup log
    Then setup log should contain "api-setup" and "auth-setup"

  Scenario: Non-auth scenario skips auth hook
    Given I check the setup log
    Then setup log should contain "api-setup" but not "auth-setup"
