/**
 * Binary Search Problem Collection
 */

export const binarySearchProblems = [
  {
    title: "Binary Search",
    slug: "binary-search",
    difficulty: "Easy",
    tags: ["Array", "Binary Search"],
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4.",
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 2",
        output: "-1",
        explanation: "2 does not exist in nums so return -1.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) cin >> nums[i];\n        int target;\n        cin >> target;\n        // Search target in sorted nums with O(log n) time\n        // Print index if found, else -1\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *nums = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n        int target;\n        scanf("%d", &target);\n        // Search target in sorted nums and print index or -1\n        free(nums);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    nums = [int(x) for x in data[1:n+1]]\n    target = int(data[n+1])\n    # Search target in sorted nums with O(log n) time and print index or -1\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    const target = parseInt(input[n + 1], 10);\n    // Search target in sorted nums with O(log n) time and print index or -1\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    const target = parseInt(input[n + 1], 10);\n    // Search target in sorted nums with O(log n) time and print index or -1\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) nums[i] = scanner.nextInt();\n            int target = scanner.nextInt();\n            // Search target in sorted nums with O(log n) time and print index or -1\n        }\n    }\n}`,
    },
    testCases: [
      { input: "6\n-1 0 3 5 9 12\n9", expectedOutput: "4", isHidden: false },
      { input: "6\n-1 0 3 5 9 12\n2", expectedOutput: "-1", isHidden: false },
      { input: "1\n5\n5", expectedOutput: "0", isHidden: true },
      { input: "2\n2 5\n5", expectedOutput: "1", isHidden: true },
    ],
    hints: [
      "Use low and high pointers, checking mid = low + (high - low) / 2.",
    ],
  },
  {
    title: "Search a 2D Matrix",
    slug: "search-a-2d-matrix",
    difficulty: "Medium",
    tags: ["Array", "Binary Search", "Matrix"],
    description: `You are given an \`m x n\` integer matrix \`matrix\` with the following two properties:
1. Each row is sorted in non-decreasing order.
2. The first integer of each row is greater than the last integer of the previous row.

Given an integer \`target\`, return \`true\` *if* \`target\` *is in* \`matrix\` *or* \`false\` *otherwise*.

You must write a solution in \`O(log(m * n))\` time complexity.`,
    constraints: [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 100",
      "-10^4 <= matrix[i][j], target <= 10^4",
    ],
    examples: [
      {
        input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
        output: "true",
        explanation: "3 is in the matrix.",
      },
      {
        input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13",
        output: "false",
        explanation: "13 is not in the matrix.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n    int m, n;\n    if (cin >> m >> n) {\n        vector<vector<int>> matrix(m, vector<int>(n));\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n; j++) {\n                cin >> matrix[i][j];\n            }\n        }\n        int target;\n        cin >> target;\n        // Search target in 2D sorted matrix with O(log(m*n)) time and print "true" or "false"\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n\nint main() {\n    int m, n;\n    if (scanf("%d %d", &m, &n) == 2) {\n        // Search in 2D matrix\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    m = int(data[0])\n    n = int(data[1])\n    idx = 2\n    matrix = []\n    for _ in range(m):\n        row = [int(x) for x in data[idx:idx+n]]\n        matrix.append(row)\n        idx += n\n    target = int(data[idx])\n    # Search target in matrix and print "true" or "false"\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length < 2 || input[0] === "") return;\n    const m = parseInt(input[0], 10);\n    const n = parseInt(input[1], 10);\n    let idx = 2;\n    const matrix = [];\n    for (let i = 0; i < m; i++) {\n        matrix.push(input.slice(idx, idx + n).map(Number));\n        idx += n;\n    }\n    const target = parseInt(input[idx], 10);\n    // Search target in matrix and print "true" or "false"\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length < 2 || input[0] === "") return;\n    const m = parseInt(input[0], 10);\n    const n = parseInt(input[1], 10);\n    let idx = 2;\n    const matrix: number[][] = [];\n    for (let i = 0; i < m; i++) {\n        matrix.push(input.slice(idx, idx + n).map(Number));\n        idx += n;\n    }\n    const target = parseInt(input[idx], 10);\n    // Search target in matrix and print "true" or "false"\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int m = scanner.nextInt();\n            int n = scanner.nextInt();\n            int[][] matrix = new int[m][n];\n            for (int i = 0; i < m; i++) {\n                for (int j = 0; j < n; j++) {\n                    matrix[i][j] = scanner.nextInt();\n                }\n            }\n            int target = scanner.nextInt();\n            // Search target in matrix and print "true" or "false"\n        }\n    }\n}`,
    },
    testCases: [
      { input: "3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3", expectedOutput: "true", isHidden: false },
      { input: "3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n13", expectedOutput: "false", isHidden: false },
      { input: "1 1\n1\n1", expectedOutput: "true", isHidden: true },
      { input: "1 2\n1 3\n3", expectedOutput: "true", isHidden: true },
    ],
    hints: [
      "Map 1D index to matrix[mid / cols][mid % cols].",
    ],
  },
  {
    title: "Find Minimum in Rotated Sorted Array",
    slug: "find-minimum-in-rotated-sorted-array",
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    description: `Suppose an array of length \`n\` sorted in ascending order is **rotated** between \`1\` and \`n\` times.

Given the sorted rotated array \`nums\` of **unique** elements, return *the minimum element of this array*.

You must write an algorithm that runs in \`O(log n)\` time.`,
    constraints: [
      "n == nums.length",
      "1 <= n <= 5000",
      "-5000 <= nums[i] <= 5000",
      "All the integers of nums are unique.",
      "nums is sorted and rotated between 1 and n times.",
    ],
    examples: [
      {
        input: "nums = [3,4,5,1,2]",
        output: "1",
        explanation: "The original array was [1,2,3,4,5] rotated 3 times.",
      },
      {
        input: "nums = [4,5,6,7,0,1,2]",
        output: "0",
        explanation: "Original array rotated 4 times.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) cin >> nums[i];\n        // Find minimum element in rotated sorted array in O(log n) and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *nums = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n        // Find minimum element\n        free(nums);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    nums = [int(x) for x in data[1:n+1]]\n    # Find minimum element in rotated sorted array in O(log n) and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Find minimum element in rotated sorted array in O(log n) and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Find minimum element in rotated sorted array in O(log n) and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) nums[i] = scanner.nextInt();\n            // Find minimum element in rotated sorted array in O(log n) and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "5\n3 4 5 1 2", expectedOutput: "1", isHidden: false },
      { input: "7\n4 5 6 7 0 1 2", expectedOutput: "0", isHidden: false },
      { input: "4\n11 13 15 17", expectedOutput: "11", isHidden: false },
      { input: "2\n2 1", expectedOutput: "1", isHidden: true },
    ],
    hints: [
      "Compare nums[mid] with nums[right]. If nums[mid] > nums[right], the minimum is in the right half.",
    ],
  },
  {
    title: "Search in Rotated Sorted Array",
    slug: "search-in-rotated-sorted-array",
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    description: `There is an integer array \`nums\` sorted in ascending order (with distinct values).

Prior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index.

Given the array \`nums\` after the possible rotation and an integer \`target\`, return *the index of* \`target\` *if it is in* \`nums\`, *or* \`-1\` *if it is not in* \`nums\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique.",
      "nums is an ascending array that is possibly rotated.",
      "-10^4 <= target <= 10^4",
    ],
    examples: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4",
        explanation: "0 is at index 4.",
      },
      {
        input: "nums = [4,5,6,7,0,1,2], target = 3",
        output: "-1",
        explanation: "3 is not in nums.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) cin >> nums[i];\n        int target;\n        cin >> target;\n        // Search target in rotated sorted array with O(log n) time\n        // Print index if found, else -1\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *nums = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n        int target;\n        scanf("%d", &target);\n        // Search target\n        free(nums);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    nums = [int(x) for x in data[1:n+1]]\n    target = int(data[n+1])\n    # Search target in rotated sorted array with O(log n) time and print index or -1\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    const target = parseInt(input[n + 1], 10);\n    // Search target in rotated sorted array with O(log n) time and print index or -1\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    const target = parseInt(input[n + 1], 10);\n    // Search target in rotated sorted array with O(log n) time and print index or -1\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) nums[i] = scanner.nextInt();\n            int target = scanner.nextInt();\n            // Search target in rotated sorted array with O(log n) time and print index or -1\n        }\n    }\n}`,
    },
    testCases: [
      { input: "7\n4 5 6 7 0 1 2\n0", expectedOutput: "4", isHidden: false },
      { input: "7\n4 5 6 7 0 1 2\n3", expectedOutput: "-1", isHidden: false },
      { input: "1\n1\n0", expectedOutput: "-1", isHidden: false },
      { input: "3\n5 1 3\n5", expectedOutput: "0", isHidden: true },
    ],
    hints: [
      "At any mid index, either the left half [low...mid] or the right half [mid...high] is strictly sorted.",
      "Determine which half is sorted, check if target lies within that range, and adjust pointers accordingly.",
    ],
  },
  {
    title: "Median of Two Sorted Arrays",
    slug: "median-of-two-sorted-arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.`,
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6",
    ],
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.0",
        explanation: "Merged array = [1,2,3] and median is 2.0.",
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.5",
        explanation: "Merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <iomanip>\n\nusing namespace std;\n\nint main() {\n    int n1;\n    if (cin >> n1) {\n        vector<int> nums1(n1);\n        for (int i = 0; i < n1; i++) cin >> nums1[i];\n        int n2;\n        cin >> n2;\n        vector<int> nums2(n2);\n        for (int i = 0; i < n2; i++) cin >> nums2[i];\n        // Find median of two sorted arrays with O(log(m+n)) time\n        // Print formatted float (e.g. cout << fixed << setprecision(1) << median << endl;)\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n1;\n    if (scanf("%d", &n1) == 1) {\n        int *nums1 = (int *)malloc(n1 * sizeof(int));\n        for (int i = 0; i < n1; i++) scanf("%d", &nums1[i]);\n        int n2;\n        scanf("%d", &n2);\n        int *nums2 = (int *)malloc(n2 * sizeof(int));\n        for (int i = 0; i < n2; i++) scanf("%d", &nums2[i]);\n        // Compute median\n        free(nums1);\n        free(nums2);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    idx = 0\n    n1 = int(data[idx]); idx += 1\n    nums1 = [int(x) for x in data[idx:idx+n1]]; idx += n1\n    n2 = int(data[idx]); idx += 1\n    nums2 = [int(x) for x in data[idx:idx+n2]]; idx += n2\n    # Find median of two sorted arrays with O(log(m+n)) time\n    # Print formatted float with 1 decimal place e.g. print(f"{median:.1f}")\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    let idx = 0;\n    const n1 = parseInt(input[idx++], 10);\n    const nums1 = input.slice(idx, idx + n1).map(Number); idx += n1;\n    const n2 = parseInt(input[idx++], 10);\n    const nums2 = input.slice(idx, idx + n2).map(Number); idx += n2;\n    // Find median of two sorted arrays and print with 1 decimal place (e.g. median.toFixed(1))\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    let idx = 0;\n    const n1 = parseInt(input[idx++], 10);\n    const nums1 = input.slice(idx, idx + n1).map(Number); idx += n1;\n    const n2 = parseInt(input[idx++], 10);\n    const nums2 = input.slice(idx, idx + n2).map(Number); idx += n2;\n    // Find median of two sorted arrays and print with 1 decimal place (e.g. median.toFixed(1))\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n1 = scanner.nextInt();\n            int[] nums1 = new int[n1];\n            for (int i = 0; i < n1; i++) nums1[i] = scanner.nextInt();\n            int n2 = scanner.nextInt();\n            int[] nums2 = new int[n2];\n            for (int i = 0; i < n2; i++) nums2[i] = scanner.nextInt();\n            // Find median of two sorted arrays and print with 1 decimal place (e.g. System.out.printf(Locale.US, "%.1f\\n", median))\n        }\n    }\n}`,
    },
    testCases: [
      { input: "2\n1 3\n1\n2", expectedOutput: "2.0", isHidden: false },
      { input: "2\n1 2\n2\n3 4", expectedOutput: "2.5", isHidden: false },
      { input: "2\n0 0\n2\n0 0", expectedOutput: "0.0", isHidden: true },
      { input: "0\n1\n1", expectedOutput: "1.0", isHidden: true },
    ],
    hints: [
      "Perform binary search on the partition position of the smaller array so left partition has half the total elements.",
    ],
  },
];
