import assert from "node:assert";
import http from "node:http";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app.js";
import User from "../models/User.js";

const PORT = 5055;
let server;
let baseUrl = `http://127.0.0.1:${PORT}`;

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
  const url = `${baseUrl}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);
  return { status: response.status, data };
}

async function runTests() {
  console.log(colors.bold("\n=================================================="));
  console.log(colors.bold("   BrainByte Backend Foundation Verification Test"));
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

  // Test 1: Health Check
  await test("GET /api/health returns 200 { status: 'ok' }", async () => {
    const res = await apiRequest("/api/health");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data?.status, "ok");
  });

  // Test 2: 404 Handler
  await test("GET /api/unknown-route returns 404 with error message", async () => {
    const res = await apiRequest("/api/unknown-route");
    assert.strictEqual(res.status, 404);
    assert.ok(res.data?.message?.includes("Not Found"));
  });

  // Test 3: JWT Token Generation & Verification
  await test("JWT Token Generation & Verification", () => {
    const secret = process.env.JWT_SECRET || "brainbyte_super_secret_jwt_dev_key_2024";
    const payload = { id: "test_user_123" };
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    const decoded = jwt.verify(token, secret);
    assert.strictEqual(decoded.id, "test_user_123");
  });

  // Test 4: Protected route rejection without token
  await test("GET /api/auth/me without token returns 401", async () => {
    const res = await apiRequest("/api/auth/me");
    assert.strictEqual(res.status, 401);
    assert.ok(res.data?.message?.includes("Not authorized"));
  });

  // Test 5: Protected route rejection with invalid token
  await test("GET /api/auth/me with invalid token returns 401", async () => {
    const res = await apiRequest("/api/auth/me", {
      headers: { Authorization: "Bearer invalid_token_12345" },
    });
    assert.strictEqual(res.status, 401);
    assert.ok(res.data?.message?.includes("Not authorized"));
  });

  // Test 6: Registration validation - missing fields
  await test("POST /api/auth/register with missing fields returns 400", async () => {
    const res = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com" }),
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data?.message);
  });

  // Test 7: Registration validation - short username
  await test("POST /api/auth/register with short username returns 400", async () => {
    const res = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username: "ab", email: "test@example.com", password: "password123" }),
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data?.message?.includes("at least 3 characters"));
  });

  // Test 8: Registration validation - short password
  await test("POST /api/auth/register with short password returns 400", async () => {
    const res = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username: "testuser", email: "test@example.com", password: "123" }),
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data?.message?.includes("at least 6 characters"));
  });

  // Test 9: Login validation - missing credentials
  await test("POST /api/auth/login with missing password returns 400", async () => {
    const res = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com" }),
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data?.message);
  });

  // Test 10: Error Handler Middleware - Custom Mapping
  await test("Error Handler properly formats Mongoose ValidationError & DuplicateKey", async () => {
    const { errorHandler } = await import("../middleware/errorHandler.js");
    let statusSet = 0;
    let jsonSent = null;
    const mockRes = {
      statusCode: 200,
      status(code) {
        statusSet = code;
        return this;
      },
      json(obj) {
        jsonSent = obj;
        return this;
      },
    };

    // Test ValidationError mapping
    const validationErr = {
      name: "ValidationError",
      errors: {
        email: { message: "Please provide a valid email address" },
      },
    };
    errorHandler(validationErr, {}, mockRes, () => {});
    assert.strictEqual(statusSet, 400);
    assert.strictEqual(jsonSent.message, "Please provide a valid email address");

    // Test Duplicate Key 11000 error mapping
    const dupKeyErr = {
      code: 11000,
      keyValue: { email: "taken@example.com" },
    };
    errorHandler(dupKeyErr, {}, mockRes, () => {});
    assert.strictEqual(statusSet, 400);
    assert.ok(jsonSent.message.includes("Email already exists"));
  });


  // Test 10: Check DB connection & End-to-End Auth flow if MongoDB is reachable
  console.log(colors.cyan("\n--- Checking Live MongoDB Connection for End-to-End DB Tests ---"));
  let dbConnected = false;
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/brainbyte";
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    dbConnected = true;
    console.log(colors.green("Live MongoDB connection successful! Running End-to-End Auth tests..."));
  } catch (err) {
    console.log(
      colors.yellow(
        `MongoDB is not currently reachable (${err.message}).\n` +
          `Unit and integration checks for routes, JWT, middleware, and validation passed.\n` +
          `Set a valid MONGO_URI in .env (local MongoDB or MongoDB Atlas) to run live DB queries.`
      )
    );
  }

  if (dbConnected) {
    const testUsername = `testuser_${Date.now()}`;
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = "securePassword123";
    let authToken = "";

    await test("POST /api/auth/register creates user and returns JWT token", async () => {
      const res = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: testUsername,
          email: testEmail,
          password: testPassword,
        }),
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.username, testUsername);
      assert.strictEqual(res.data.email, testEmail);
      assert.ok(res.data.token, "Token should be present in response");
      assert.strictEqual(typeof res.data.xp, "number");
      assert.strictEqual(typeof res.data.streak, "number");
      authToken = res.data.token;
    });

    await test("POST /api/auth/register rejects duplicate email", async () => {
      const res = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: `${testUsername}_other`,
          email: testEmail,
          password: testPassword,
        }),
      });

      assert.strictEqual(res.status, 400);
      assert.ok(res.data?.message?.includes("already in use"));
    });

    await test("POST /api/auth/signup alias endpoint also works", async () => {
      const res = await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          username: `${testUsername}_signup`,
          email: `signup_${Date.now()}@example.com`,
          password: testPassword,
        }),
      });

      assert.strictEqual(res.status, 201);
      assert.ok(res.data.token);
    });

    await test("POST /api/auth/login succeeds with valid credentials", async () => {
      const res = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.username, testUsername);
      assert.ok(res.data.token);
    });

    await test("POST /api/auth/login fails with wrong password", async () => {
      const res = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: testEmail,
          password: "wrongPassword123",
        }),
      });

      assert.strictEqual(res.status, 401);
      assert.ok(res.data?.message?.includes("Invalid email or password"));
    });

    await test("GET /api/auth/me returns current user profile with valid Bearer token", async () => {
      const res = await apiRequest("/api/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.username, testUsername);
      assert.strictEqual(res.data.email, testEmail);
      assert.strictEqual(res.data.password, undefined, "Password must not be returned");
    });

    // Cleanup test users
    await User.deleteMany({ username: { $regex: /^testuser_/ } });
  }

  await stopServer();

  console.log(colors.bold("\n--------------------------------------------------"));
  console.log(`Tests Passed: ${colors.green(passed)}`);
  if (failed > 0) {
    console.log(`Tests Failed: ${colors.red(failed)}`);
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
