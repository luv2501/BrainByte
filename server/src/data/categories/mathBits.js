/**
 * Math, Bit Manipulation & Greedy Problem Collection
 */

export const mathBitsProblems = [
  {
    title: "Longest Common Prefix",
    slug: "longest-common-prefix",
    difficulty: "Easy",
    tags: ["String", "Trie"],
    description: `Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string \`""\`.`,
    constraints: [
      "1 <= strs.length <= 200",
      "0 <= strs[i].length <= 200",
      "strs[i] consists of only lowercase English letters.",
    ],
    examples: [
      {
        input: 'strs = ["flower","flow","flight"]',
        output: '"fl"',
        explanation: 'Common prefix is "fl".',
      },
      {
        input: 'strs = ["dog","racecar","car"]',
        output: '""',
        explanation: "No common prefix.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<string> strs(n);\n        for (int i = 0; i < n; i++) cin >> strs[i];\n        // Find longest common prefix among strs and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        char strs[201][201];\n        for (int i = 0; i < n; i++) scanf("%s", strs[i]);\n        // Find longest common prefix\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    strs = data[1:n+1]\n    # Find longest common prefix among strs and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const strs = input.slice(1, n + 1);\n    // Find longest common prefix among strs and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const strs = input.slice(1, n + 1);\n    // Find longest common prefix among strs and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            String[] strs = new String[n];\n            for (int i = 0; i < n; i++) strs[i] = scanner.next();\n            // Find longest common prefix among strs and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "3\nflower\nflow\nflight", expectedOutput: "fl", isHidden: false },
      { input: "2\ninterspecies\ninterstellar", expectedOutput: "inter", isHidden: false },
      { input: "1\na", expectedOutput: "a", isHidden: true },
      { input: "2\nabc\nab", expectedOutput: "ab", isHidden: true },
    ],
    hints: [
      "Compare character column by column across all strings.",
    ],
  },
  {
    title: "Single Number",
    slug: "single-number",
    difficulty: "Easy",
    tags: ["Array", "Bit Manipulation"],
    description: `Given a **non-empty** array of integers \`nums\`, every element appears *twice* except for one. Find that single one.

You must implement a solution with a linear runtime complexity and use only constant extra space.`,
    constraints: [
      "1 <= nums.length <= 3 * 10^4",
      "-3 * 10^4 <= nums[i] <= 3 * 10^4",
      "Each element in the array appears twice except for one element which appears only once.",
    ],
    examples: [
      {
        input: "nums = [2,2,1]",
        output: "1",
        explanation: "1 appears only once.",
      },
      {
        input: "nums = [4,1,2,1,2]",
        output: "4",
        explanation: "4 appears once, 1 and 2 appear twice.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) cin >> nums[i];\n        // Find the single number appearing once using XOR and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *nums = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n        // XOR trick\n        free(nums);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    nums = [int(x) for x in data[1:n+1]]\n    # Find the single number appearing once using XOR and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Find the single number appearing once using XOR and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Find the single number appearing once using XOR and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) nums[i] = scanner.nextInt();\n            // Find the single number appearing once using XOR and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "3\n2 2 1", expectedOutput: "1", isHidden: false },
      { input: "5\n4 1 2 1 2", expectedOutput: "4", isHidden: false },
      { input: "1\n1", expectedOutput: "1", isHidden: true },
      { input: "5\n-1 -1 -2 -2 3", expectedOutput: "3", isHidden: true },
    ],
    hints: [
      "XOR of any number with itself is 0 (a ^ a = 0) and XOR of a number with 0 is itself (a ^ 0 = a).",
    ],
  },
  {
    title: "Number of 1 Bits",
    slug: "number-of-1-bits",
    difficulty: "Easy",
    tags: ["Bit Manipulation", "Divide and Conquer"],
    description: `Given a positive integer \`n\`, write a function that returns the number of set bits it has (also known as the **Hamming weight**).`,
    constraints: [
      "1 <= n <= 2^31 - 1",
    ],
    examples: [
      {
        input: "n = 11",
        output: "3",
        explanation: "11 in binary is 1011 (3 set bits).",
      },
      {
        input: "n = 128",
        output: "1",
        explanation: "128 in binary is 10000000 (1 set bit).",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n\nusing namespace std;\n\nint main() {\n    unsigned int n;\n    if (cin >> n) {\n        // Count number of set bits (Hamming weight) and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    unsigned int n;\n    if (scanf("%u", &n) == 1) {\n        // Count set bits\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    # Count number of set bits (Hamming weight) and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    // Count number of set bits (Hamming weight) and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    // Count number of set bits (Hamming weight) and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextLong()) {\n            long n = scanner.nextLong();\n            // Count number of set bits (Hamming weight) and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "11", expectedOutput: "3", isHidden: false },
      { input: "128", expectedOutput: "1", isHidden: false },
      { input: "2147483645", expectedOutput: "30", isHidden: true },
      { input: "1", expectedOutput: "1", isHidden: true },
    ],
    hints: [
      "Use Brian Kernighan's bit manipulation: n = n & (n - 1) clears the lowest set bit in O(set bits) time.",
    ],
  },
  {
    title: "Jump Game",
    slug: "jump-game",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming", "Greedy"],
    description: `You are given an integer array \`nums\`. You are initially positioned at the array's **first index**, and each element in the array represents your maximum jump length at that position.

Return \`true\` *if you can reach the last index, or* \`false\` *otherwise*.`,
    constraints: [
      "1 <= nums.length <= 10^4",
      "0 <= nums[i] <= 10^5",
    ],
    examples: [
      {
        input: "nums = [2,3,1,1,4]",
        output: "true",
        explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index.",
      },
      {
        input: "nums = [3,2,1,0,4]",
        output: "false",
        explanation: "You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) cin >> nums[i];\n        // Determine if you can reach the last index and print "true" or "false"\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *nums = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n        // Greedy jump reach\n        free(nums);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    nums = [int(x) for x in data[1:n+1]]\n    # Determine if you can reach the last index and print "true" or "false"\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Determine if you can reach the last index and print "true" or "false"\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Determine if you can reach the last index and print "true" or "false"\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) nums[i] = scanner.nextInt();\n            // Determine if you can reach the last index and print "true" or "false"\n        }\n    }\n}`,
    },
    testCases: [
      { input: "5\n2 3 1 1 4", expectedOutput: "true", isHidden: false },
      { input: "5\n3 2 1 0 4", expectedOutput: "false", isHidden: false },
      { input: "1\n0", expectedOutput: "true", isHidden: true },
      { input: "3\n2 0 0", expectedOutput: "true", isHidden: true },
    ],
    hints: [
      "Keep track of maxReach = max(maxReach, i + nums[i]). If at any point i > maxReach, return false.",
    ],
  },
  {
    title: "Merge Intervals",
    slug: "merge-intervals",
    difficulty: "Medium",
    tags: ["Array", "Sorting"],
    description: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.`,
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= starti <= endi <= 10^4",
    ],
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6].",
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<pair<int, int>> intervals(n);\n        for (int i = 0; i < n; i++) cin >> intervals[i].first >> intervals[i].second;\n        // Merge overlapping intervals, print each merged interval "start end" on its own line\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Interval { int start; int end; };\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        struct Interval *arr = (struct Interval *)malloc(n * sizeof(struct Interval));\n        for (int i = 0; i < n; i++) scanf("%d %d", &arr[i].start, &arr[i].end);\n        // Merge intervals\n        free(arr);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    intervals = []\n    idx = 1\n    for _ in range(n):\n        intervals.append([int(data[idx]), int(data[idx+1])])\n        idx += 2\n    # Merge overlapping intervals, print each merged interval "start end" on its own line\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const intervals = [];\n    let idx = 1;\n    for (let i = 0; i < n; i++) {\n        intervals.push([parseInt(input[idx], 10), parseInt(input[idx+1], 10)]);\n        idx += 2;\n    }\n    // Merge overlapping intervals, print each merged interval "start end" on its own line\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const intervals: [number, number][] = [];\n    let idx = 1;\n    for (let i = 0; i < n; i++) {\n        intervals.push([parseInt(input[idx], 10), parseInt(input[idx+1], 10)]);\n        idx += 2;\n    }\n    // Merge overlapping intervals, print each merged interval "start end" on its own line\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[][] intervals = new int[n][2];\n            for (int i = 0; i < n; i++) {\n                intervals[i][0] = scanner.nextInt();\n                intervals[i][1] = scanner.nextInt();\n            }\n            // Merge overlapping intervals, print each merged interval "start end" on its own line\n        }\n    }\n}`,
    },
    testCases: [
      { input: "4\n1 3\n2 6\n8 10\n15 18", expectedOutput: "1 6\n8 10\n15 18", isHidden: false },
      { input: "2\n1 4\n4 5", expectedOutput: "1 5", isHidden: false },
      { input: "2\n1 4\n2 3", expectedOutput: "1 4", isHidden: true },
      { input: "1\n1 4", expectedOutput: "1 4", isHidden: true },
    ],
    hints: [
      "Sort intervals by start time. Merge overlapping adjacent intervals if next.start <= current.end.",
    ],
  },
];
