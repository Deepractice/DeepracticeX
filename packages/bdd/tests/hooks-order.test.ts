import { Given, Then, Before, After, BeforeAll, loadFeature } from "../src";

const log: string[] = [];

BeforeAll(function () {
  log.push("beforeAll");
});

Before(function () {
  log.push("before");
});

After(function () {
  log.push("after");
  // Verify After runs after the steps
  if (!log.includes("step")) {
    throw new Error("After hook ran before steps");
  }
});

Given("I record {string}", function (entry: string) {
  log.push(entry);
});

// At this point After hasn't run yet — that's correct
Then("the execution order should be {string}", function (expected: string) {
  const actual = log.join(",");
  if (actual !== expected) {
    throw new Error(`Expected order "${expected}" but got "${actual}"`);
  }
});

loadFeature("tests/fixtures/hooks-order.feature");
