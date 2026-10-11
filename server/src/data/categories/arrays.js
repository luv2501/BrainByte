/**
 * Arrays, Strings & Hashing Problem Collection
 */

export const arrayProblems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) {\n            cin >> nums[i];\n        }\n        int target;\n        cin >> target;\n\n        // Find two indices that add up to target and print: index1 index2\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *nums = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) {\n            scanf("%d", &nums[i]);\n        }\n        int target;\n        scanf("%d", &target);\n\n        // Find two indices that add up to target and print: index1 index2\n        free(nums);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    nums = [int(x) for x in input_data[1:n+1]]\n    target = int(input_data[n+1])\n\n    # Find two indices that add up to target and print: index1 index2\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    const target = parseInt(input[n + 1], 10);\n\n    // Find two indices that add up to target and print: index1 index2\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    const target = parseInt(input[n + 1], 10);\n\n    // Find two indices that add up to target and print: index1 index2\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) {\n                nums[i] = scanner.nextInt();\n            }\n            int target = scanner.nextInt();\n\n            // Find two indices that add up to target and print: index1 index2\n        }\n    }\n}`,
    },
    testCases: [
      { input: "4\n2 7 11 15\n9", expectedOutput: "0 1", isHidden: false },
      { input: "3\n3 2 4\n6", expectedOutput: "1 2", isHidden: false },
      { input: "2\n3 3\n6", expectedOutput: "0 1", isHidden: false },
      { input: "5\n1 5 7 12 19\n20", expectedOutput: "0 4", isHidden: true },
      { input: "4\n-3 4 3 90\n0", expectedOutput: "0 2", isHidden: true },
    ],
    hints: [
      "A brute force approach checks all pairs in O(n^2) time.",
      "Use a hash map to store each number and its index as you iterate.",
    ],
  },
  {
    title: "Contains Duplicate",
    slug: "contains-duplicate",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
    ],
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true",
        explanation: "1 appears at indices 0 and 3.",
      },
      {
        input: "nums = [1,2,3,4]",
        output: "false",
        explanation: "All elements are distinct.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_set>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) {\n            cin >> nums[i];\n        }\n        // Check if any value appears at least twice and print "true" or "false"\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *nums = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) {\n            scanf("%d", &nums[i]);\n        }\n        // Check if any value appears at least twice and print "true" or "false"\n        free(nums);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    nums = [int(x) for x in input_data[1:n+1]]\n    # Check if any value appears at least twice and print "true" or "false"\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Check if any value appears at least twice and print "true" or "false"\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Check if any value appears at least twice and print "true" or "false"\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) {\n                nums[i] = scanner.nextInt();\n            }\n            // Check if any value appears at least twice and print "true" or "false"\n        }\n    }\n}`,
    },
    testCases: [
      { input: "4\n1 2 3 1", expectedOutput: "true", isHidden: false },
      { input: "4\n1 2 3 4", expectedOutput: "false", isHidden: false },
      { input: "10\n1 1 1 3 3 4 3 2 4 2", expectedOutput: "true", isHidden: false },
      { input: "1\n0", expectedOutput: "false", isHidden: true },
      { input: "5\n1 5 -2 -4 0", expectedOutput: "false", isHidden: true },
    ],
    hints: [
      "A hash set allows O(1) membership check.",
    ],
  },
  {
    title: "Valid Anagram",
    slug: "valid-anagram",
    difficulty: "Easy",
    tags: ["String", "Hash Table", "Sorting"],
    description: `Given two strings \`s\` and \`t\`, return \`true\` *if* \`t\` *is an anagram of* \`s\`, *and* \`false\` *otherwise*.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters.",
    ],
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: "true",
        explanation: "Both strings have the exact same letter counts.",
      },
      {
        input: 's = "rat", t = "car"',
        output: "false",
        explanation: "'r', 'a', 't' cannot form 'car'.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <string>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n    string s, t;\n    if (cin >> s >> t) {\n        // Return true if t is an anagram of s, false otherwise\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n#include <stdbool.h>\n\nint main() {\n    char s[50005], t[50005];\n    if (scanf("%s %s", s, t) == 2) {\n        // Return true if t is an anagram of s, false otherwise\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if len(input_data) < 2:\n        return\n    s = input_data[0]\n    t = input_data[1]\n    # Return true if t is an anagram of s, false otherwise\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length < 2) return;\n    const s = input[0];\n    const t = input[1];\n    // Return true if t is an anagram of s, false otherwise\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length < 2) return;\n    const s = input[0];\n    const t = input[1];\n    // Return true if t is an anagram of s, false otherwise\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNext()) {\n            String s = scanner.next();\n            String t = scanner.next();\n            // Return true if t is an anagram of s, false otherwise\n        }\n    }\n}`,
    },
    testCases: [
      { input: "anagram\nnagaram", expectedOutput: "true", isHidden: false },
      { input: "rat\ncar", expectedOutput: "false", isHidden: false },
      { input: "a\nab", expectedOutput: "false", isHidden: true },
      { input: "listen\nsilent", expectedOutput: "true", isHidden: true },
    ],
    hints: [
      "If lengths differ, they cannot be anagrams.",
      "Count frequencies of each letter using a fixed array of size 26 or a hash map.",
    ],
  },
  {
    title: "Group Anagrams",
    slug: "group-anagrams",
    difficulty: "Medium",
    tags: ["Array", "Hash Table", "String", "Sorting"],
    description: `Given an array of strings \`strs\`, group **the anagrams** together. You can return the answer in **any order**.`,
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters.",
    ],
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: "Anagrams are grouped together.",
      },
      {
        input: 'strs = [""]',
        output: '[[""]]',
        explanation: "Single empty string.",
      },
      {
        input: 'strs = ["a"]',
        output: '[["a"]]',
        explanation: "Single character.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<string> strs(n);\n        for (int i = 0; i < n; i++) {\n            cin >> strs[i];\n        }\n        // Group anagrams together and print each group on a new line\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        char strs[10005][105];\n        for (int i = 0; i < n; i++) {\n            scanf("%s", strs[i]);\n        }\n        // Group anagrams together and print each group on a new line\n    }\n    return 0;\n}`,
      python: `import sys\nfrom collections import defaultdict\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    strs = input_data[1:n+1]\n    # Group anagrams together and print each group on a new line\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const strs = input.slice(1, n + 1);\n    // Group anagrams together and print each group on a new line\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const strs = input.slice(1, n + 1);\n    // Group anagrams together and print each group on a new line\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            String[] strs = new String[n];\n            for (int i = 0; i < n; i++) {\n                strs[i] = scanner.next();\n            }\n            // Group anagrams together and print each group on a new line\n        }\n    }\n}`,
    },
    testCases: [
      { input: "6\neat tea tan ate nat bat", expectedOutput: "eat tea ate\ntan nat\nbat", isHidden: false },
      { input: "1\na", expectedOutput: "a", isHidden: false },
      { input: "2\nbdddddddddd bbbbbbbbbbc", expectedOutput: "bdddddddddd\nbbbbbbbbbbc", isHidden: true },
      { input: "4\na b a b", expectedOutput: "a a\nb b", isHidden: true },
    ],
    hints: [
      "Sorted strings can serve as identical keys in a hash map.",
      "Alternatively, use character count tuples as hash keys.",
    ],
  },
  {
    title: "Top K Frequent Elements",
    slug: "top-k-frequent-elements",
    difficulty: "Medium",
    tags: ["Array", "Hash Table", "Heap", "Bucket Sort"],
    description: `Given an integer array \`nums\` and an integer \`k\`, return *the* \`k\` *most frequent elements*. You may return the answer in **any order**.`,
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
      "k is in the range [1, the number of unique elements in the array].",
      "It is guaranteed that the answer is unique.",
    ],
    examples: [
      {
        input: "nums = [1,1,1,2,2,3], k = 2",
        output: "[1,2]",
        explanation: "1 appears 3 times and 2 appears 2 times.",
      },
      {
        input: "nums = [1], k = 1",
        output: "[1]",
        explanation: "Only one element.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\n#include <queue>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) {\n            cin >> nums[i];\n        }\n        int k;\n        cin >> k;\n        // Find the k most frequent elements and print them space-separated\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *nums = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) {\n            scanf("%d", &nums[i]);\n        }\n        int k;\n        scanf("%d", &k);\n        // Find the k most frequent elements and print them space-separated\n        free(nums);\n    }\n    return 0;\n}`,
      python: `import sys\nfrom collections import Counter\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    nums = [int(x) for x in input_data[1:n+1]]\n    k = int(input_data[n+1])\n    # Find the k most frequent elements and print them space-separated\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    const k = parseInt(input[n + 1], 10);\n    // Find the k most frequent elements and print them space-separated\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    const k = parseInt(input[n + 1], 10);\n    // Find the k most frequent elements and print them space-separated\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) {\n                nums[i] = scanner.nextInt();\n            }\n            int k = scanner.nextInt();\n            // Find the k most frequent elements and print them space-separated\n        }\n    }\n}`,
    },
    testCases: [
      { input: "6\n1 1 1 2 2 3\n2", expectedOutput: "1 2", isHidden: false },
      { input: "1\n1\n1", expectedOutput: "1", isHidden: false },
      { input: "7\n4 1 -1 2 -1 2 3\n2", expectedOutput: "-1 2", isHidden: true },
      { input: "6\n5 5 5 2 2 1\n1", expectedOutput: "5", isHidden: true },
    ],
    hints: [
      "Count frequencies in a hash map.",
      "Use Bucket Sort where index represents frequency to achieve O(n) time.",
    ],
  },
  {
    title: "Product of Array Except Self",
    slug: "product-of-array-except-self",
    difficulty: "Medium",
    tags: ["Array", "Prefix Sum"],
    description: `Given an integer array \`nums\`, return *an array* \`answer\` *such that* \`answer[i]\` *is equal to the product of all the elements of* \`nums\` *except* \`nums[i]\`.

The product of any prefix or suffix of \`nums\` is **guaranteed** to fit in a **32-bit** integer.

You must write an algorithm that runs in \`O(n)\` time and without using the division operation.`,
    constraints: [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
    ],
    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]",
        explanation: "Product except 1 is 24, except 2 is 12, etc.",
      },
      {
        input: "nums = [-1,1,0,-3,3]",
        output: "[0,0,9,0,0]",
        explanation: "Product except 0 is 9.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) {\n            cin >> nums[i];\n        }\n        // Compute product of array except self and print result\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *nums = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) {\n            scanf("%d", &nums[i]);\n        }\n        // Compute product of array except self and print result\n        free(nums);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    nums = [int(x) for x in input_data[1:n+1]]\n    # Compute product of array except self and print result\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Compute product of array except self and print result\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Compute product of array except self and print result\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) {\n                nums[i] = scanner.nextInt();\n            }\n            // Compute product of array except self and print result\n        }\n    }\n}`,
    },
    testCases: [
      { input: "4\n1 2 3 4", expectedOutput: "24 12 8 6", isHidden: false },
      { input: "5\n-1 1 0 -3 3", expectedOutput: "0 0 9 0 0", isHidden: false },
      { input: "5\n4 5 1 8 2", expectedOutput: "80 64 320 40 160", isHidden: true },
    ],
    hints: [
      "Compute left prefix products and right suffix products.",
    ],
  },
  {
    title: "Longest Consecutive Sequence",
    slug: "longest-consecutive-sequence",
    difficulty: "Medium",
    tags: ["Array", "Hash Table", "Union Find"],
    description: `Given an unsorted array of integers \`nums\`, return *the length of the longest consecutive elements sequence.*

You must write an algorithm that runs in \`O(n)\` time.`,
    constraints: [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
    ],
    examples: [
      {
        input: "nums = [100,4,200,1,3,2]",
        output: "4",
        explanation: "The longest consecutive elements sequence is [1, 2, 3, 4]. Its length is 4.",
      },
      {
        input: "nums = [0,3,7,2,5,8,4,6,0,1]",
        output: "9",
        explanation: "Sequence from 0 to 8 has length 9.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_set>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) {\n            cin >> nums[i];\n        }\n        // Find the length of the longest consecutive sequence and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *nums = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) {\n            scanf("%d", &nums[i]);\n        }\n        // Find the length of the longest consecutive sequence and print it\n        free(nums);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    nums = [int(x) for x in input_data[1:n+1]]\n    # Find the length of the longest consecutive sequence and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Find the length of the longest consecutive sequence and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Find the length of the longest consecutive sequence and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) {\n                nums[i] = scanner.nextInt();\n            }\n            // Find the length of the longest consecutive sequence and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "6\n100 4 200 1 3 2", expectedOutput: "4", isHidden: false },
      { input: "10\n0 3 7 2 5 8 4 6 0 1", expectedOutput: "9", isHidden: false },
      { input: "0", expectedOutput: "0", isHidden: true },
      { input: "4\n1 2 0 1", expectedOutput: "3", isHidden: true },
    ],
    hints: [
      "Put all numbers in a HashSet.",
      "Only start counting a sequence from `num` if `num - 1` is not in the set.",
    ],
  },
  {
    title: "First Missing Positive",
    slug: "first-missing-positive",
    difficulty: "Hard",
    tags: ["Array", "Hash Table"],
    description: `Given an unsorted integer array \`nums\`. Return the *smallest positive integer* that is *not present* in \`nums\`.

You must implement an algorithm that runs in \`O(n)\` time and uses \`O(1)\` auxiliary space.`,
    constraints: [
      "1 <= nums.length <= 10^5",
      "-2^31 <= nums[i] <= 2^31 - 1",
    ],
    examples: [
      {
        input: "nums = [1,2,0]",
        output: "3",
        explanation: "The numbers in the range [1,2] are all in the array.",
      },
      {
        input: "nums = [3,4,-1,1]",
        output: "2",
        explanation: "1 is in the array, but 2 is missing.",
      },
      {
        input: "nums = [7,8,9,11,12]",
        output: "1",
        explanation: "The smallest positive integer 1 is missing.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> nums(n);\n        for (int i = 0; i < n; i++) {\n            cin >> nums[i];\n        }\n        // Find the smallest positive integer missing from nums and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *nums = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) {\n            scanf("%d", &nums[i]);\n        }\n        // Find the smallest positive integer missing from nums and print it\n        free(nums);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    nums = [int(x) for x in input_data[1:n+1]]\n    # Find the smallest positive integer missing from nums and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Find the smallest positive integer missing from nums and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const nums = input.slice(1, n + 1).map(Number);\n    // Find the smallest positive integer missing from nums and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] nums = new int[n];\n            for (int i = 0; i < n; i++) {\n                nums[i] = scanner.nextInt();\n            }\n            // Find the smallest positive integer missing from nums and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "3\n1 2 0", expectedOutput: "3", isHidden: false },
      { input: "4\n3 4 -1 1", expectedOutput: "2", isHidden: false },
      { input: "5\n7 8 9 11 12", expectedOutput: "1", isHidden: false },
      { input: "1\n1", expectedOutput: "2", isHidden: true },
      { input: "1\n2", expectedOutput: "1", isHidden: true },
    ],
    hints: [
      "The answer must be in the range [1, n + 1].",
      "Place each number `x` at index `x - 1` by cyclic swapping.",
    ],
  },
];
