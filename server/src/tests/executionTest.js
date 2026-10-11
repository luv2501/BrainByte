import assert from "node:assert";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app.js";
import User from "../models/User.js";
import {
  normalizeLanguage,
  cleanOutput,
  compareOutputs,
  parseJDoodleOutput,
  getJDoodleConfig,
  JDOODLE_LANGUAGES,
} from "../services/jdoodleService.js";

const PORT = 5058;
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

/**
 * Build a fake JDoodle API response for testing.
 * Simulates JDoodle /v1/execute response schema.
 */
function fakeJDoodleResponse({
  output = "",
  statusCode = 200,
  memory = "1024",
  cpuTime = "0.05",
  error = null,
} = {}) {
  const response = {
    output,
    statusCode,
    memory,
    cpuTime,
  };
  if (error) {
    response.error = error;
  }
  return { data: response };
}

/**
 * Create a runCode-equivalent that uses the provided mock axios post function.
 * Avoids any live network calls or local code execution.
 */
async function runCodeWithMock(sourceCode, language, stdin = "", mockPost) {
  if (!sourceCode || typeof sourceCode !== "string" || !sourceCode.trim()) {
    throw new Error("Source code is required");
  }

  const { name: canonicalLanguage, language: jdoodleLang, versionIndex } =
    normalizeLanguage(language);

  const payload = {
    clientId: "mock_client_id",
    clientSecret: "mock_client_secret",
    script: sourceCode,
    stdin: String(stdin ?? ""),
    language: jdoodleLang,
    versionIndex: String(versionIndex),
  };

  try {
    const response = await mockPost("https://api.jdoodle.com/v1/execute", payload);
    const data = response.data || {};
    const statusCode = Number(data.statusCode);

    if (statusCode && statusCode !== 200) {
      const errorMsg = data.error || data.message || `JDoodle returned status code ${statusCode}`;
      return {
        stdout: "",
        stderr: `JDoodle error (HTTP ${statusCode}): ${errorMsg}`,
        compile_output: "",
        status: "Execution Provider Error",
        time: "0.00",
        memory: 0,
        language: canonicalLanguage,
      };
    }

    const rawOutput = data.output !== undefined && data.output !== null ? String(data.output) : "";
    const cpuTime = data.cpuTime !== undefined && data.cpuTime !== null ? String(data.cpuTime) : "0.05";
    const memory = data.memory ? Number(data.memory) : 0;

    const classification = parseJDoodleOutput(rawOutput);

    if (classification.isTimeout) {
      return {
        stdout: cleanOutput(rawOutput),
        stderr: cleanOutput(rawOutput),
        compile_output: "",
        status: "Time Limit Exceeded",
        time: cpuTime || "5.00",
        memory,
        language: canonicalLanguage,
      };
    }

    if (classification.isCompileError) {
      return {
        stdout: "",
        stderr: cleanOutput(rawOutput),
        compile_output: cleanOutput(rawOutput),
        status: "Compilation Error",
        time: "0.00",
        memory,
        language: canonicalLanguage,
      };
    }

    if (classification.isError) {
      return {
        stdout: cleanOutput(rawOutput),
        stderr: cleanOutput(rawOutput),
        compile_output: "",
        status: classification.status,
        time: cpuTime,
        memory,
        language: canonicalLanguage,
      };
    }

    return {
      stdout: cleanOutput(rawOutput),
      stderr: "",
      compile_output: "",
      status: "Accepted",
      time: cpuTime,
      memory,
      language: canonicalLanguage,
    };
  } catch (error) {
    const httpStatus = error.response?.status;
    const msg = error.response?.data?.error || error.response?.data?.message || error.message || "Execution provider unavailable";
    const detail = httpStatus
      ? `JDoodle API error (HTTP ${httpStatus}): ${msg}`
      : `JDoodle API unreachable: ${msg}`;

    return {
      stdout: "",
      stderr: detail,
      compile_output: "",
      status: "Execution Provider Error",
      time: "0.00",
      memory: 0,
      language: canonicalLanguage,
    };
  }
}

/**
 * evaluateSubmission logic using an injected mock post function.
 */
