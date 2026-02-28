Feature: DataTable support

  Scenario: Read a table as hashes
    Given the following users:
      | name    | email            |
      | Alice   | alice@test.com   |
      | Bob     | bob@test.com     |
    Then there should be 2 users

  Scenario: Read a table as rows hash
    Given the config:
      | host     | localhost |
      | port     | 3000      |
      | protocol | https     |
    Then the host should be "localhost"
