---
name: deepracticex-bdd
description: BDD testing with @deepracticex/bdd — Cucumber-compatible framework running natively on Bun. Use when writing BDD features, step definitions, world setup, or running BDD tests. Covers directory conventions, Chinese Gherkin (zh-CN), World management, DI integration, and step definition patterns.
---

# @deepracticex/bdd

Cucumber-compatible BDD framework running natively on Bun. Same API as @cucumber/cucumber — zero learning curve for AI and humans. No CLI wrapper, no tsx loader, no child process.

## How It Works

```typescript
// bdd/run.test.ts — write once, never change
import { configure } from "@deepracticex/bdd";

await configure({
  features: ["bdd/features/**/*.feature", "bdd/journeys/**/*.feature"],
  steps: ["bdd/support/**/*.ts", "bdd/steps/**/*.ts"],
  tags: "not @pending",  // optional: global tag filter
  timeout: 60_000,       // optional: default timeout in ms
});
```

`configure()` auto-scans feature files and step definitions via glob patterns, then generates `describe`/`test` blocks that Bun's test runner executes natively. Add new `.feature` and `.steps.ts` files — they get picked up automatically.

### Manual loadFeature (escape hatch)

```typescript
import { loadFeature } from "@deepracticex/bdd";

loadFeature("bdd/features/oauth.feature");
loadFeature("bdd/features/session.feature", { tags: "not @pending" });
```

Use `loadFeature()` when you need per-feature control over tags or explicit ordering.

## Running Tests

```bash
bun test bdd/                          # Run all BDD tests
bun test bdd/run.test.ts               # Run specific entry file
bun test --test-name-pattern "OAuth"   # Filter by scenario name
```

Since BDD tests are native Bun tests, all `bun test` flags work directly.

## Directory Convention

```
service/
├── bdd/
│   ├── features/          # Functional specs (.feature)
│   ├── journeys/          # User journey specs (.feature)
│   ├── bugs/              # Bug reproduction specs (.feature)
│   ├── steps/             # Step definitions (*.steps.ts)
│   ├── support/           # World, hooks, helpers
│   │   ├── world.ts       # Custom World + setWorldConstructor
│   │   ├── container.ts   # DI container setup
│   │   └── database.ts    # Test DB initialization
│   └── run.test.ts        # Entry: configure() with glob patterns
└── package.json           # "test:bdd": "bun test bdd/"
```

The `run.test.ts` file calls `configure()` once — it auto-scans steps, support, and feature files via glob patterns. No manual imports or `loadFeature()` calls needed.

## API Exports

```typescript
import {
  // Step definitions
  Given, When, Then, defineStep,
  // Hooks
  Before, After, BeforeAll, AfterAll,
  BeforeStep, AfterStep,
  // World
  World, setWorldConstructor,
  // Configuration
  setDefaultTimeout, defineParameterType,
  // Data
  DataTable,
  // Auto-scan runner
  configure,
  // Manual runner (escape hatch)
  loadFeature,
  // Chinese aliases
  假设, 当, 那么, 之前, 之后,
} from "@deepracticex/bdd";
```

The API is identical to `@cucumber/cucumber`. Additions: `configure()`, `loadFeature()`, and Chinese aliases.

## Feature Files

### Basic Scenario

```gherkin
@oauth @auth
Feature: OAuth Login

  Background:
    Given Account service is running

  @github
  Scenario: New user GitHub login
    Given user "test@example.com" does not exist
    When user logs in via GitHub OAuth with:
      | provider_user_id | 12345            |
      | email            | test@example.com |
    Then new user should be created
    And should return valid session token
    But should not send welcome email yet
```

Background steps run before every Scenario in the Feature. And/But are conjunction keywords — they continue the previous Given/When/Then.

### Scenario Outline (parameterized)

```gherkin
Feature: Pricing

  Scenario Outline: Discount calculation
    Given an item priced at <price>
    When I apply a <discount>% discount
    Then the final price should be <final>

    Examples:
      | price | discount | final |
      | 100   | 10       | 90    |
      | 200   | 25       | 150   |
      | 50    | 0        | 50    |
```

Each row in Examples generates a separate test. Placeholders `<name>` are substituted from the table.

### DocString

```gherkin
Scenario: Parse JSON payload
  Given the following JSON:
    """
    {
      "name": "Alice",
      "role": "admin"
    }
    """
  Then the user should be created
```

DocString is passed as a `string` parameter after the extracted parameters.

### Chinese (zh-CN)

```gherkin
# language: zh-CN
功能: 会话管理

  背景:
    假设 Account 服务正在运行

  场景大纲: 登录验证
    假设 用户 "<email>" 已注册
    当 用户使用密码 "<password>" 登录
    那么 登录结果应该是 "<result>"

    例子:
      | email          | password | result |
      | test@test.com  | correct  | 成功   |
      | test@test.com  | wrong    | 失败   |
```

