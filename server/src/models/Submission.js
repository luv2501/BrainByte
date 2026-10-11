import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required for a submission"],
      index: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: [true, "Problem ID is required for a submission"],
      index: true,
    },
    language: {
      type: String,
      required: [true, "Programming language is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Source code is required"],
    },
    verdict: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Compilation Error",
        "Runtime Error",
        "Execution Provider Error",
        "Pending",
      ],
      default: "Pending",
      index: true,
    },
    passedTestCases: {
      type: Number,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
    },
    runtimeMs: {
      type: Number,
      default: null,
    },
    memoryKb: {
      type: Number,
      default: null,
    },
    errorDetails: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
