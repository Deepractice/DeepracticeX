import { Given, Then, BeforeStep, AfterStep, loadFeature } from "../src";

const hookLog: string[] = [];

BeforeStep(function () {
  hookLog.push("before-step");
});

AfterStep(function () {
  hookLog.push("after-step");
});

Given("step one runs", function () {
  hookLog.push("step-one");
});

Given("step two runs", function () {
  hookLog.push("step-two");
});

Then("the step hook log should be correct", function () {
  // At this point, BeforeStep for this Then has already run
  // Expected sequence so far:
  //   before-step, step-one, after-step,
  //   before-step, step-two, after-step,
  //   before-step (for this Then step)
  const expected = [
    "before-step", "step-one", "after-step",
    "before-step", "step-two", "after-step",
    "before-step", // for this Then step
  ];
  const actual = hookLog.slice(0, expected.length);
  const expectedStr = expected.join(",");
  const actualStr = actual.join(",");
  if (actualStr !== expectedStr) {
    throw new Error(
      `Expected hook log:\n  ${expectedStr}\nbut got:\n  ${actualStr}`
    );
  }
});

loadFeature("tests/fixtures/step-hooks.feature");
