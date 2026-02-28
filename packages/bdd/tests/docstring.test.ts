import { Given, Then, loadFeature } from "../src";

let parsed: Record<string, unknown> = {};

Given("the following JSON:", function (json: string) {
  parsed = JSON.parse(json);
});

Then("the parsed name should be {string}", function (expected: string) {
  if (parsed.name !== expected) {
    throw new Error(`Expected name "${expected}" but got "${parsed.name}"`);
  }
});

loadFeature("tests/fixtures/docstring.feature");
