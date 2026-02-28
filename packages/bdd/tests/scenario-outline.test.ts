import { Given, When, Then, 假设, 当, 那么, loadFeature } from "../src";

let result = 0;

Given("the calculator is reset", function () {
  result = 0;
});

When("I add {int} and {int}", function (a: number, b: number) {
  result = a + b;
});

When("I multiply {int} and {int}", function (a: number, b: number) {
  result = a * b;
});

Then("the result should be {int}", function (expected: number) {
  if (result !== expected) {
    throw new Error(`Expected ${expected} but got ${result}`);
  }
});

// Chinese steps
假设("计算器已重置", function () {
  result = 0;
});

当("我将 {int} 和 {int} 相加", function (a: number, b: number) {
  result = a + b;
});

当("我将 {int} 和 {int} 相乘", function (a: number, b: number) {
  result = a * b;
});

那么("结果应该是 {int}", function (expected: number) {
  if (result !== expected) {
    throw new Error(`Expected ${expected} but got ${result}`);
  }
});

// Basic scenarios (English + Chinese)
loadFeature("tests/fixtures/calculator.feature");
loadFeature("tests/fixtures/calculator-zh.feature");

// Scenario Outline with Examples table (English + Chinese, 3 examples each)
loadFeature("tests/fixtures/scenario-outline.feature");
loadFeature("tests/fixtures/scenario-outline-zh.feature");
