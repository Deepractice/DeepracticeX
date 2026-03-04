import { configure } from "../src";

await configure({
  features: "tests/configure-test/**/*.feature",
  steps: "tests/configure-test/steps/**/*.ts",
});
