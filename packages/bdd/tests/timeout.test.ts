import { Given, Then, setDefaultTimeout, loadFeature } from "../src";

// Set a generous timeout
setDefaultTimeout(10000);

Given("a step that takes {int}ms", async function (ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
});

Then("it should pass", function () {
  // If we got here, the timeout didn't fire
});

loadFeature("tests/fixtures/timeout.feature");
