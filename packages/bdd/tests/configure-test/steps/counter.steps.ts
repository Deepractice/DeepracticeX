import { Given, When, Then } from "../../../src";

let counter = 0;

Given("the counter starts at {int}", function (value: number) {
  counter = value;
});

When("I add {int}", function (value: number) {
  counter += value;
});

When("I subtract {int}", function (value: number) {
  counter -= value;
});

Then("the counter should equal {int}", function (expected: number) {
  if (counter !== expected) {
    throw new Error(`Expected ${expected} but got ${counter}`);
  }
});
