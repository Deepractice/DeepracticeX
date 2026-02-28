import { Given, Then, defineParameterType, loadFeature } from "../src";

// Custom parameter type: color
defineParameterType({
  name: "color",
  regexp: /red|green|blue/,
  transformer: (s: string) => {
    const map: Record<string, string> = {
      red: "255,0,0",
      green: "0,255,0",
      blue: "0,0,255",
    };
    return map[s];
  },
});

// Custom parameter type: date
defineParameterType({
  name: "date",
  regexp: /\d{4}-\d{2}-\d{2}/,
  transformer: (s: string) => new Date(s),
});

let skyColorRGB = "";
let dateValue: Date | null = null;

Given("the sky is {color}", function (rgb: string) {
  skyColorRGB = rgb;
});

Then("the sky color RGB should be {string}", function (expected: string) {
  if (skyColorRGB !== expected) {
    throw new Error(`Expected RGB "${expected}" but got "${skyColorRGB}"`);
  }
});

Given("today is {date}", function (d: Date) {
  dateValue = d;
});

Then("the year should be {int}", function (expected: number) {
  if (!dateValue || dateValue.getFullYear() !== expected) {
    throw new Error(
      `Expected year ${expected} but got ${dateValue?.getFullYear()}`
    );
  }
});

loadFeature("tests/fixtures/custom-param.feature");