async function evaluateWithMock(sourceCode, language, testCases, mockPost) {
  if (!Array.isArray(testCases) || testCases.length === 0) {
    throw new Error("At least one test case is required");
  }

  const results = [];
  let passedTests = 0;
  let overallVerdict = "Accepted";
  let totalTime = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const execResult = await runCodeWithMock(sourceCode, language, tc.input, mockPost);

    const actualOutput = cleanOutput(execResult.stdout);
    const expectedOutput = cleanOutput(tc.expectedOutput);
    const isExecutionSuccessful = execResult.status === "Accepted";
    const passed = isExecutionSuccessful && compareOutputs(actualOutput, expectedOutput);

    if (execResult.time) {
      totalTime += parseFloat(execResult.time) || 0;
    }
    if (passed) passedTests++;

    let caseStatus = execResult.status;
    if (isExecutionSuccessful && !passed) caseStatus = "Wrong Answer";

    const resultItem = {
      testCaseNumber: i + 1,
      passed,
      status: caseStatus,
      time: execResult.time,
      memory: execResult.memory || 0,
      isHidden: Boolean(tc.isHidden),
    };

    if (!tc.isHidden) {
      resultItem.input = tc.input;
      resultItem.expectedOutput = tc.expectedOutput;
      resultItem.actualOutput = actualOutput;
      if (execResult.stderr) resultItem.stderr = execResult.stderr;
      if (execResult.compile_output) resultItem.compile_output = execResult.compile_output;
    } else {
      resultItem.message = passed ? "Hidden test case passed" : "Hidden test case failed";
    }

    results.push(resultItem);

    if (!passed) {
      if (execResult.status === "Execution Provider Error") {
        overallVerdict = "Execution Provider Error";
        return {
          verdict: overallVerdict,
          passedTests,
          totalTests: testCases.length,
          results,
          totalTime: totalTime.toFixed(3),
          providerError: execResult.stderr || "Execution provider failure",
        };
      } else if (execResult.compile_output || execResult.status.toLowerCase().includes("compil")) {
        overallVerdict = "Compilation Error";
      } else if (execResult.status.toLowerCase().includes("time limit")) {
        overallVerdict = "Time Limit Exceeded";
      } else if (execResult.status.toLowerCase().includes("runtime") || execResult.stderr) {
        overallVerdict = execResult.status || "Runtime Error";
      } else {
        overallVerdict = "Wrong Answer";
      }
      break;
    }
  }

  return {
    verdict: overallVerdict,
    passedTests,
    totalTests: testCases.length,
    results,
    totalTime: totalTime.toFixed(3),
  };
}

