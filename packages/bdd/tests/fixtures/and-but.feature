Feature: And/But conjunction steps

  Scenario: Multiple conditions
    Given the user is logged in
    And the user has admin role
    But the user is not suspended
    When the user visits the admin page
    Then the page should load
    And the title should be "Admin Dashboard"
    But the delete button should not be visible
