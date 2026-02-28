import { Given, Then, Before, loadFeature } from "../src";

let setupLog: string[] = [];

Before(function () {
  setupLog = [];
});

Before({ tags: "@api" }, function () {
  setupLog.push("api-setup");
});

Before({ tags: "@auth" }, function () {
  setupLog.push("auth-setup");
});

Given("I check the setup log", function () {
  // steps access the log built by hooks
});

Then(
  "setup log should contain {string} and {string}",
  function (a: string, b: string) {
    if (!setupLog.includes(a) || !setupLog.includes(b)) {
      throw new Error(
        `Expected log to contain "${a}" and "${b}" but got [${setupLog}]`
      );
    }
  }
);

Then(
  "setup log should contain {string} but not {string}",
  function (yes: string, no: string) {
    if (!setupLog.includes(yes)) {
      throw new Error(
        `Expected log to contain "${yes}" but got [${setupLog}]`
      );
    }
    if (setupLog.includes(no)) {
      throw new Error(
        `Expected log NOT to contain "${no}" but got [${setupLog}]`
      );
    }
  }
);

loadFeature("tests/fixtures/tagged-hooks.feature");
