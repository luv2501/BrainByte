/**
 * Dynamic Programming Problem Collection
 */

export const dynamicProgrammingProblems = [
  {
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    difficulty: "Easy",
    tags: ["Math", "Dynamic Programming", "Memoization"],
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    constraints: [
      "1 <= n <= 45",
    ],
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "1 step + 1 step, or 2 steps.",
      },
      {
        input: "n = 3",
        output: "3",
        explanation: "1+1+1, 1+2, 2+1.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        // Compute number of distinct ways to climb n stairs and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        // Compute distinct ways\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    # Compute number of distinct ways to climb n stairs and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    // Compute number of distinct ways to climb n stairs and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    // Compute number of distinct ways to climb n stairs and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            // Compute number of distinct ways to climb n stairs and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "2", expectedOutput: "2", isHidden: false },
      { input: "3", expectedOutput: "3", isHidden: false },
      { input: "4", expectedOutput: "5", isHidden: true },
      { input: "10", expectedOutput: "89", isHidden: true },
    ],
    hints: [
      "dp[i] = dp[i-1] + dp[i-2]",
    ],
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.`,
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
    ],
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "Subarray [1] has sum 1.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) cin >> nums[i];\n        // Find maximum subarray sum (Kadane's algorithm) and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *nums = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n        // Kadane's algorithm\n        free(nums);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    nums = [int(x) for x in data[1:n+1]]\n    # Find maximum subarray sum (Kadane's algorithm) and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Find maximum subarray sum (Kadane's algorithm) and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Find maximum subarray sum (Kadane's algorithm) and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) nums[i] = scanner.nextInt();\n            // Find maximum subarray sum (Kadane's algorithm) and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6", isHidden: false },
      { input: "1\n1", expectedOutput: "1", isHidden: false },
      { input: "5\n5 4 -1 7 8", expectedOutput: "23", isHidden: false },
      { input: "1\n-1", expectedOutput: "-1", isHidden: true },
    ],
    hints: [
      "Kadane's algorithm: curr = max(num, curr + num), max_so_far = max(max_so_far, curr).",
    ],
  },
  {
    title: "Coin Change",
    slug: "coin-change",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming", "Breadth-First Search"],
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.`,
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4",
    ],
    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3",
        explanation: "11 = 5 + 5 + 1.",
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1",
        explanation: "Cannot make 3 using 2.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> coins(n);\n        for (int i = 0; i < n; i++) cin >> coins[i];\n        int amount;\n        cin >> amount;\n        // Find fewest number of coins needed for amount and print it (or -1)\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *coins = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) scanf("%d", &coins[i]);\n        int amount;\n        scanf("%d", &amount);\n        // Min coins for amount\n        free(coins);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    coins = [int(x) for x in data[1:n+1]]\n    amount = int(data[n+1])\n    # Find fewest number of coins needed for amount and print it (or -1)\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const coins = input.slice(1, n + 1).map(Number);\n    const amount = parseInt(input[n + 1], 10);\n    // Find fewest number of coins needed for amount and print it (or -1)\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const coins = input.slice(1, n + 1).map(Number);\n    const amount = parseInt(input[n + 1], 10);\n    // Find fewest number of coins needed for amount and print it (or -1)\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] coins = new int[n];\n            for (int i = 0; i < n; i++) coins[i] = scanner.nextInt();\n            int amount = scanner.nextInt();\n            // Find fewest number of coins needed for amount and print it (or -1)\n        }\n    }\n}`,
    },
    testCases: [
      { input: "3\n1 2 5\n11", expectedOutput: "3", isHidden: false },
      { input: "1\n2\n3", expectedOutput: "-1", isHidden: false },
      { input: "1\n1\n0", expectedOutput: "0", isHidden: false },
      { input: "4\n186 419 83 408\n6249", expectedOutput: "20", isHidden: true },
    ],
    hints: [
      "dp[i] = min(dp[i], dp[i - coin] + 1) for coin in coins.",
    ],
  },
  {
    title: "House Robber",
    slug: "house-robber",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.

Given an integer array \`nums\` representing the amount of money of each house, return *the maximum amount of money you can rob tonight* **without alerting the police**.`,
    constraints: [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400",
    ],
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "4",
        explanation: "Rob house 1 (money = 1) and house 3 (money = 3). Total = 4.",
      },
      {
        input: "nums = [2,7,9,3,1]",
        output: "12",
        explanation: "Rob house 1 (2), house 3 (9), house 5 (1). Total = 12.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) cin >> nums[i];\n        // Compute max robbery amount without alerting police and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *nums = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n        // Compute max money\n        free(nums);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    nums = [int(x) for x in data[1:n+1]]\n    # Compute max robbery amount without alerting police and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Compute max robbery amount without alerting police and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Compute max robbery amount without alerting police and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) nums[i] = scanner.nextInt();\n            // Compute max robbery amount without alerting police and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "4\n1 2 3 1", expectedOutput: "4", isHidden: false },
      { input: "5\n2 7 9 3 1", expectedOutput: "12", isHidden: false },
      { input: "1\n0", expectedOutput: "0", isHidden: true },
      { input: "4\n2 1 1 2", expectedOutput: "4", isHidden: true },
    ],
    hints: [
      "At house i: max(rob(i-1), rob(i-2) + nums[i]).",
    ],
  },
  {
    title: "Longest Increasing Subsequence",
    slug: "longest-increasing-subsequence",
    difficulty: "Medium",
    tags: ["Array", "Binary Search", "Dynamic Programming"],
    description: `Given an integer array \`nums\`, return *the length of the longest strictly increasing subsequence*.`,
    constraints: [
      "1 <= nums.length <= 2500",
      "-10^4 <= nums[i] <= 10^4",
    ],
    examples: [
      {
        input: "nums = [10,9,2,5,3,7,101,18]",
        output: "4",
        explanation: "The longest increasing subsequence is [2,3,7,101], therefore the length is 4.",
      },
      {
        input: "nums = [0,1,0,3,2,3]",
        output: "4",
        explanation: "LIS is [0,1,2,3].",
      },
      {
        input: "nums = [7,7,7,7,7,7,7]",
        output: "1",
        explanation: "Strictly increasing sequence of identical elements has length 1.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) cin >> nums[i];\n        // Find length of longest strictly increasing subsequence in O(n log n) and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *nums = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n        // Find LIS length\n        free(nums);\n    }\n    return 0;\n}`,
      python: `import sys\nimport bisect\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    nums = [int(x) for x in data[1:n+1]]\n    # Find length of longest strictly increasing subsequence in O(n log n) and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Find length of longest strictly increasing subsequence in O(n log n) and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Find length of longest strictly increasing subsequence in O(n log n) and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) nums[i] = scanner.nextInt();\n            // Find length of longest strictly increasing subsequence in O(n log n) and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "8\n10 9 2 5 3 7 101 18", expectedOutput: "4", isHidden: false },
      { input: "6\n0 1 0 3 2 3", expectedOutput: "4", isHidden: false },
      { input: "7\n7 7 7 7 7 7 7", expectedOutput: "1", isHidden: false },
      { input: "6\n4 10 4 3 8 9", expectedOutput: "3", isHidden: true },
    ],
    hints: [
      "Maintain an array `tails` of smallest tail of all increasing subsequences of length i+1. Use binary search (bisect_left) to update in O(n log n).",
    ],
  },
  {
    title: "Edit Distance",
    slug: "edit-distance",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming"],
    description: `Given two strings \`word1\` and \`word2\`, return *the minimum number of operations required to convert* \`word1\` *to* \`word2\`.

You have the following three operations permitted on a word:
- Insert a character
- Delete a character
- Replace a character`,
    constraints: [
      "0 <= word1.length, word2.length <= 500",
      "word1 and word2 consist of lowercase English letters.",
    ],
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: "3",
        explanation: "horse -> rorse (replace 'h' with 'r') -> rose (remove 'r') -> ros (remove 'e').",
      },
      {
        input: 'word1 = "intention", word2 = "execution"',
        output: "5",
        explanation: "5 operations needed.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    string word1, word2;\n    if (cin >> word1 >> word2) {\n        // Compute Levenshtein edit distance and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n#include <stdlib.h>\n\nint main() {\n    char word1[501], word2[501];\n    if (scanf("%s %s", word1, word2) == 2) {\n        // Levenshtein distance\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        print(0)\n        return\n    word1 = data[0] if len(data) > 0 else ""\n    word2 = data[1] if len(data) > 1 else ""\n    # Compute Levenshtein edit distance and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const data = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (data.length === 0 || data[0] === "") { console.log(0); return; }\n    const word1 = data[0] || "";\n    const word2 = data[1] || "";\n    // Compute Levenshtein edit distance and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const data = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (data.length === 0 || data[0] === "") { console.log(0); return; }\n    const word1 = data[0] || "";\n    const word2 = data[1] || "";\n    // Compute Levenshtein edit distance and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        String word1 = scanner.hasNext() ? scanner.next() : "";\n        String word2 = scanner.hasNext() ? scanner.next() : "";\n        // Compute Levenshtein edit distance and print it\n    }\n}\n}`,
    },
    testCases: [
      { input: "horse\nros", expectedOutput: "3", isHidden: false },
      { input: "intention\nexecution", expectedOutput: "5", isHidden: false },
      { input: "a\nb", expectedOutput: "1", isHidden: true },
      { input: "zoologico\nzoologia", expectedOutput: "2", isHidden: true },
    ],
    hints: [
      "2D DP: dp[i][j] = dp[i-1][j-1] if match, else 1 + min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace)).",
    ],
  },
];
