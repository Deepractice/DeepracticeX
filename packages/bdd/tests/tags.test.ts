import { Given, loadFeature } from "../src";

let smokeRan = false;
let slowRan = false;
let pendingRan = false;

Given("a passing step", function () {
  // Track which scenarios ran via tag on the scenario
  // We can't distinguish here, but we verify via the filter below
});

Given("a step that should not run", function () {
  pendingRan = true;
  throw new Error("This step should have been filtered out by tags");
});

// Test 1: Only @smoke — should run 1 scenario
loadFeature("tests/fixtures/tags.feature", {
  tags: "@smoke",
});

// Test 2: Exclude @pending and @slow — should run only Smoke test
loadFeature("tests/fixtures/tags.feature", {
  tags: "@auth and not @pending and not @slow",
});
