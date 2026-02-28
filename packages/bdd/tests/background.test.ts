import { Given, When, Then, loadFeature } from "../src";

let counter = 0;

Given("the counter is set to {int}", function (value: number) {
  counter = value;
});

When("I increment the counter", function () {
  counter++;
});

When("I decrement the counter", function () {
  counter--;
});

Then("the counter should be {int}", function (expected: number) {
  if (counter !== expected) {
    throw new Error(`Expected counter ${expected} but got ${counter}`);
  }
});

loadFeature("tests/fixtures/background.feature");
