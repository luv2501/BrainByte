import assert from "node:assert";
import mongoose from "mongoose";
import app from "../app.js";
import Problem from "../models/Problem.js";
import { problemsData } from "../data/problemsData.js";
import { validateProblemData, seedProblems } from "../scripts/seedProblems.js";

const PORT = 5057;
let server;
const baseUrl = `http://127.0.0.1:${PORT}`;

const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
};

async function startServer() {
  return new Promise((resolve) => {
    server = app.listen(PORT, "127.0.0.1", () => {
      resolve();
    });
  });
}

async function stopServer() {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

async function apiRequest(endpoint, options = {}) {
  const { headers = {}, ...restOptions } = options;
  const url = `${baseUrl}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...restOptions,
  });

  const data = await response.json().catch(() => null);
  return { status: response.status, data };
}

async function runTests() {
  console.log(colors.bold("\n=================================================="));
  console.log(colors.bold("   BrainByte Problem Data & Seed System Tests    "));
  console.log(colors.bold("==================================================\n"));

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`${colors.green("✓")} ${name}`);
      passed++;
    } catch (err) {
      console.error(`${colors.red("✗")} ${name}`);
      console.error(`   ${colors.red(err.message)}`);
      failed++;
    }
  }

  // Test 1: Validation Helper Unit Tests
  await test("validateProblemData rejects malformed objects", () => {
    assert.strictEqual(validateProblemData(null).valid, false);
    assert.strictEqual(validateProblemData("string").valid, false);
    assert.strictEqual(validateProblemData({}).valid, false);
  });

  await test("validateProblemData rejects missing fields or invalid difficulty", () => {
    assert.strictEqual(
      validateProblemData({ title: "Test", description: "Desc", difficulty: "Impossible" }).valid,
      false
    );
    assert.strictEqual(
      validateProblemData({ title: "Test", description: "Desc", difficulty: "Easy", testCases: [] }).valid,
      false
    );
  });

  await test("validateProblemData successfully sanitizes valid problem", () => {
    const raw = {
      title: "  Example Problem  ",
      description: "Problem description text",
      difficulty: "Easy",
      tags: [" Array ", " Math "],
      constraints: "1 <= n <= 100",
      testCases: [{ input: "1", expectedOutput: "2", isHidden: false }],
    };
    const res = validateProblemData(raw);
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.sanitized.title, "Example Problem");
    assert.strictEqual(res.sanitized.slug, "example-problem");
    assert.deepStrictEqual(res.sanitized.tags, ["Array", "Math"]);
    assert.deepStrictEqual(res.sanitized.constraints, ["1 <= n <= 100"]);
  });

  // Test 2: Dataset Integrity Check
  await test(`All ${problemsData.length} items in problemsData pass validation without errors`, () => {
    const slugs = new Set();
    for (const item of problemsData) {
      const validation = validateProblemData(item);
      assert.strictEqual(
        validation.valid,
        true,
        `Problem '${item.title}' failed validation: ${validation.reason}`
      );
      assert.ok(validation.sanitized.slug, `Problem '${item.title}' has no slug`);
      assert.strictEqual(
        slugs.has(validation.sanitized.slug),
        false,
        `Duplicate slug found: '${validation.sanitized.slug}'`
      );
      slugs.add(validation.sanitized.slug);

      // Check required components
      assert.ok(item.examples.length >= 1, `'${item.title}' should have examples`);
      assert.ok(item.testCases.length >= 1, `'${item.title}' should have test cases`);
      assert.ok(item.starterCode.javascript, `'${item.title}' should have JS starter code`);
      assert.ok(item.starterCode.python, `'${item.title}' should have Python starter code`);
    }
  });

  await startServer();

  // Test 3: Live MongoDB Integration Testing
  console.log(colors.cyan("\n--- Checking Live MongoDB Connection for Seeding Tests ---"));
  let dbConnected = false;
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/brainbyte";
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    dbConnected = true;
    console.log(colors.green("Live MongoDB connection successful! Running Seeder & API tests..."));
  } catch (err) {
    console.log(
      colors.yellow(
        `MongoDB is not currently reachable (${err.message}).\n` +
          `Dataset validation checks passed.\n` +
          `Configure MONGO_URI in .env to run full database persistence tests.`
      )
    );
  }

  if (dbConnected) {
    // Test 4: Seed execution (clean mode)
    await test("seedProblems({ clear: true }) seeds full dataset into MongoDB", async () => {
      const stats = await seedProblems({ clear: true, silent: true });
      assert.strictEqual(stats.total, problemsData.length);
      assert.strictEqual(stats.insertedOrUpdated, problemsData.length);
      assert.strictEqual(stats.skipped, 0);

      const dbCount = await Problem.countDocuments();
      assert.strictEqual(dbCount, problemsData.length);
    });

    // Test 5: Seed idempotency (running again should upsert, not duplicate)
    await test("seedProblems idempotency: re-running does not duplicate problems", async () => {
      const stats = await seedProblems({ clear: false, silent: true });
      assert.strictEqual(stats.insertedOrUpdated, problemsData.length);

      const dbCount = await Problem.countDocuments();
      assert.strictEqual(dbCount, problemsData.length, "Total document count should remain exact");
    });

    // Test 6: API GET all problems returns complete list
    await test("GET /api/problems returns all seeded problems with summary fields", async () => {
      const res = await apiRequest("/api/problems?limit=100");
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.data.problems), "Response should have problems array");
      assert.strictEqual(res.data.total, problemsData.length, "total count should match dataset");
      assert.strictEqual(res.data.problems.length, problemsData.length, "problems length should match dataset");

      const slugs = res.data.problems.map((p) => p.slug);
      assert.ok(slugs.includes("two-sum"));
      assert.ok(slugs.includes("valid-palindrome"));
      assert.ok(slugs.includes("coin-change"));
    });

    // Test 7: API filtering across seeded dataset
    await test("GET /api/problems filters by difficulty, tag, and search", async () => {
      const resEasy = await apiRequest("/api/problems?difficulty=Easy&limit=100");
      assert.strictEqual(resEasy.status, 200);
      assert.ok(resEasy.data.problems.length > 0);
      assert.ok(resEasy.data.problems.every((p) => p.difficulty === "Easy"));

      const resMed = await apiRequest("/api/problems?difficulty=Medium&limit=100");
      assert.strictEqual(resMed.status, 200);
      assert.ok(resMed.data.problems.length > 0);
      assert.ok(resMed.data.problems.every((p) => p.difficulty === "Medium"));

      const resTag = await apiRequest("/api/problems?tag=Dynamic+Programming&limit=100");
      assert.strictEqual(resTag.status, 200);
      assert.ok(resTag.data.problems.length >= 2);

      const resSearch = await apiRequest("/api/problems?search=Parentheses");
      assert.strictEqual(resSearch.status, 200);
      assert.strictEqual(resSearch.data.problems.length, 1);
      assert.strictEqual(resSearch.data.problems[0].slug, "valid-parentheses");
    });

    // Test 8: Single problem retrieval & hidden test case protection
    await test("GET /api/problems/:slug returns full problem without leaking hidden test cases", async () => {
      const res = await apiRequest("/api/problems/two-sum");
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.title, "Two Sum");
      assert.strictEqual(res.data.difficulty, "Easy");
      assert.ok(res.data.examples.length >= 2);
      assert.ok(res.data.starterCode.javascript);
      assert.ok(res.data.starterCode.python);
      assert.ok(res.data.starterCode.cpp);
      assert.ok(res.data.starterCode.java);

      // Verify that hidden test cases are stripped
      const originalProblem = problemsData.find((p) => p.slug === "two-sum");
      const totalOriginalTestCases = originalProblem.testCases.length;
      const visibleOriginalTestCases = originalProblem.testCases.filter((tc) => !tc.isHidden).length;

      assert.strictEqual(res.data.testCases.length, visibleOriginalTestCases);
      assert.ok(res.data.testCases.length < totalOriginalTestCases);
      assert.ok(res.data.testCases.every((tc) => !tc.isHidden));
    });
  }

  await stopServer();

  console.log(colors.bold("\n--------------------------------------------------"));
  console.log(`Seed Tests Passed: ${colors.green(passed)}`);
  if (failed > 0) {
    console.log(`Seed Tests Failed: ${colors.red(failed)}`);
  }
  console.log(colors.bold("--------------------------------------------------\n"));

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  stopServer().finally(() => process.exit(1));
});