Add `# language: zh-CN` as first line. Keywords: 功能, 场景, 场景大纲, 例子, 假设, 当, 那么, 而且, 但是, 背景.

## Step Definitions

### Cucumber Expressions (recommended)

```typescript
Given("user {string} does not exist", async function (email: string) {
  // {string} matches quoted text, extracts without quotes
});

When("I add {int} and {int}", function (a: number, b: number) {
  // {int} matches integers, auto-converts to number
});

Then("the price should be {float}", function (price: number) {
  // {float} matches decimals like 19.99
});

Given("the color {word}", function (color: string) {
  // {word} matches a single word (no whitespace)
});
```

Built-in types: `{string}`, `{int}`, `{float}`, `{word}`.

### Regex Patterns

```typescript
Given(/^I have (\d+) items in my cart$/, function (count: string) {
  // Regex groups are passed as string — parse manually
  const n = parseInt(count, 10);
});
```

### DataTable Parameter

```typescript
When("user logs in with:", function (dataTable: DataTable) {
  const hashes = dataTable.hashes();    // [{ name: "Alice", email: "..." }]
  const rows = dataTable.rows();        // [["Alice", "..."], ...] (no header)
  const kv = dataTable.rowsHash();      // { name: "Alice", email: "..." }
  const raw = dataTable.raw();          // all rows including header
  const t = dataTable.transpose();      // flip rows/columns
});
```

### DocString Parameter

```typescript
Given("the following JSON:", function (json: string) {
  // DocString content passed as string, after any other extracted params
  const data = JSON.parse(json);
});
```

## Hooks

```typescript
// Run once before/after all scenarios in the file
BeforeAll(async function () { /* setup DB */ });
AfterAll(async function () { /* cleanup */ });

// Run before/after each scenario
Before(async function () { /* reset state */ });
After(async function () { /* teardown */ });

// Tag-filtered hooks — only run for matching scenarios
Before({ tags: "@auth" }, async function () { /* auth setup */ });
After({ tags: "@api" }, async function () { /* api cleanup */ });

// Step-level hooks — run before/after each step
BeforeStep(function () { /* log step start */ });
AfterStep(function () { /* log step end */ });
```

Execution order: BeforeAll → (Before → BeforeStep → Step → AfterStep → ... → After) × scenarios → AfterAll.

## Configuration

### Timeout

```typescript
// Via configure
await configure({ features: "...", timeout: 10000 });

// Or manually
import { setDefaultTimeout } from "@deepracticex/bdd";
setDefaultTimeout(10000); // 10 seconds (default: 5000)
```

### Custom Parameter Types

```typescript
import { defineParameterType } from "@deepracticex/bdd";

defineParameterType({
  name: "color",
  regexp: /red|green|blue/,
  transformer: (s) => ({ red: "#f00", green: "#0f0", blue: "#00f" }[s]),
});

// Now usable in steps:
Given("the sky is {color}", function (hex: string) {
  // hex = "#00f" when step text is "the sky is blue"
});
```

## World Management

```typescript
import { setWorldConstructor, World } from "@deepracticex/bdd";
import type { IWorldOptions } from "@deepracticex/bdd";

export class AccountWorld extends World {
  currentUser?: User;
  sessionToken?: string;
  error?: Error;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(AccountWorld);
```

- Each Scenario gets a fresh World instance — state is isolated
- Access via `this` in steps: `function (this: AccountWorld) { ... }`
- Export helpers for step definitions to access domain services

## Tag Filtering

```typescript
// Global filter via configure — applies to all scanned features
await configure({
  features: "bdd/features/**/*.feature",
  steps: "bdd/steps/**/*.ts",
  tags: "not @pending and not @slow",
});

// Per-feature filter via loadFeature
loadFeature("bdd/features/auth.feature", { tags: "@smoke" });
loadFeature("bdd/features/auth.feature", { tags: "(@smoke or @critical) and not @skip" });
```

Tag expressions support: `and`, `or`, `not`, parentheses.

## DI + Test Database

```typescript
// bdd/support/container.ts
import { openDatabase } from "@deepracticex/sqlite";

const testDb = openDatabase(":memory:");
testDb.exec(`CREATE TABLE users (...)`);

container.register(TOKENS.DB, { useValue: testDb });
container.registerSingleton(TOKENS.UserRepository, DrizzleUserRepository);
```

Pattern: in-memory SQLite + DI container. Production code under test via real implementations, no mocks.

## package.json Setup

```json
{
  "devDependencies": {
    "@deepracticex/bdd": "workspace:*"
  },
  "scripts": {
    "test:bdd": "bun test bdd/"
  }
}
```
