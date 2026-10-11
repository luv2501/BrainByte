/**
 * BrainByte Master Problem Dataset
 *
 * Combines curated problem collections across all core algorithmic paradigms:
 * - Arrays & Hashing
 * - Two Pointers & Sliding Window
 * - Stack & Queue
 * - Linked Lists
 * - Binary Search
 * - Trees & Graphs
 * - Dynamic Programming
 * - Math, Bit Manipulation & Greedy
 */

import { arrayProblems } from "./categories/arrays.js";
import { twoPointersProblems } from "./categories/twoPointers.js";
import { stackQueueProblems } from "./categories/stackQueue.js";
import { linkedListProblems } from "./categories/linkedLists.js";
import { binarySearchProblems } from "./categories/binarySearch.js";
import { treesGraphsProblems } from "./categories/treesGraphs.js";
import { dynamicProgrammingProblems } from "./categories/dynamicProgramming.js";
import { mathBitsProblems } from "./categories/mathBits.js";

export const problemsData = [
  ...arrayProblems,
  ...twoPointersProblems,
  ...stackQueueProblems,
  ...linkedListProblems,
  ...binarySearchProblems,
  ...treesGraphsProblems,
  ...dynamicProgrammingProblems,
  ...mathBitsProblems,
];

export default problemsData;
