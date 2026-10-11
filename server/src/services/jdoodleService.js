import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * JDoodle Language and Version Configuration
 * JDoodle uses:
 * - language: language code (e.g. "cpp17", "c", "python3", "nodejs", "typescript", "java")
 * - versionIndex: index number as string for the language version (e.g. "0", "1", "2", ...)
 */
export const JDOODLE_LANGUAGES = {
  // C++ (GCC / C++17)
  cpp: {
    canonical: "cpp",
    language: "cpp17",
    versionIndex: "1",
  },
  "c++": {
    canonical: "cpp",
    language: "cpp17",
    versionIndex: "1",
  },
  cpp17: {
    canonical: "cpp",
    language: "cpp17",
    versionIndex: "1",
  },
  gpp: {
    canonical: "cpp",
    language: "cpp17",
    versionIndex: "1",
  },

  // C (GCC)
  c: {
    canonical: "c",
    language: "c",
    versionIndex: "5",
  },
  gcc: {
    canonical: "c",
    language: "c",
    versionIndex: "5",
  },

  // Python (Python 3)
  python: {
    canonical: "python",
    language: "python3",
    versionIndex: "4",
  },
  py: {
    canonical: "python",
    language: "python3",
    versionIndex: "4",
  },
  python3: {
    canonical: "python",
    language: "python3",
    versionIndex: "4",
  },

  // JavaScript (Node.js)
  javascript: {
    canonical: "javascript",
    language: "nodejs",
    versionIndex: "4",
  },
  js: {
    canonical: "javascript",
    language: "nodejs",
    versionIndex: "4",
  },
  node: {
    canonical: "javascript",
    language: "nodejs",
    versionIndex: "4",
  },
  nodejs: {
    canonical: "javascript",
    language: "nodejs",
    versionIndex: "4",
  },

  // TypeScript
  typescript: {
    canonical: "typescript",
    language: "typescript",
    versionIndex: "0",
  },
  ts: {
    canonical: "typescript",
    language: "typescript",
    versionIndex: "0",
  },

  // Java
  java: {
    canonical: "java",
    language: "java",
    versionIndex: "4",
  },
};

/**
 * Normalize language input to canonical name and JDoodle metadata
 * @param {string} lang
 * @returns {{ name: string, language: string, versionIndex: string }}
 */
export const normalizeLanguage = (lang) => {
  if (!lang || typeof lang !== "string") {
    throw new Error("Language must be specified as a string");
  }

  const normalized = lang.toLowerCase().trim();
  const config = JDOODLE_LANGUAGES[normalized];

  if (!config) {
    const supported = ["cpp", "c", "python", "javascript", "typescript", "java"];
    throw new Error(`Unsupported language '${lang}'. Supported languages: ${supported.join(", ")}`);
  }

  return {
    name: config.canonical,
    language: config.language,
    versionIndex: config.versionIndex,
  };
};

/**
 * Get JDoodle client credentials and API URL from environment variables
 */
export const getJDoodleConfig = () => {
  const endpoint = process.env.JDOODLE_API_URL || "https://api.jdoodle.com/v1/execute";
  const clientId = process.env.JDOODLE_CLIENT_ID || "";
  const clientSecret = process.env.JDOODLE_CLIENT_SECRET || "";

  return {
    endpoint,
    clientId,
    clientSecret,
  };
};

/**
 * Standardize text comparison by removing carriage returns and trimming outer whitespace
 * @param {string} text
 * @returns {string}
 */
export const cleanOutput = (text) => {
  if (text === null || text === undefined) return "";
  return String(text).replace(/\r\n/g, "\n").trim();
};

/**
 * Robust output comparison logic
 * Compares stdout against expectedOutput supporting exact, whitespace-insensitive,
 * array-tokenized, and boolean matching.
 * @param {string} actual
 * @param {string} expected
 * @returns {boolean}
 */
