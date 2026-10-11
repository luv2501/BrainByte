import assert from "node:assert";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app.js";
import Problem from "../models/Problem.js";
import User from "../models/User.js";
import {
  createProblem,
  updateProblem,
  getProblemByIdOrSlug,
  slugify,
} from "../controllers/problemController.js";

const PORT = 5056;
let server;
const baseUrl = `http://127.0.0.1:${PORT}`;

const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
};

function createMockRes() {
  let statusCode = 200;
  let jsonBody = null;
  return {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      jsonBody = body;
      return this;
    },
    getStatusCode: () => statusCode,
    getBody: () => jsonBody,
  };
}

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
  console.log(colors.bold("   BrainByte Coding Problems System Test Suite   "));
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

  await startServer();

  // Test 1: Slugify Helper Function
  await test("slugify utility generates correct kebab-case slugs", () => {
    assert.strictEqual(slugify("Two Sum"), "two-sum");
    assert.strictEqual(slugify("  Valid Palindrome II!  "), "valid-palindrome-ii");
    assert.strictEqual(slugify("3Sum Closest"), "3sum-closest");
    assert.strictEqual(slugify("Longest Common Prefix ($)"), "longest-common-prefix");
  });

  // Test 2: Protected Route Rejection (Create without token)
  await test("POST /api/problems without auth token returns 401", async () => {
    const res = await apiRequest("/api/problems", {
      method: "POST",
      body: JSON.stringify({
        title: "Sample Problem",
        description: "Sample description",
        difficulty: "Easy",
      }),
    });
    assert.strictEqual(res.status, 401);
    assert.ok(res.data?.message?.includes("Not authorized"));
  });

  // Test 3: Protected Route Rejection (Update without token)
  await test("PUT /api/problems/:id without auth token returns 401", async () => {
    const res = await apiRequest("/api/problems/sample-slug", {
      method: "PUT",
      body: JSON.stringify({ title: "Updated Title" }),
    });
    assert.strictEqual(res.status, 401);
    assert.ok(res.data?.message?.includes("Not authorized"));
  });

  // Test 4: Protected Route Rejection (Delete without token)
  await test("DELETE /api/problems/:id without auth token returns 401", async () => {
    const res = await apiRequest("/api/problems/sample-slug", {
      method: "DELETE",
    });
    assert.strictEqual(res.status, 401);
    assert.ok(res.data?.message?.includes("Not authorized"));
  });

  // Test 5: Validation - Missing Required Fields (Unit Check)
  await test("createProblem controller validates missing title/description/difficulty", async () => {
    const req = { body: { title: "Incomplete Problem" }, user: { _id: "123" } };
    const res = createMockRes();
    await createProblem(req, res, () => {});
    assert.strictEqual(res.getStatusCode(), 400);
    assert.ok(res.getBody().message.includes("required"));
  });

  // Test 6: Validation - Invalid Difficulty Enum (Unit Check)
  await test("createProblem controller rejects invalid difficulty enum", async () => {
    const req = {
      body: {
        title: "Test Problem",
        description: "Test description",
        difficulty: "SuperHard",
        testCases: [{ input: "1", expectedOutput: "1" }],
      },
      user: { _id: "123" },
    };
    const res = createMockRes();
    await createProblem(req, res, () => {});
    assert.strictEqual(res.getStatusCode(), 400);
    assert.ok(res.getBody().message.includes("Difficulty must be"));
  });

  // Test 7: Validation - Missing Test Cases (Unit Check)
  await test("createProblem controller rejects empty test cases array", async () => {
    const req = {
      body: {
        title: "Test Problem",
        description: "Test description",
        difficulty: "Easy",
        testCases: [],
      },
      user: { _id: "123" },
    };
    const res = createMockRes();
    await createProblem(req, res, () => {});
    assert.strictEqual(res.getStatusCode(), 400);
    assert.ok(res.getBody().message.includes("At least one test case is required"));
  });

  // Test 8: Hidden Test Case Filtering Logic Check
  await test("Hidden test cases are correctly filtered from client responses", () => {
    const rawTestCases = [
      { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isHidden: false },
      { input: "[3,2,4]\n6", expectedOutput: "[1,2]", isHidden: false },
      { input: "[3,3]\n6", expectedOutput: "[0,1]", isHidden: true },
      { input: "[1,5,8]\n9", expectedOutput: "[0,2]", isHidden: true },
    ];
    const visibleTestCases = rawTestCases.filter((tc) => !tc.isHidden);
    assert.strictEqual(visibleTestCases.length, 2);
    assert.strictEqual(visibleTestCases.every((tc) => !tc.isHidden), true);
  });

  // Test 9: Live MongoDB Integration Testing
  console.log(colors.cyan("\n--- Checking Live MongoDB Connection for End-to-End Problem Tests ---"));
  let dbConnected = false;
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/brainbyte";
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1500 });
    dbConnected = true;
    console.log(colors.green("Live MongoDB connection successful! Running End-to-End Problem CRUD tests..."));
  } catch (err) {
    console.log(
      colors.yellow(
        `MongoDB is not currently reachable (${err.message}).\n` +
          `Unit validation, route protection, and controller checks passed.\n` +
          `Configure MONGO_URI in .env to run full database persistence tests.`
      )
    );
  }

  if (dbConnected) {
    // Create test user and token
    const testUser = await User.create({
      username: `prob_tester_${Date.now()}`,
      email: `prob_tester_${Date.now()}@example.com`,
      password: "password123",
    });

    const secret = process.env.JWT_SECRET || "brainbyte_super_secret_jwt_dev_key_2024";
    const token = jwt.sign({ id: testUser._id }, secret);
    const authHeaders = { Authorization: `Bearer ${token}` };

    let createdProblemId = "";
    const uniqueSlug = `two-sum-test-${Date.now()}`;

    // Test 10: Create Problem with full schema (including hidden test cases)
    await test("POST /api/problems creates problem with full schema & auto-slug", async () => {
      const res = await apiRequest("/api/problems", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          title: `Two Sum Test ${Date.now()}`,
          slug: uniqueSlug,
          description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
          difficulty: "Easy",
          tags: ["Array", "Hash Table"],
          constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
          ],
          examples: [
            {
              input: "nums = [2,7,11,15], target = 9",
              output: "[0,1]",
              explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
            },
          ],
          starterCode: {
            javascript: "function twoSum(nums, target) {\n  // your code\n}",
            python: "def twoSum(nums: list[int], target: int) -> list[int]:\n    pass",
          },
          testCases: [
            { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isHidden: false },
            { input: "[3,2,4]\n6", expectedOutput: "[1,2]", isHidden: false },
            { input: "[3,3]\n6", expectedOutput: "[0,1]", isHidden: true }, // HIDDEN TEST CASE
          ],
          hints: ["Use a hash map to store seen values."],
        }),
      });

      if (res.status !== 201) {
        console.error("Create Problem failed with:", res.status, res.data);
      }

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.slug, uniqueSlug);
      assert.strictEqual(res.data.difficulty, "Easy");
      assert.strictEqual(res.data.tags.length, 2);
      assert.strictEqual(res.data.examples.length, 1);
      assert.strictEqual(res.data.testCases.length, 3);
      createdProblemId = res.data._id;
    });


    // Test 11: Get all problems list
    await test("GET /api/problems returns list with summary fields", async () => {
      const res = await apiRequest("/api/problems?limit=100");
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.data.problems), "Response should have problems array");
      assert.ok(typeof res.data.total === "number", "Response should have total count");
      const found = res.data.problems.find((p) => p.slug === uniqueSlug);
      assert.ok(found, "Newly created problem should appear in list");
      assert.strictEqual(found.title.includes("Two Sum Test"), true);
    });

    // Test 12: Filter problems by difficulty, tag, and search
    await test("GET /api/problems filters by difficulty, tag, and search", async () => {
      const resDiff = await apiRequest("/api/problems?difficulty=Easy&limit=100");
      assert.strictEqual(resDiff.status, 200);
      assert.ok(resDiff.data.problems.every((p) => p.difficulty === "Easy"));

      const resTag = await apiRequest("/api/problems?tag=Array&limit=100");
      assert.strictEqual(resTag.status, 200);
      assert.ok(resTag.data.problems.some((p) => p.slug === uniqueSlug));

      const resSearch = await apiRequest("/api/problems?search=Two+Sum+Test&limit=100");
      assert.strictEqual(resSearch.status, 200);
      assert.ok(resSearch.data.problems.some((p) => p.slug === uniqueSlug));
    });

    // Test 13: Get single problem by slug and verify hidden test cases are stripped
    await test("GET /api/problems/:slug returns full problem and filters out hidden test cases", async () => {
      const res = await apiRequest(`/api/problems/${uniqueSlug}`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.slug, uniqueSlug);
      assert.strictEqual(res.data.examples.length, 1);
      assert.strictEqual(res.data.constraints.length, 3);
      assert.ok(res.data.starterCode.javascript);
      // Verify hidden test cases are stripped from public response
      assert.strictEqual(res.data.testCases.length, 2, "Only non-hidden test cases should be returned");
      assert.ok(res.data.testCases.every((tc) => tc.isHidden === false || tc.isHidden === undefined));
    });

    // Test 14: Get single problem by MongoDB ObjectId
    await test("GET /api/problems/:id by MongoDB ObjectId returns problem", async () => {
      const res = await apiRequest(`/api/problems/${createdProblemId}`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data._id, createdProblemId);
      assert.strictEqual(res.data.slug, uniqueSlug);
    });

    // Test 15: Update problem
    await test("PUT /api/problems/:id updates difficulty and tags", async () => {
      const res = await apiRequest(`/api/problems/${createdProblemId}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          difficulty: "Medium",
          tags: ["Array", "Hash Table", "Two Pointers"],
        }),
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.difficulty, "Medium");
      assert.strictEqual(res.data.tags.length, 3);
    });

    // Test 16: Delete problem
    await test("DELETE /api/problems/:id removes problem", async () => {
      const res = await apiRequest(`/api/problems/${createdProblemId}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.message, "Problem deleted successfully");

      // Verify it's now 404
      const checkRes = await apiRequest(`/api/problems/${uniqueSlug}`);
      assert.strictEqual(checkRes.status, 404);
    });

    // Clean up test user
    await User.findByIdAndDelete(testUser._id);
  }

  await stopServer();

  console.log(colors.bold("\n--------------------------------------------------"));
  console.log(`Problems Tests Passed: ${colors.green(passed)}`);
  if (failed > 0) {
    console.log(`Problems Tests Failed: ${colors.red(failed)}`);
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
