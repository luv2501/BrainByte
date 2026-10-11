import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Problem from "../models/Problem.js";
import { problemsData } from "../data/problemsData.js";
import { slugify } from "../controllers/problemController.js";

/**
 * Validates a problem data object prior to database insertion.
 * @param {Object} item
 * @returns {{ valid: boolean, reason?: string, sanitized?: Object }}
 */
export const validateProblemData = (item) => {
  if (!item || typeof item !== "object") {
    return { valid: false, reason: "Item is not an object" };
  }

  const { title, description, difficulty, testCases } = item;

  if (!title || typeof title !== "string" || !title.trim()) {
    return { valid: false, reason: "Missing or invalid 'title'" };
  }

  if (!description || typeof description !== "string" || !description.trim()) {
    return { valid: false, reason: `Problem '${title}': missing 'description'` };
  }

  const validDifficulties = ["Easy", "Medium", "Hard"];
  if (!difficulty || !validDifficulties.includes(difficulty)) {
    return {
      valid: false,
      reason: `Problem '${title}': difficulty must be one of [Easy, Medium, Hard], got '${difficulty}'`,
    };
  }

  if (!Array.isArray(testCases) || testCases.length === 0) {
    return {
      valid: false,
      reason: `Problem '${title}': must have at least one test case`,
    };
  }

  // Generate or sanitize slug
  const finalSlug = item.slug ? slugify(item.slug) : slugify(title);
  if (!finalSlug) {
    return { valid: false, reason: `Problem '${title}': unable to compute valid slug` };
  }

  const sanitized = {
    title: title.trim(),
    slug: finalSlug,
    description: description.trim(),
    difficulty,
    tags: Array.isArray(item.tags)
      ? item.tags.map((t) => String(t).trim()).filter(Boolean)
      : [],
    constraints: Array.isArray(item.constraints)
      ? item.constraints.map((c) => String(c).trim()).filter(Boolean)
      : typeof item.constraints === "string" && item.constraints.trim()
      ? [item.constraints.trim()]
      : [],
    examples: Array.isArray(item.examples) ? item.examples : [],
    starterCode: {
      javascript: item.starterCode?.javascript || "",
      python: item.starterCode?.python || "",
      cpp: item.starterCode?.cpp || "",
      c: item.starterCode?.c || "",
      java: item.starterCode?.java || "",
      typescript: item.starterCode?.typescript || "",
    },
    testCases: testCases.map((tc) => ({
      input: String(tc.input ?? ""),
      expectedOutput: String(tc.expectedOutput ?? ""),
      isHidden: Boolean(tc.isHidden),
    })),
    hints: Array.isArray(item.hints)
      ? item.hints.map((h) => String(h).trim()).filter(Boolean)
      : [],
  };

  return { valid: true, sanitized };
};

/**
 * Seeds problems into MongoDB with upsert duplicate prevention.
 * @param {{ clear?: boolean, data?: Array, silent?: boolean }} options
 * @returns {Promise<{ total: number, processed: number, insertedOrUpdated: number, skipped: number, errors: Array }>}
 */
export const seedProblems = async (options = {}) => {
  const { clear = false, data = problemsData, silent = false } = options;

  const log = (...args) => {
    if (!silent) console.log(...args);
  };

  let connectedHere = false;
  if (mongoose.connection.readyState === 0) {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/brainbyte";
    await mongoose.connect(mongoUri);
    connectedHere = true;
  }

  const stats = {
    total: data.length,
    processed: 0,
    insertedOrUpdated: 0,
    skipped: 0,
    errors: [],
  };

  try {
    if (clear) {
      log("🧹 Clearing existing problems from database...");
      await Problem.deleteMany({});
      log("✓ Existing problems cleared.");
    }

    log(`🚀 Seeding ${data.length} curated problems into MongoDB...`);

    for (const item of data) {
      stats.processed++;
      const validation = validateProblemData(item);

      if (!validation.valid) {
        log(`⚠️  Skipping invalid problem: ${validation.reason}`);
        stats.skipped++;
        stats.errors.push({ item, reason: validation.reason });
        continue;
      }

      const problemDoc = validation.sanitized;

      // Upsert by unique slug: update if exists, insert if new
      await Problem.findOneAndUpdate(
        { slug: problemDoc.slug },
        { $set: problemDoc },
        { upsert: true, new: true, runValidators: true }
      );

      stats.insertedOrUpdated++;
    }

    log(`\n========================================`);
    log(`   BrainByte Problem Seeding Summary`);
    log(`========================================`);
    log(`Total Problems in Dataset : ${stats.total}`);
    log(`Processed                 : ${stats.processed}`);
    log(`Inserted / Upserted       : ${stats.insertedOrUpdated}`);
    log(`Skipped / Invalid         : ${stats.skipped}`);
    log(`========================================\n`);

    return stats;
  } finally {
    if (connectedHere) {
      await mongoose.disconnect();
    }
  }
};

// Direct CLI execution
if (process.argv[1]?.endsWith("seedProblems.js")) {
  const shouldClear = process.argv.includes("--clear") || process.argv.includes("--clean");

  seedProblems({ clear: shouldClear })
    .then(() => {
      console.log("Seeding completed successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding failed with error:", err.message);
      process.exit(1);
    });
}

