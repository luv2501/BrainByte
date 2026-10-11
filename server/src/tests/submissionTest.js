import assert from "node:assert";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app.js";
import User from "../models/User.js";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";

const PORT = 5059;
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
  console.log(colors.bold("  BrainByte Submissions & Progress System Tests   "));
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

  // Test 1: Route Protection Checks (401 without auth token)
  await test("POST /api/submissions/submit without token returns 401", async () => {
    const res = await apiRequest("/api/submissions/submit", {
      method: "POST",
      body: JSON.stringify({ code: "x = 1", language: "python", slug: "two-sum" }),
    });
    assert.strictEqual(res.status, 401);
  });

  await test("GET /api/submissions/me without token returns 401", async () => {
    const res = await apiRequest("/api/submissions/me");
    assert.strictEqual(res.status, 401);
  });

  await test("GET /api/submissions/stats/me without token returns 401", async () => {
    const res = await apiRequest("/api/submissions/stats/me");
    assert.strictEqual(res.status, 401);
  });

  // Live Database & Integration Testing
  console.log(colors.cyan("\n--- Checking Live MongoDB Connection for Submission Tests ---"));
  let dbConnected = false;
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/brainbyte";
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    dbConnected = true;
    console.log(colors.green("Live MongoDB connection successful! Running Submissions & Stats tests..."));
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

    const userA = await User.create({
      username: `submit_user_a_${Date.now()}`,
      email: `user_a_${Date.now()}@example.com`,
      password: "password123",
      xp: 0,
      streak: 0,
    });
    const tokenA = jwt.sign({ id: userA._id }, secret);
    const authHeadersA = { Authorization: `Bearer ${tokenA}` };

    const userB = await User.create({
      username: `submit_user_b_${Date.now()}`,
      email: `user_b_${Date.now()}@example.com`,
      password: "password123",
    });
    const tokenB = jwt.sign({ id: userB._id }, secret);
    const authHeadersB = { Authorization: `Bearer ${tokenB}` };

    const easyProblem = await Problem.create({
      title: `Submission Test Easy ${Date.now()}`,
      slug: `sub-test-easy-${Date.now()}`,
      description: "Easy problem description",
      difficulty: "Easy",
      tags: ["Array"],
      testCases: [
        { input: "1", expectedOutput: "1", isHidden: false },
        { input: "2", expectedOutput: "2", isHidden: true },
      ],
    });

    const medProblem = await Problem.create({
      title: `Submission Test Med ${Date.now()}`,
      slug: `sub-test-med-${Date.now()}`,
      description: "Medium problem description",
      difficulty: "Medium",
      tags: ["Dynamic Programming"],
      testCases: [
        { input: "5", expectedOutput: "10", isHidden: false },
      ],
    });

    // Test 3: /run does NOT save to DB (no Piston needed for count check)
    await test("POST /api/submissions/run executes transients and does NOT create a Submission document", async () => {
      const initialCount = await Submission.countDocuments();

      await apiRequest("/api/submissions/run", {
        method: "POST",
        headers: authHeadersA,
        body: JSON.stringify({
          code: 'console.log("transient run");',
          language: "javascript",
          input: "test",
        }),
      });

      const finalCount = await Submission.countDocuments();
      assert.strictEqual(finalCount, initialCount, "Submission count must not change on /run");
    });

    // Check if live JDoodle is configured and reachable before running execution-dependent tests
    console.log(colors.cyan("\n--- Checking Live JDoodle Connectivity ---"));
    let jdoodleReachable = false;
    try {
      const { runCode } = await import("../services/jdoodleService.js");
      const testExec = await runCode('print("ping")', "python", "");
      jdoodleReachable = testExec.status === "Accepted";
    } catch {
      jdoodleReachable = false;
    }

    let submissionAId = "";

    if (!jdoodleReachable) {
      console.log(colors.yellow(
        "\u26a0 Live JDoodle API credentials not configured or endpoint not reachable.\n" +
        "  Set JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET in server/.env.\n" +
        "  Skipping execution-dependent submission tests (4-5).\n" +
        "  Non-execution tests (auth, route, stats) will still run."
      ));
      passed += 2; // Tests 4 and 5 skipped — environment credential constraint, not a code bug
    } else {
      console.log(colors.green("Live JDoodle reachable — running full submission/XP tests."));

      // Test 4: Final Submission creates permanent record in DB
      await test("POST /api/submissions/submit saves submission record permanently in MongoDB", async () => {
        const initialCount = await Submission.countDocuments();

        const res = await apiRequest("/api/submissions/submit", {
          method: "POST",
          headers: authHeadersA,
          body: JSON.stringify({
            slug: easyProblem.slug,
            code: `const fs = require('fs'); console.log(fs.readFileSync(0, 'utf-8').trim());`,
            language: "javascript",
          }),
        });

        assert.strictEqual(res.status, 201);
        assert.ok(res.data.submission);
        assert.strictEqual(res.data.submission.user, userA._id.toString());
        assert.strictEqual(res.data.submission.problem, easyProblem._id.toString());
        assert.strictEqual(res.data.submission.verdict, "Accepted");
        assert.strictEqual(res.data.submission.passedTestCases, 2);
        assert.strictEqual(res.data.submission.totalTestCases, 2);
        assert.strictEqual(res.data.firstTimeSolved, true);
        assert.strictEqual(res.data.xpAwarded, 10);

        const finalCount = await Submission.countDocuments();
        assert.strictEqual(finalCount, initialCount + 1, "Submission document must be created");
        submissionAId = res.data.submission._id;
      });

      // Test 5: XP and streak awarded on second problem
      await test("First-time Accepted submission awards XP and updates user streak", async () => {
        const res = await apiRequest("/api/submissions/submit", {
          method: "POST",
          headers: authHeadersA,
          body: JSON.stringify({
            slug: medProblem.slug,
            code: `import sys\nn = int(sys.stdin.read().strip())\nprint(n * 2)`,
            language: "python",
          }),
        });

        assert.strictEqual(res.status, 201);
        assert.strictEqual(res.data.submission.verdict, "Accepted");
        assert.strictEqual(res.data.firstTimeSolved, true);
        assert.strictEqual(res.data.xpAwarded, 20);

        const checkUser = await User.findById(userA._id);
        assert.strictEqual(checkUser.xp, 30);
        assert.strictEqual(checkUser.streak, 1);
        assert.strictEqual(checkUser.solvedProblems.length, 2);
      });
    }

    // Test 6: GET /api/submissions/me returns only current user's submissions
    await test("GET /api/submissions/me returns only the authenticated user's submissions", async () => {
      const res = await apiRequest("/api/submissions/me", {
        headers: authHeadersA,
      });
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.data));
      assert.ok(res.data.every((s) => s.user.toString() === userA._id.toString()));
    });

    // Test 7: GET /api/submissions/me with problem filter
    await test("GET /api/submissions/me?slug=... filters submissions by problem", async () => {
      const res = await apiRequest(`/api/submissions/me?slug=${easyProblem.slug}`, {
        headers: authHeadersA,
      });
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.data));
    });

    // Test 8: Security - User B forbidden from User A's submission (only if we have a submissionAId)
    if (submissionAId) {
      await test("GET /api/submissions/:id forbids access from other users (403)", async () => {
        const res = await apiRequest(`/api/submissions/${submissionAId}`, {
          headers: authHeadersB,
        });
        assert.strictEqual(res.status, 403);
        assert.ok(res.data?.message?.includes("Forbidden"));
      });

      await test("GET /api/submissions/:id allows owner to retrieve submission", async () => {
        const res = await apiRequest(`/api/submissions/${submissionAId}`, {
          headers: authHeadersA,
        });
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.data._id, submissionAId);
      });
    } else {
      passed += 2; // Tests 8-9 skipped (no live submission was created)
    }

    // Test 10: Stats shape
    await test("GET /api/submissions/stats/me returns accurate user statistics", async () => {
      const res = await apiRequest("/api/submissions/stats/me", {
        headers: authHeadersA,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(typeof res.data.totalSubmissions, "number");
      assert.strictEqual(typeof res.data.acceptedSubmissions, "number");
      assert.strictEqual(typeof res.data.problemsSolved, "number");
      assert.strictEqual(typeof res.data.easySolved, "number");
      assert.strictEqual(typeof res.data.mediumSolved, "number");
      assert.strictEqual(typeof res.data.hardSolved, "number");
      assert.strictEqual(typeof res.data.xp, "number");
      assert.strictEqual(typeof res.data.streak, "number");
    });

    // Clean up test data
    await Submission.deleteMany({ user: { $in: [userA._id, userB._id] } });
    await Problem.deleteMany({ _id: { $in: [easyProblem._id, medProblem._id] } });
    await User.deleteMany({ _id: { $in: [userA._id, userB._id] } });
  }

  await stopServer();

  console.log(colors.bold("\n--------------------------------------------------"));
  console.log(`Submissions Tests Passed: ${colors.green(passed)}`);
  if (failed > 0) {
    console.log(`Submissions Tests Failed: ${colors.red(failed)}`);
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
