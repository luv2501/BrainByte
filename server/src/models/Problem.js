import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, default: "" },
    imgUrl: { type: String, default: "" },
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false }, // Hidden test cases used for final grading
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Problem title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Problem description is required"],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: {
        values: ["Easy", "Medium", "Hard"],
        message: "Difficulty must be Easy, Medium, or Hard",
      },
      required: [true, "Difficulty level is required"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    constraints: [
      {
        type: String,
        trim: true,
      },
    ],
    examples: [exampleSchema],
    starterCode: {
      javascript: { type: String, default: "" },
      python: { type: String, default: "" },
      cpp: { type: String, default: "" },
      c: { type: String, default: "" },
      java: { type: String, default: "" },
      typescript: { type: String, default: "" },
    },
    testCases: {
      type: [testCaseSchema],
      validate: {
        validator: function (cases) {
          return Array.isArray(cases) && cases.length > 0;
        },
        message: "A problem must have at least one test case",
      },
    },
    hints: [
      {
        type: String,
        trim: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
