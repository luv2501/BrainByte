/**
 * Two Pointers & Sliding Window Problem Collection
 */

export const twoPointersProblems = [
  {
    title: "Valid Palindrome",
    slug: "valid-palindrome",
    difficulty: "Easy",
    tags: ["Two Pointers", "String"],
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string \`s\`, return \`true\` *if it is a palindrome, or* \`false\` *otherwise*.`,
    constraints: [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters.",
    ],
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 's = "race a car"',
        output: "false",
        explanation: '"raceacar" is not a palindrome.',
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <string>\n#include <cctype>\n\nusing namespace std;\n\nint main() {\n    string s;\n    if (getline(cin, s)) {\n        // Return true if s is a palindrome considering only alphanumeric chars and ignoring case\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\n#include <stdbool.h>\n\nint main() {\n    char s[200005];\n    if (fgets(s, sizeof(s), stdin)) {\n        int len = strlen(s);\n        if (len > 0 && s[len - 1] == '\\n') s[len - 1] = '\\0';\n        // Return true if s is a palindrome considering only alphanumeric chars and ignoring case\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    s = sys.stdin.read().rstrip('\\r\\n')\n    # Return true if s is a palindrome considering only alphanumeric chars and ignoring case\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const s = fs.readFileSync(0, "utf-8").replace(/\\r?\\n$/, "");\n    // Return true if s is a palindrome considering only alphanumeric chars and ignoring case\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const s = fs.readFileSync(0, "utf-8").replace(/\\r?\\n$/, "");\n    // Return true if s is a palindrome considering only alphanumeric chars and ignoring case\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextLine()) {\n            String s = scanner.nextLine();\n            // Return true if s is a palindrome considering only alphanumeric chars and ignoring case\n        }\n    }\n}`,
    },
    testCases: [
      { input: "A man, a plan, a canal: Panama", expectedOutput: "true", isHidden: false },
      { input: "race a car", expectedOutput: "false", isHidden: false },
      { input: " ", expectedOutput: "true", isHidden: false },
      { input: "0P", expectedOutput: "false", isHidden: true },
      { input: "ab_a", expectedOutput: "true", isHidden: true },
    ],
    hints: [
      "Use two pointers moving inward from both ends.",
    ],
  },
  {
    title: "Two Sum II - Input Array Is Sorted",
    slug: "two-sum-ii-input-array-is-sorted",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Binary Search"],
    description: `Given a **1-indexed** array of integers \`numbers\` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific \`target\` number.

Return *the indices of the two numbers,* \`[index1, index2]\` *added by one*.

The tests are generated such that there is **exactly one solution**. You **may not** use the same element twice.`,
    constraints: [
      "2 <= numbers.length <= 3 * 10^4",
      "-1000 <= numbers[i] <= 1000",
      "numbers is sorted in non-decreasing order.",
      "-1000 <= target <= 1000",
    ],
    examples: [
      {
        input: "numbers = [2,7,11,15], target = 9",
        output: "[1,2]",
        explanation: "The sum of 2 and 7 is 9. Therefore index1 = 1, index2 = 2.",
      },
      {
        input: "numbers = [2,3,4], target = 6",
        output: "[1,3]",
        explanation: "The sum of 2 and 4 is 6.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> numbers(n);\n        for (int i = 0; i < n; i++) {\n            cin >> numbers[i];\n        }\n        int target;\n        cin >> target;\n        // Find two 1-based indices that add up to target and print: index1 index2\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *numbers = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) {\n            scanf("%d", &numbers[i]);\n        }\n        int target;\n        scanf("%d", &target);\n        // Find two 1-based indices that add up to target and print: index1 index2\n        free(numbers);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    numbers = [int(x) for x in input_data[1:n+1]]\n    target = int(input_data[n+1])\n    # Find two 1-based indices that add up to target and print: index1 index2\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const numbers = input.slice(1, n + 1).map(Number);\n    const target = parseInt(input[n + 1], 10);\n    // Find two 1-based indices that add up to target and print: index1 index2\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const numbers = input.slice(1, n + 1).map(Number);\n    const target = parseInt(input[n + 1], 10);\n    // Find two 1-based indices that add up to target and print: index1 index2\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] numbers = new int[n];\n            for (int i = 0; i < n; i++) {\n                numbers[i] = scanner.nextInt();\n            }\n            int target = scanner.nextInt();\n            // Find two 1-based indices that add up to target and print: index1 index2\n        }\n    }\n}`,
    },
    testCases: [
      { input: "4\n2 7 11 15\n9", expectedOutput: "1 2", isHidden: false },
      { input: "3\n2 3 4\n6", expectedOutput: "1 3", isHidden: false },
      { input: "2\n-1 0\n-1", expectedOutput: "1 2", isHidden: true },
      { input: "5\n1 2 3 4 49\n50", expectedOutput: "1 5", isHidden: true },
    ],
    hints: [
      "Since the array is sorted, start one pointer at the start and one at the end.",
      "If sum < target, advance left pointer; if sum > target, decrement right pointer.",
    ],
  },
  {
    title: "3Sum",
    slug: "3sum",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Sorting"],
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5",
    ],
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation: "Distinct triplets summing to 0.",
      },
      {
        input: "nums = [0,1,1]",
        output: "[]",
        explanation: "No valid triplet.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) {\n            cin >> nums[i];\n        }\n        // Find all unique triplets that sum to 0 and print each triplet on a new line\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint cmp(const void *a, const void *b) {\n    return (*(int *)a - *(int *)b);\n}\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *nums = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) {\n            scanf("%d", &nums[i]);\n        }\n        // Find all unique triplets that sum to 0 and print each triplet on a new line\n        free(nums);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    nums = [int(x) for x in input_data[1:n+1]]\n    # Find all unique triplets that sum to 0 and print each triplet on a new line\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Find all unique triplets that sum to 0 and print each triplet on a new line\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Find all unique triplets that sum to 0 and print each triplet on a new line\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) {\n                nums[i] = scanner.nextInt();\n            }\n            // Find all unique triplets that sum to 0 and print each triplet on a new line\n        }\n    }\n}`,
    },
    testCases: [
      { input: "6\n-1 0 1 2 -1 -4", expectedOutput: "-1 -1 2\n-1 0 1", isHidden: false },
      { input: "3\n0 0 0", expectedOutput: "0 0 0", isHidden: false },
      { input: "4\n-1 0 1 0", expectedOutput: "-1 0 1", isHidden: false },
      { input: "5\n-2 0 1 1 2", expectedOutput: "-2 0 2\n-2 1 1", isHidden: true },
      { input: "6\n-4 -1 -1 0 1 2", expectedOutput: "-1 -1 2\n-1 0 1", isHidden: true },
    ],
    hints: [
      "Sort first, fix the first element with a loop, and use two pointers for the rest.",
    ],
  },
  {
    title: "Container With Most Water",
    slug: "container-with-most-water",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Greedy"],
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.`,
    constraints: [
      "2 <= height.length <= 10^5",
      "0 <= height[i] <= 10^4",
    ],
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation: "Max area between index 1 (height 8) and index 8 (height 7).",
      },
      {
        input: "height = [1,1]",
        output: "1",
        explanation: "Area is 1 * 1 = 1.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> height(n);\n        for (int i = 0; i < n; i++) {\n            cin >> height[i];\n        }\n        // Compute the maximum amount of water a container can store and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *height = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) {\n            scanf("%d", &height[i]);\n        }\n        // Compute the maximum amount of water a container can store and print it\n        free(height);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    height = [int(x) for x in input_data[1:n+1]]\n    # Compute the maximum amount of water a container can store and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const height = input.slice(1, n + 1).map(Number);\n    // Compute the maximum amount of water a container can store and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const height = input.slice(1, n + 1).map(Number);\n    // Compute the maximum amount of water a container can store and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] height = new int[n];\n            for (int i = 0; i < n; i++) {\n                height[i] = scanner.nextInt();\n            }\n            // Compute the maximum amount of water a container can store and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49", isHidden: false },
      { input: "2\n1 1", expectedOutput: "1", isHidden: false },
      { input: "5\n4 3 2 1 4", expectedOutput: "16", isHidden: true },
      { input: "4\n1 2 4 3", expectedOutput: "4", isHidden: true },
    ],
    hints: [
      "Move the pointer pointing to the shorter vertical bar.",
    ],
  },
  {
    title: "Trapping Rain Water",
    slug: "trapping-rain-water",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5",
    ],
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "6 units of rain water are trapped.",
      },
      {
        input: "height = [4,2,0,3,2,5]",
        output: "9",
        explanation: "9 units of rain water trapped.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> height(n);\n        for (int i = 0; i < n; i++) {\n            cin >> height[i];\n        }\n        // Compute how much water can be trapped after raining and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *height = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) {\n            scanf("%d", &height[i]);\n        }\n        // Compute how much water can be trapped after raining and print it\n        free(height);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    height = [int(x) for x in input_data[1:n+1]]\n    # Compute how much water can be trapped after raining and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const height = input.slice(1, n + 1).map(Number);\n    // Compute how much water can be trapped after raining and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const height = input.slice(1, n + 1).map(Number);\n    // Compute how much water can be trapped after raining and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] height = new int[n];\n            for (int i = 0; i < n; i++) {\n                height[i] = scanner.nextInt();\n            }\n            // Compute how much water can be trapped after raining and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6", isHidden: false },
      { input: "6\n4 2 0 3 2 5", expectedOutput: "9", isHidden: false },
      { input: "5\n3 0 2 0 4", expectedOutput: "7", isHidden: true },
      { input: "1\n0", expectedOutput: "0", isHidden: true },
    ],
    hints: [
      "Maintain leftMax and rightMax using two pointers.",
      "Water above bar `i` is min(leftMax, rightMax) - height[i].",
    ],
  },
  {
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"],
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return \`0\`.`,
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4",
    ],
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 5.",
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "No profitable transaction.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> prices(n);\n        for (int i = 0; i < n; i++) {\n            cin >> prices[i];\n        }\n        // Compute maximum profit from a single buy and sell transaction and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *prices = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) {\n            scanf("%d", &prices[i]);\n        }\n        // Compute maximum profit from a single buy and sell transaction and print it\n        free(prices);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    prices = [int(x) for x in input_data[1:n+1]]\n    # Compute maximum profit from a single buy and sell transaction and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const prices = input.slice(1, n + 1).map(Number);\n    // Compute maximum profit from a single buy and sell transaction and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const prices = input.slice(1, n + 1).map(Number);\n    // Compute maximum profit from a single buy and sell transaction and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] prices = new int[n];\n            for (int i = 0; i < n; i++) {\n                prices[i] = scanner.nextInt();\n            }\n            // Compute maximum profit from a single buy and sell transaction and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "6\n7 1 5 3 6 4", expectedOutput: "5", isHidden: false },
      { input: "5\n7 6 4 3 1", expectedOutput: "0", isHidden: false },
      { input: "3\n2 4 1", expectedOutput: "2", isHidden: true },
      { input: "2\n1 2", expectedOutput: "1", isHidden: true },
    ],
    hints: [
      "Track minPrice seen so far and update maxProfit.",
    ],
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    tags: ["Hash Table", "String", "Sliding Window"],
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with length 3.',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with length 1.',
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with length 3.',
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    string s;\n    if (getline(cin, s)) {\n        // Find length of the longest substring without repeating characters and print it\n    } else {\n        cout << 0 << endl;\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[50005] = {0};\n    if (fgets(s, sizeof(s), stdin)) {\n        int len = strlen(s);\n        if (len > 0 && s[len - 1] == '\\n') s[len - 1] = '\\0';\n        // Find length of the longest substring without repeating characters and print it\n    } else {\n        printf("0\\n");\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    s = sys.stdin.read().rstrip('\\r\\n')\n    # Find length of the longest substring without repeating characters and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const s = fs.readFileSync(0, "utf-8").replace(/\\r?\\n$/, "");\n    // Find length of the longest substring without repeating characters and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const s = fs.readFileSync(0, "utf-8").replace(/\\r?\\n$/, "");\n    // Find length of the longest substring without repeating characters and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        String s = scanner.hasNextLine() ? scanner.nextLine() : "";\n        // Find length of the longest substring without repeating characters and print it\n    }\n}`,
    },
    testCases: [
      { input: "abcabcbb", expectedOutput: "3", isHidden: false },
      { input: "bbbbb", expectedOutput: "1", isHidden: false },
      { input: "pwwkew", expectedOutput: "3", isHidden: false },
      { input: " ", expectedOutput: "1", isHidden: true },
      { input: "au", expectedOutput: "2", isHidden: true },
    ],
    hints: [
      "Use a sliding window [left, right] and a hash map of last seen indices.",
    ],
  },
  {
    title: "Minimum Window Substring",
    slug: "minimum-window-substring",
    difficulty: "Hard",
    tags: ["Hash Table", "String", "Sliding Window"],
    description: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return the **minimum window substring** of \`s\` such that every character in \`t\` (**including duplicates**) is included in the window. If there is no such substring, return the empty string \`""\`.`,
    constraints: [
      "m == s.length",
      "n == t.length",
      "1 <= m, n <= 10^5",
      "s and t consist of uppercase and lowercase English letters.",
    ],
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: 'The minimum window substring "BANC" includes A, B, and C from string t.',
      },
      {
        input: 's = "a", t = "a"',
        output: '"a"',
        explanation: "Entire string is the minimum window.",
      },
      {
        input: 's = "a", t = "aa"',
        output: '""',
        explanation: "Both 'a's from t must be included in the window.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <string>\n#include <vector>\n#include <unordered_map>\n\nusing namespace std;\n\nint main() {\n    string s, t;\n    if (cin >> s >> t) {\n        // Find minimum window substring of s containing all characters of t and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[100005], t[100005];\n    if (scanf("%s %s", s, t) == 2) {\n        // Find minimum window substring of s containing all characters of t and print it\n    }\n    return 0;\n}`,
      python: `import sys\nfrom collections import Counter\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if len(input_data) < 2:\n        return\n    s = input_data[0]\n    t = input_data[1]\n    # Find minimum window substring of s containing all characters of t and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length < 2) return;\n    const s = input[0];\n    const t = input[1];\n    // Find minimum window substring of s containing all characters of t and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length < 2) return;\n    const s = input[0];\n    const t = input[1];\n    // Find minimum window substring of s containing all characters of t and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNext()) {\n            String s = scanner.next();\n            String t = scanner.next();\n            // Find minimum window substring of s containing all characters of t and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "ADOBECODEBANC\nABC", expectedOutput: "BANC", isHidden: false },
      { input: "a\na", expectedOutput: "a", isHidden: false },
      { input: "aa\naa", expectedOutput: "aa", isHidden: false },
      { input: "ab\nb", expectedOutput: "b", isHidden: true },
      { input: "cabwefgewcwaefgcf\ncae", expectedOutput: "cwae", isHidden: true },
    ],
    hints: [
      "Use two frequency maps: target frequencies and current window frequencies.",
      "Expand right pointer until valid, then shrink left pointer to minimize window.",
    ],
  },
];
