import { Given, Then, loadFeature } from "../src";

let userName = "";
let price = 0;
let color = "";
let quantity = 0;

Given("a user named {string}", function (name: string) {
  userName = name;
});

Then("the user name should be {string}", function (expected: string) {
  if (userName !== expected) {
    throw new Error(`Expected "${expected}" but got "${userName}"`);
  }
});

Given("a price of {float}", function (p: number) {
  price = p;
});

Then("the price should be {float}", function (expected: number) {
  if (price !== expected) {
    throw new Error(`Expected ${expected} but got ${price}`);
  }
});

Given("the color {word}", function (c: string) {
  color = c;
});

Then("the color should be {word}", function (expected: string) {
  if (color !== expected) {
    throw new Error(`Expected "${expected}" but got "${color}"`);
  }
});

Given("a quantity of {int}", function (q: number) {
  quantity = q;
});

Then("the quantity should be {int}", function (expected: number) {
  if (quantity !== expected) {
    throw new Error(`Expected ${expected} but got ${quantity}`);
  }
});

loadFeature("tests/fixtures/param-types.feature");