export const compareOutputs = (actual, expected) => {
  const cleanActual = cleanOutput(actual);
  const cleanExpected = cleanOutput(expected);

  // 1. Direct equality
  if (cleanActual === cleanExpected) return true;

  // 2. Case-insensitive boolean comparison ("true" vs "True")
  if (["true", "false"].includes(cleanExpected.toLowerCase())) {
    if (cleanActual.toLowerCase() === cleanExpected.toLowerCase()) return true;
  }

  // 3. Token-by-token comparison (handles arbitrary whitespace or newline separation)
  const actualTokens = cleanActual.split(/\s+/).filter(Boolean);
  const expectedTokens = cleanExpected.split(/\s+/).filter(Boolean);

  if (actualTokens.length > 0 && actualTokens.length === expectedTokens.length) {
    const tokensMatch = actualTokens.every((tok, idx) => tok === expectedTokens[idx]);
    if (tokensMatch) return true;
  }

  // 4. Bracket/comma stripped comparison for lists/arrays: e.g. "[24, 12, 8, 6]" vs "24 12 8 6" or "[24,12,8,6]"
  const stripList = (str) =>
    str.replace(/[\[\]\(\)\{\},"]/g, " ").trim().split(/\s+/).filter(Boolean);
  const actualStripped = stripList(cleanActual);
  const expectedStripped = stripList(cleanExpected);

  if (actualStripped.length > 0 && actualStripped.length === expectedStripped.length) {
    const strippedMatch = actualStripped.every((tok, idx) => tok.toLowerCase() === expectedStripped[idx].toLowerCase());
    if (strippedMatch) return true;
  }

  return false;
};

/**
 * Helper to classify compiler error vs runtime error vs timeout from JDoodle output
 * @param {string} rawOutput
 * @returns {{ status: string, isError: boolean, isCompileError: boolean, isTimeout: boolean }}
 */
export const parseJDoodleOutput = (rawOutput = "") => {
  const text = cleanOutput(rawOutput);

  // 1. Check timeout
  if (
    /timeout/i.test(text) ||
    /time\s*limit\s*exceeded/i.test(text) ||
    /execution\s*timed\s*out/i.test(text)
  ) {
    return { status: "Time Limit Exceeded", isError: true, isCompileError: false, isTimeout: true };
  }

  // 2. Check runtime errors first (Python traceback, Java uncaught exception, memory fault)
  if (
    /traceback\s*\(most\s*recent\s*call\s*last\)/i.test(text) ||
    /exception\s*in\s*thread/i.test(text) ||
    /runtime\s*error/i.test(text) ||
    /segmentation\s*fault/i.test(text) ||
    /core\s*dumped/i.test(text) ||
    /zerodivisionerror/i.test(text) ||
    /indexerror/i.test(text) ||
    /valueerror/i.test(text) ||
    /nameerror/i.test(text) ||
    /nullpointerexception/i.test(text) ||
    /arrayindexoutofboundsexception/i.test(text) ||
    /uncaught\s*error/i.test(text)
  ) {
    return { status: "Runtime Error", isError: true, isCompileError: false, isTimeout: false };
  }

  // 3. Check compilation errors (C/C++ gcc, javac, typescript compiler, syntax error)
  if (
    /error:\s/i.test(text) ||
    /compile\s*error/i.test(text) ||
    /compilation\s*error/i.test(text) ||
    /fatal\s*error:/i.test(text) ||
    /syntaxerror:/i.test(text) ||
    /cannot\s*find\s*symbol/i.test(text) ||
    /undefined\s*reference\s*to/i.test(text) ||
    /ts\d{4}:/i.test(text)
  ) {
    return { status: "Compilation Error", isError: true, isCompileError: true, isTimeout: false };
  }

  return { status: "Accepted", isError: false, isCompileError: false, isTimeout: false };
};

/**
 * Submit user code to JDoodle API and return execution results
 * @param {string} sourceCode - User complete source code
 * @param {string} language - Programming language (e.g. "cpp", "c", "python", "javascript", "java", "typescript")
 * @param {string} stdin - Input string provided via stdin
 * @returns {Promise<{ stdout: string, stderr: string, compile_output: string, status: string, time: string, memory: number, language: string }>}
 */
export const runCode = async (sourceCode, language, stdin = "") => {
  if (!sourceCode || typeof sourceCode !== "string" || !sourceCode.trim()) {
    throw new Error("Source code is required");
  }

  const { name: canonicalLanguage, language: jdoodleLang, versionIndex } =
    normalizeLanguage(language);

  const { endpoint, clientId, clientSecret } = getJDoodleConfig();

  if (!clientId || !clientSecret) {
    return {
      stdout: "",
      stderr: "JDoodle credentials not configured. Please set JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET in server/.env.",
      compile_output: "",
      status: "Execution Provider Error",
      time: "0.00",
      memory: 0,
      language: canonicalLanguage,
    };
  }

  const payload = {
    clientId,
    clientSecret,
    script: sourceCode,
    stdin: String(stdin ?? ""),
    language: jdoodleLang,
    versionIndex: String(versionIndex),
  };

  try {
    const response = await axios.post(endpoint, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 20000,
    });

    const data = response.data || {};
    const statusCode = Number(data.statusCode);

    // Check JDoodle API level error status (401, 429, 400 etc.)
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

    // Normal successful execution
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
    // If JDoodle is unavailable, unauthorized, timed out, or network fails:
    // return a clear execution-provider error. Do NOT execute code locally.
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
};

/**
 * Run user code against multiple test cases and evaluate overall verdict.
 * Masks inputs and expected outputs for hidden test cases.
 * @param {string} sourceCode
 * @param {string} language
 * @param {Array<{ input: string, expectedOutput: string, isHidden?: boolean }>} testCases
 * @returns {Promise<{ verdict: string, passedTests: number, totalTests: number, results: Array, totalTime: string }>}
 */
export const evaluateSubmission = async (sourceCode, language, testCases = []) => {
  if (!Array.isArray(testCases) || testCases.length === 0) {
    throw new Error("At least one test case is required for evaluation");
  }

  const results = [];
  let passedTests = 0;
  let overallVerdict = "Accepted";
  let totalTime = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const execResult = await runCode(sourceCode, language, tc.input);

    const actualOutput = cleanOutput(execResult.stdout);
    const expectedOutput = cleanOutput(tc.expectedOutput);
    const isExecutionSuccessful = execResult.status === "Accepted";
    const passed = isExecutionSuccessful && compareOutputs(actualOutput, expectedOutput);

    if (execResult.time) {
      totalTime += parseFloat(execResult.time) || 0;
    }

    if (passed) {
      passedTests++;
    }

    // Determine individual case status
    let caseStatus = execResult.status;
    if (isExecutionSuccessful && !passed) {
      caseStatus = "Wrong Answer";
    }

    // Mask details for hidden test cases to protect secret grading data
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

    // If a test case failed or error occurred, determine overall verdict and stop early
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
};

export default {
  runCode,
  evaluateSubmission,
  normalizeLanguage,
  cleanOutput,
  compareOutputs,
  parseJDoodleOutput,
  getJDoodleConfig,
  JDOODLE_LANGUAGES,
};
