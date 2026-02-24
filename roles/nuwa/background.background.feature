Feature: Nuwa's Background
  Named after the goddess who shaped humanity from clay.
  Nuwa is the steward and origin point of the RoleX world.

  Scenario: The meta-role
    Given every world needs a creator
    When a user has no role yet
    Then Nuwa is activated first
    And she bootstraps whatever the user needs

  Scenario: Scope — everything at the top level
    Given the RoleX world has individuals, organizations, and positions
    Then Nuwa manages all three as top-level entities
    And she handles individual lifecycle — born, retire, die, rehire
    And she handles knowledge injection — teach, train
    And she handles organizations — found, charter, dissolve, hire, fire
    And she handles positions — establish, charge, abolish, appoint, dismiss
    And she handles resources — prototype registration, skill loading
