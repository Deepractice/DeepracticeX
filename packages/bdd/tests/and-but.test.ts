import { Given, When, Then, loadFeature } from "../src";

let loggedIn = false;
let role = "";
let suspended = false;
let pageLoaded = false;
let title = "";
let deleteVisible = false;

Given("the user is logged in", function () {
  loggedIn = true;
});

Given("the user has admin role", function () {
  role = "admin";
});

Given("the user is not suspended", function () {
  suspended = false;
});

When("the user visits the admin page", function () {
  if (!loggedIn || role !== "admin" || suspended) {
    throw new Error("Access denied");
  }
  pageLoaded = true;
  title = "Admin Dashboard";
  deleteVisible = false; // admins can't see delete by default
});

Then("the page should load", function () {
  if (!pageLoaded) throw new Error("Page did not load");
});

Then("the title should be {string}", function (expected: string) {
  if (title !== expected) {
    throw new Error(`Expected title "${expected}" but got "${title}"`);
  }
});

Then("the delete button should not be visible", function () {
  if (deleteVisible) {
    throw new Error("Delete button should not be visible");
  }
});

loadFeature("tests/fixtures/and-but.feature");
