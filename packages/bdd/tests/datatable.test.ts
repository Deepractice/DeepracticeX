import { Given, Then, loadFeature, DataTable } from "../src";

let users: Record<string, string>[] = [];
let config: Record<string, string> = {};

Given("the following users:", function (table: DataTable) {
  users = table.hashes();
});

Then("there should be {int} users", function (count: number) {
  if (users.length !== count) {
    throw new Error(`Expected ${count} users but got ${users.length}`);
  }
  // verify data integrity
  if (users[0].name !== "Alice" || users[0].email !== "alice@test.com") {
    throw new Error(`First user data mismatch: ${JSON.stringify(users[0])}`);
  }
});

Given("the config:", function (table: DataTable) {
  config = table.rowsHash();
});

Then("the host should be {string}", function (expected: string) {
  if (config.host !== expected) {
    throw new Error(`Expected host "${expected}" but got "${config.host}"`);
  }
});

loadFeature("tests/fixtures/datatable.feature");
