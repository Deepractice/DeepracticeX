import { Given, When, Then, loadFeature } from "../src";

let items = 0;

Given(/^I have (\d+) items in my cart$/, function (count: string) {
  items = parseInt(count, 10);
});

When(/^I remove (\d+) items$/, function (count: string) {
  items -= parseInt(count, 10);
});

Then(/^I should have (\d+) items$/, function (expected: string) {
  const exp = parseInt(expected, 10);
  if (items !== exp) {
    throw new Error(`Expected ${exp} items but got ${items}`);
  }
});

loadFeature("tests/fixtures/regex-steps.feature");