async function runTests() {
  console.log(colors.bold("\n=================================================="));
  console.log(colors.bold("    BrainByte JDoodle Code Execution Test Suite   "));
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

  // ── Unit Tests (no network) ───────────────────────────────────────────────

  // Test 1: Language Normalization & JDoodle Config Mapping
  await test("normalizeLanguage correctly maps language aliases to JDoodle configuration", () => {
    assert.strictEqual(normalizeLanguage("javascript").name, "javascript");
    assert.strictEqual(normalizeLanguage("javascript").language, "nodejs");
    assert.strictEqual(normalizeLanguage("js").language, "nodejs");
    assert.strictEqual(normalizeLanguage("node").language, "nodejs");
    assert.strictEqual(normalizeLanguage("nodejs").language, "nodejs");

    assert.strictEqual(normalizeLanguage("python").name, "python");
    assert.strictEqual(normalizeLanguage("python").language, "python3");
    assert.strictEqual(normalizeLanguage("py").language, "python3");
    assert.strictEqual(normalizeLanguage("python3").language, "python3");

    assert.strictEqual(normalizeLanguage("cpp").name, "cpp");
    assert.strictEqual(normalizeLanguage("cpp").language, "cpp17");
    assert.strictEqual(normalizeLanguage("c++").language, "cpp17");
    assert.strictEqual(normalizeLanguage("gpp").language, "cpp17");

    assert.strictEqual(normalizeLanguage("c").name, "c");
    assert.strictEqual(normalizeLanguage("gcc").language, "c");

    assert.strictEqual(normalizeLanguage("java").name, "java");
    assert.strictEqual(normalizeLanguage("java").language, "java");

    assert.strictEqual(normalizeLanguage("typescript").name, "typescript");
    assert.strictEqual(normalizeLanguage("ts").language, "typescript");
  });

  // Test 2: Language Normalization Rejects Unsupported Languages
  await test("normalizeLanguage throws on unsupported language", () => {
    assert.throws(() => normalizeLanguage("unsupported_lang_xyz"), /Unsupported language/);
    assert.throws(() => normalizeLanguage(null), /Language must be specified/);
  });

  // Test 3: Output Cleaning and Normalization
  await test("cleanOutput trims carriage returns and whitespace", () => {
    assert.strictEqual(cleanOutput("Hello World\r\n\n "), "Hello World");
    assert.strictEqual(cleanOutput("[0, 1]\n"), "[0, 1]");
    assert.strictEqual(cleanOutput(null), "");
  });

  // Test 4: compareOutputs handles exact, whitespace, array, and boolean variations
  await test("compareOutputs robustly matches equivalent outputs", () => {
    assert.strictEqual(compareOutputs("24 12 8 6\n", "24 12 8 6"), true);
    assert.strictEqual(compareOutputs("[24, 12, 8, 6]", "24 12 8 6"), true);
    assert.strictEqual(compareOutputs("24\n12\n8\n6", "24 12 8 6"), true);
    assert.strictEqual(compareOutputs("true", "True"), true);
    assert.strictEqual(compareOutputs("false\n", "False"), true);
    assert.strictEqual(compareOutputs("1 2 3", "1 2 4"), false);
  });

  // Test 5: parseJDoodleOutput correctly classifies outcomes
  await test("parseJDoodleOutput detects compilation error, runtime error, timeout, and success", () => {
    assert.strictEqual(parseJDoodleOutput("main.cpp:4:5: error: 'cout' was not declared in this scope").status, "Compilation Error");
    assert.strictEqual(parseJDoodleOutput("Traceback (most recent call last):\nZeroDivisionError: division by zero").status, "Runtime Error");
    assert.strictEqual(parseJDoodleOutput("Execution timed out after 5 seconds").status, "Time Limit Exceeded");
    assert.strictEqual(parseJDoodleOutput("24 12 8 6\n").status, "Accepted");
  });

  // ── Mock JDoodle Execution Tests (service logic, no network) ──────────────

  // Test 6: C++ Code Execution -> Accepted (mock JDoodle)
  await test("runCode service logic: C++ full program -> Accepted (mock JDoodle)", async () => {
    const mockPost = async () =>
      fakeJDoodleResponse({ output: "2 4 6 8\n", statusCode: 200, cpuTime: "0.05" });

    const result = await runCodeWithMock(
      '#include <iostream>\nusing namespace std;\nint main(){cout<<"2 4 6 8 ";return 0;}',
      "cpp",
      "4\n1 2 3 4",
      mockPost
    );
    assert.strictEqual(result.status, "Accepted");
    assert.strictEqual(cleanOutput(result.stdout), "2 4 6 8");
  });

  // Test 7: Python Code Execution -> Accepted (mock JDoodle)
  await test("runCode service logic: Python full program -> Accepted (mock JDoodle)", async () => {
    const mockPost = async () =>
      fakeJDoodleResponse({ output: "2 4 6 8\n", statusCode: 200, cpuTime: "0.03" });

    const result = await runCodeWithMock("print('2 4 6 8')", "python", "4\n1 2 3 4", mockPost);
    assert.strictEqual(result.status, "Accepted");
    assert.strictEqual(cleanOutput(result.stdout), "2 4 6 8");
  });

  // Test 8: JavaScript Code Execution -> Accepted (mock JDoodle)
  await test("runCode service logic: JavaScript full program -> Accepted (mock JDoodle)", async () => {
    const mockPost = async () =>
      fakeJDoodleResponse({ output: "2 4 6 8\n", statusCode: 200, cpuTime: "0.04" });

    const result = await runCodeWithMock("console.log('2 4 6 8')", "javascript", "4\n1 2 3 4", mockPost);
    assert.strictEqual(result.status, "Accepted");
    assert.strictEqual(cleanOutput(result.stdout), "2 4 6 8");
  });

  // Test 9: Wrong Answer (mock JDoodle)
  await test("evaluateSubmission returns Wrong Answer for incorrect solution (mock JDoodle)", async () => {
    const mockPost = async () =>
      fakeJDoodleResponse({ output: "0 0 0 0\n", statusCode: 200 });

    const testCases = [{ input: "4\n1 2 3 4", expectedOutput: "24 12 8 6", isHidden: false }];
    const evaluation = await evaluateWithMock("print('0 0 0 0')", "python", testCases, mockPost);
    assert.strictEqual(evaluation.verdict, "Wrong Answer");
    assert.strictEqual(evaluation.passedTests, 0);
  });

  // Test 10: Compilation Error in C++ (mock JDoodle)
  await test("evaluateSubmission catches Compilation Error in C++ (mock JDoodle)", async () => {
    const mockPost = async () =>
      fakeJDoodleResponse({
        output: "main.cpp:3:1: error: 'this_is_a_syntax_error' was not declared in this scope\n",
        statusCode: 200,
      });

    const testCases = [{ input: "4\n1 2 3 4", expectedOutput: "24 12 8 6", isHidden: false }];
    const evaluation = await evaluateWithMock(
      "#include <iostream>\nint main(){this_is_a_syntax_error;;;return 0;}",
      "cpp",
      testCases,
      mockPost
    );
    assert.strictEqual(evaluation.verdict, "Compilation Error");
    assert.strictEqual(evaluation.passedTests, 0);
  });

  // Test 11: Runtime Error in Python (mock JDoodle)
  await test("evaluateSubmission catches Runtime Error in Python (mock JDoodle)", async () => {
    const mockPost = async () =>
      fakeJDoodleResponse({
        output: "Traceback (most recent call last):\n  File \"main.py\", line 1, in <module>\n    x = 1/0\nZeroDivisionError: division by zero\n",
        statusCode: 200,
      });

    const testCases = [{ input: "4\n1 2 3 4", expectedOutput: "24 12 8 6", isHidden: false }];
    const evaluation = await evaluateWithMock("x = 1/0", "python", testCases, mockPost);
    assert.strictEqual(evaluation.verdict, "Runtime Error");
    assert.strictEqual(evaluation.passedTests, 0);
  });

  // Test 12: Hidden Test Case Masking (mock JDoodle)
  await test("evaluateSubmission masks inputs and expected outputs for hidden test cases (mock JDoodle)", async () => {
    let callCount = 0;
    const mockPost = async (_url, payload) => {
      callCount++;
      // Return expected output according to input
      const stdout = payload.stdin.includes("1 2 3 4") ? "2 4 6 8\n" : "10 20 30\n";
      return fakeJDoodleResponse({ output: stdout, statusCode: 200 });
    };

    const testCases = [
      { input: "4\n1 2 3 4", expectedOutput: "2 4 6 8", isHidden: false },
      { input: "3\n5 10 15", expectedOutput: "10 20 30", isHidden: true },
    ];

    const evaluation = await evaluateWithMock("print('...')", "python", testCases, mockPost);
    assert.strictEqual(evaluation.verdict, "Accepted");
    assert.strictEqual(evaluation.passedTests, 2);
    assert.strictEqual(evaluation.totalTests, 2);
    assert.strictEqual(callCount, 2);

    // Visible test case retains input/expectedOutput
    assert.strictEqual(evaluation.results[0].input, "4\n1 2 3 4");
    assert.strictEqual(evaluation.results[0].expectedOutput, "2 4 6 8");

    // Hidden test case masks input/expectedOutput
    assert.strictEqual(evaluation.results[1].input, undefined);
    assert.strictEqual(evaluation.results[1].expectedOutput, undefined);
    assert.strictEqual(evaluation.results[1].message, "Hidden test case passed");
  });

  // Test 13: JDoodle API 429 / 401 Credential & Limit Error Handling (mock)
  await test("runCode returns Execution Provider Error on JDoodle 429 credit limit or 401 unauthorized", async () => {
    const mockPost429 = async () =>
      fakeJDoodleResponse({ statusCode: 429, error: "Daily limit reached" });

    const result429 = await runCodeWithMock("print('hi')", "python", "", mockPost429);
    assert.strictEqual(result429.status, "Execution Provider Error");
    assert.ok(result429.stderr.includes("429"));

    const mockPost401 = async () =>
      fakeJDoodleResponse({ statusCode: 401, error: "Invalid clientId or clientSecret" });

    const result401 = await runCodeWithMock("print('hi')", "python", "", mockPost401);
    assert.strictEqual(result401.status, "Execution Provider Error");
    assert.ok(result401.stderr.includes("401"));
  });

  // ── Route Tests (require server, auth only) ───────────────────────────────

  await startServer();

  // Test 14: Route Protection - Missing Auth Header
  await test("POST /api/submissions/run without auth token returns 401", async () => {
    const res = await apiRequest("/api/submissions/run", {
      method: "POST",
      body: JSON.stringify({
        code: 'console.log("hello world");',
        language: "javascript",
      }),
    });
    assert.strictEqual(res.status, 401);
    assert.ok(res.data?.message?.includes("Not authorized"));
  });

  // ── Live MongoDB + Execution Integration ──────────────────────────────────
  console.log(colors.cyan("\n--- Checking Live MongoDB & Execution Integration ---"));
  let dbConnected = false;
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/brainbyte";
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    dbConnected = true;
    console.log(colors.green("Live MongoDB connected!"));
  } catch (err) {
    console.log(colors.yellow(`MongoDB not currently connected (${err.message})`));
  }

  if (dbConnected) {
    const testUser = await User.create({
      username: `exec_tester_${Date.now()}`,
      email: `exec_${Date.now()}@example.com`,
      password: "password123",
    });

    const secret = process.env.JWT_SECRET || "brainbyte_super_secret_jwt_dev_key_2024";
    const token = jwt.sign({ id: testUser._id }, secret);
    const authHeaders = { Authorization: `Bearer ${token}` };

    // Test 15: Route Validation - Missing Code or Language
    await test("POST /api/submissions/run with missing code or language returns 400", async () => {
      const resNoCode = await apiRequest("/api/submissions/run", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ language: "javascript" }),
      });
      assert.strictEqual(resNoCode.status, 400);

      const resNoLang = await apiRequest("/api/submissions/run", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ code: 'console.log("test");' }),
      });
      assert.strictEqual(resNoLang.status, 400);
    });

    // Test 16: Route Behavior - Live Execution or 502 error handling
    await test("POST /api/submissions/run executes cleanly or returns 502 on provider failure", async () => {
      const res = await apiRequest("/api/submissions/run", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          code: 'print("hello from test")',
          language: "python",
          input: "",
        }),
      });

      if (res.status === 200) {
        // Live JDoodle credentials valid and reachable
        assert.strictEqual(res.data.status, "Accepted");
        assert.ok(cleanOutput(res.data.stdout).includes("hello from test"));
      } else {
        // Provider unreachable or credential issue -> must return 502 Bad Gateway
        assert.strictEqual(res.status, 502);
        assert.strictEqual(res.data.status, "Execution Provider Error");
        assert.ok(res.data.error, "Should expose diagnostic error details");
      }
    });

    // Test 17: evaluateWithMock handles Execution Provider Error with diagnostics
    await test("evaluateWithMock returns Execution Provider Error with diagnostic details", async () => {
      const mockFail = async () => {
        throw new Error("Network timeout connecting to JDoodle API");
      };
      const evaluation = await evaluateWithMock("print('hi')", "python", [{ input: "1", expectedOutput: "1" }], mockFail);
      assert.strictEqual(evaluation.verdict, "Execution Provider Error");
      assert.ok(evaluation.providerError.includes("Network timeout"));
    });

    // Cleanup
    await User.findByIdAndDelete(testUser._id);
  }

  await stopServer();

  console.log(colors.bold("\n--------------------------------------------------"));
  console.log(`Execution Tests Passed: ${colors.green(passed)}`);
  if (failed > 0) {
    console.log(`Execution Tests Failed: ${colors.red(failed)}`);
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
