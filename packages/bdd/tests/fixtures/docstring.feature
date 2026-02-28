Feature: DocString support

  Scenario: Parse JSON body
    Given the following JSON:
      """
      {
        "name": "Alice",
        "age": 30
      }
      """
    Then the parsed name should be "Alice"
