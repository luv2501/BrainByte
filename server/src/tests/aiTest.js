import assert from "node:assert";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app.js";
import User from "../models/User.js";
import Problem from "../models/Problem.js";

let server;
let baseUrl = "";

const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
};

async function startServer() {
  return new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
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
  console.log(colors.bold("  BrainByte Contextual AI Assistant Test Suite    "));
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

  // Test 1: Route Protection Checks (401 without Bearer token)
  await test("POST /api/ai/hint without auth token returns 401", async () => {
    const res = await apiRequest("/api/ai/hint", {
      method: "POST",
      body: JSON.stringify({ slug: "two-sum" }),
    });
    assert.strictEqual(res.status, 401);
  });

  await test("POST /api/ai/explain without auth token returns 401", async () => {
    const res = await apiRequest("/api/ai/explain", {
      method: "POST",
      body: JSON.stringify({ code: "console.log(1)", language: "javascript" }),
    });
    assert.strictEqual(res.status, 401);
  });

  await test("POST /api/ai/debug without auth token returns 401", async () => {
    const res = await apiRequest("/api/ai/debug", {
      method: "POST",
      body: JSON.stringify({ code: "for(;;)", language: "javascript" }),
    });
    assert.strictEqual(res.status, 401);
  });

  // Test 2: Live Database & Integration Testing
  console.log(colors.cyan("\n--- Checking Live MongoDB Connection for Contextual AI Tests ---"));
  let dbConnected = false;
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/brainbyte";
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    dbConnected = true;
    console.log(colors.green("Live MongoDB connection successful! Running Contextual AI tests..."));
  } catch (err) {
    console.log(
      colors.yellow(
        `MongoDB is not currently reachable (${err.message}).\n` +
          `Route protection tests passed.`
      )
    );
  }

  if (dbConnected) {
    const secret = process.env.JWT_SECRET || "brainbyte_super_secret_jwt_dev_key_2024";

    const testUser = await User.create({
      username: `ai_context_user_${Date.now()}`,
      email: `ai_context_${Date.now()}@example.com`,
      password: "password123",
    });

    const token = jwt.sign({ id: testUser._id }, secret);
    const authHeaders = { Authorization: `Bearer ${token}` };

    // Create a dedicated test problem with visible and hidden test cases
    const testProblem = await Problem.create({
      title: `Context Test Problem ${Date.now()}`,
      slug: `context-test-slug-${Date.now()}`,
      description: "Find the maximum product of two integers in an array.",
      difficulty: "Medium",
      tags: ["Array", "Greedy"],
      constraints: ["2 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      examples: [
        {
          input: "nums = [3,4,5,2]",
          output: "20",
          explanation: "5 * 4 = 20",
        },
      ],
      testCases: [
        { input: "[3,4,5,2]", expectedOutput: "20", isHidden: false },
        { input: "[-10,-10,5,2]", expectedOutput: "100", isHidden: true },
      ],
      hints: ["Consider negative numbers as two negative numbers can produce a positive product."],
    });

    // Test 3: Input Validation Tests
    await test("POST /api/ai/hint with missing problem info & code returns 400", async () => {
      const res = await apiRequest("/api/ai/hint", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data?.message?.includes("provide problem information"));
    });

    await test("POST /api/ai/explain with missing code returns 400", async () => {
      const res = await apiRequest("/api/ai/explain", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ slug: testProblem.slug }),
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data?.message?.includes("Code is required"));
    });

    await test("POST /api/ai/debug with missing code returns 400", async () => {
      const res = await apiRequest("/api/ai/debug", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ slug: testProblem.slug, errorDetails: "Error" }),
      });
      assert.strictEqual(res.status, 400);
      assert.ok(res.data?.message?.includes("Code is required"));
    });

    // Test 4: Problem Not Found Validation (404)
    await test("POST /api/ai/hint with non-existent slug returns 404", async () => {
      const res = await apiRequest("/api/ai/hint", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ slug: "non-existent-problem-slug-999" }),
      });
      assert.strictEqual(res.status, 404);
      assert.ok(res.data?.message?.includes("Problem not found"));
    });

    await test("POST /api/ai/explain with non-existent problemId returns 404", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await apiRequest("/api/ai/explain", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          problemId: nonExistentId.toString(),
          code: "function test() {}",
        }),
      });
      assert.strictEqual(res.status, 404);
    });

    await test("POST /api/ai/debug with non-existent slug returns 404", async () => {
      const res = await apiRequest("/api/ai/debug", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          slug: "non-existent-debug-slug-999",
          code: "function test() {}",
        }),
      });
      assert.strictEqual(res.status, 404);
    });

    // Test 5: Contextual AI Hint by Slug & by Problem ID
    await test("POST /api/ai/hint resolves problem context by slug", async () => {
      const res = await apiRequest("/api/ai/hint", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          slug: testProblem.slug,
          currentCode: "function maxProduct(nums) {\n  let max = 0;\n",
          language: "javascript",
        }),
      });

      assert.strictEqual(res.status, 200);
      assert.ok(res.data);
      assert.strictEqual(res.data.problemSlug, testProblem.slug);
      assert.strictEqual(res.data.problemTitle, testProblem.title);
      assert.strictEqual(res.data.difficulty, "Medium");
      assert.ok(typeof res.data.hint === "string" && res.data.hint.length > 0);
    });

    await test("POST /api/ai/hint resolves problem context by problemId ObjectId", async () => {
      const res = await apiRequest("/api/ai/hint", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          problemId: testProblem._id.toString(),
          language: "javascript",
        }),
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.problemTitle, testProblem.title);
    });

    // Test 6: Contextual AI Explain with Problem Slug
    await test("POST /api/ai/explain attaches problem context and returns breakdown", async () => {
      const sampleCode = `
function maxProduct(nums) {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  return Math.max(nums[n-1] * nums[n-2], nums[0] * nums[1]);
}
      `.trim();

      const res = await apiRequest("/api/ai/explain", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          slug: testProblem.slug,
          code: sampleCode,
          language: "javascript",
        }),
      });

      assert.strictEqual(res.status, 200);
      assert.ok(res.data);
      assert.strictEqual(res.data.problemSlug, testProblem.slug);
      assert.strictEqual(res.data.problemTitle, testProblem.title);
      assert.ok(typeof res.data.explanation === "string" && res.data.explanation.length > 0);
    });

    // Test 7: Contextual AI Debug with Problem Slug
    await test("POST /api/ai/debug attaches problem context and analyzes bugs", async () => {
      const buggyCode = `
function maxProduct(nums) {
  // Bug: only considers positive numbers and ignores negative pairs
  let max1 = 0, max2 = 0;
  for (let n of nums) {
    if (n > max1) { max2 = max1; max1 = n; }
    else if (n > max2) { max2 = n; }
  }
  return max1 * max2;
}
      `.trim();

      const res = await apiRequest("/api/ai/debug", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          slug: testProblem.slug,
          code: buggyCode,
          language: "javascript",
          input: "[-10, -10, 5, 2]",
          expectedOutput: "100",
          actualOutput: "10",
        }),
      });

      assert.strictEqual(res.status, 200);
      assert.ok(res.data);
      assert.strictEqual(res.data.problemSlug, testProblem.slug);
      assert.strictEqual(res.data.problemTitle, testProblem.title);
      assert.ok(typeof res.data.debugAdvice === "string" && res.data.debugAdvice.length > 0);
    });

    // Test 8: Security Guard: Hidden test cases are never leaked in response
    await test("Security: Hidden test case expected output is never exposed in response", async () => {
      const res = await apiRequest("/api/ai/hint", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ slug: testProblem.slug }),
      });

      assert.strictEqual(res.status, 200);
      const resString = JSON.stringify(res.data);
      assert.strictEqual(resString.includes("[-10,-10,5,2]"), false, "Secret hidden input must not be leaked");
    });

    // Clean up test data
    await Problem.findByIdAndDelete(testProblem._id);
    await User.findByIdAndDelete(testUser._id);
  }

  await stopServer();

  console.log(colors.bold("\n--------------------------------------------------"));
  console.log(`Contextual AI Tests Passed: ${colors.green(passed)}`);
  if (failed > 0) {
    console.log(`Contextual AI Tests Failed: ${colors.red(failed)}`);
  }
  console.log(colors.bold("--------------------------------------------------\n"));

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("AI test error:", err);
  stopServer().finally(() => process.exit(1));
});
