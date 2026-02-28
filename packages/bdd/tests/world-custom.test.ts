import { Given, Then, setWorldConstructor, World, loadFeature } from "../src";
import type { IWorldOptions } from "../src";

class TestWorld extends World {
  value = "";
  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(TestWorld);

Given("I set value to {string}", function (this: TestWorld, val: string) {
  this.value = val;
});

Then("the value should be {string}", function (this: TestWorld, expected: string) {
  if (this.value !== expected) {
    throw new Error(`Expected "${expected}" but got "${this.value}"`);
  }
});

Then("previous scenario value should not leak", function (this: TestWorld) {
  // If World isolation works, value was set to "second" in the Given step
  // and NOT "first" from the previous scenario
  if (this.value !== "second") {
    throw new Error(`World leaked! Got "${this.value}" instead of "second"`);
  }
});

loadFeature("tests/fixtures/world-custom.feature");
