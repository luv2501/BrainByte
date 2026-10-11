/**
 * Stack & Queue Problem Collection
 */

export const stackQueueProblems = [
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "Matching round parentheses.",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "All brackets match.",
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation: "Mismatched bracket types.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <string>\n#include <stack>\n\nusing namespace std;\n\nint main() {\n    string s;\n    if (cin >> s) {\n        // Return true if s is a valid parentheses string, false otherwise\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n#include <stdbool.h>\n\nint main() {\n    char s[10005];\n    if (scanf("%s", s) == 1) {\n        // Return true if s is a valid parentheses string, false otherwise\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    s = input_data[0]\n    # Return true if s is a valid parentheses string, false otherwise\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const s = input[0];\n    // Return true if s is a valid parentheses string, false otherwise\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const s = input[0];\n    // Return true if s is a valid parentheses string, false otherwise\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNext()) {\n            String s = scanner.next();\n            // Return true if s is a valid parentheses string, false otherwise\n        }\n    }\n}`,
    },
    testCases: [
      { input: "()", expectedOutput: "true", isHidden: false },
      { input: "()[]{}", expectedOutput: "true", isHidden: false },
      { input: "(]", expectedOutput: "false", isHidden: false },
      { input: "([)]", expectedOutput: "false", isHidden: true },
      { input: "{[]}", expectedOutput: "true", isHidden: true },
    ],
    hints: [
      "Push opening brackets onto a stack and pop when matching closing brackets occur.",
    ],
  },
  {
    title: "Min Stack",
    slug: "min-stack",
    difficulty: "Medium",
    tags: ["Stack", "Design"],
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the \`MinStack\` class:
- \`MinStack()\` initializes the stack object.
- \`void push(int val)\` pushes the element val onto the stack.
- \`void pop()\` removes the element on the top of the stack.
- \`int top()\` gets the top element of the stack.
- \`int getMin()\` retrieves the minimum element in the stack.

You must implement a solution with \`O(1)\` time complexity for each function.`,
    constraints: [
      "-2^31 <= val <= 2^31 - 1",
      "Methods pop, top and getMin operations will always be called on non-empty stacks.",
      "At most 3 * 10^4 calls will be made to push, pop, top, and getMin.",
    ],
    examples: [
      {
        input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]',
        output: "[null,null,null,null,-3,null,0,-2]",
        explanation: "MinStack retrieves -3, then after popping top, min becomes -2.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <string>\n#include <stack>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        stack<int> s, minS;\n        while (n--) {\n            string op;\n            cin >> op;\n            if (op == "push") {\n                int val;\n                cin >> val;\n                // push val\n            } else if (op == "pop") {\n                // pop\n            } else if (op == "top") {\n                // print top\n            } else if (op == "getMin") {\n                // print minimum\n            }\n        }\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        // Implement MinStack and process operations: push <val>, pop, top, getMin\n        while (n--) {\n            char op[16];\n            scanf("%s", op);\n            if (strcmp(op, "push") == 0) {\n                int val;\n                scanf("%d", &val);\n            } else if (strcmp(op, "pop") == 0) {\n            } else if (strcmp(op, "top") == 0) {\n            } else if (strcmp(op, "getMin") == 0) {\n            }\n        }\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    idx = 1\n    # Implement MinStack and process operations: push <val>, pop, top, getMin\n    for _ in range(n):\n        op = input_data[idx]\n        idx += 1\n        if op == "push":\n            val = int(input_data[idx])\n            idx += 1\n        elif op == "pop":\n            pass\n        elif op == "top":\n            pass\n        elif op == "getMin":\n            pass\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    let idx = 1;\n    // Implement MinStack and process operations: push <val>, pop, top, getMin\n    for (let i = 0; i < n; i++) {\n        const op = input[idx++];\n        if (op === "push") {\n            const val = parseInt(input[idx++], 10);\n        } else if (op === "pop") {\n        } else if (op === "top") {\n        } else if (op === "getMin") {\n        }\n    }\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    let idx = 1;\n    // Implement MinStack and process operations: push <val>, pop, top, getMin\n    for (let i = 0; i < n; i++) {\n        const op = input[idx++];\n        if (op === "push") {\n            const val = parseInt(input[idx++], 10);\n        } else if (op === "pop") {\n        } else if (op === "top") {\n        } else if (op === "getMin") {\n        }\n    }\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            // Implement MinStack and process operations: push <val>, pop, top, getMin\n            while (n-- > 0 && scanner.hasNext()) {\n                String op = scanner.next();\n                if (op.equals("push")) {\n                    int val = scanner.nextInt();\n                } else if (op.equals("pop")) {\n                } else if (op.equals("top")) {\n                } else if (op.equals("getMin")) {\n                }\n            }\n        }\n    }\n}`,
    },
    testCases: [
      { input: "7\npush -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin", expectedOutput: "-3\n0\n-2", isHidden: false },
      { input: "4\npush 1\npush 2\ntop\ngetMin", expectedOutput: "2\n1", isHidden: false },
      { input: "5\npush 5\npush 3\ngetMin\npop\ngetMin", expectedOutput: "3\n5", isHidden: true },
      { input: "6\npush 10\npush 10\ntop\ngetMin\npop\ngetMin", expectedOutput: "10\n10\n10", isHidden: true },
    ],
    hints: [
      "Maintain a secondary stack that tracks the running minimum at each height.",
    ],
  },
  {
    title: "Evaluate Reverse Polish Notation",
    slug: "evaluate-reverse-polish-notation",
    difficulty: "Medium",
    tags: ["Array", "Math", "Stack"],
    description: `You are given an array of strings \`tokens\` that represents an arithmetic expression in a **Reverse Polish Notation** (Postfix).

Evaluate the expression. Return *an integer that represents the value of the expression*.

The valid operators are \`'+'\`, \`'-'\`, \`'*'\`, and \`'/'\`. Division between two integers should truncate toward zero.`,
    constraints: [
      "1 <= tokens.length <= 10^4",
      "tokens[i] is either an operator: '+', '-', '*', or '/', or an integer in the range [-200, 200].",
    ],
    examples: [
      {
        input: 'tokens = ["2","1","+","3","*"]',
        output: "9",
        explanation: "((2 + 1) * 3) = 9",
      },
      {
        input: 'tokens = ["4","13","5","/","+"]',
        output: "6",
        explanation: "(4 + (13 / 5)) = 6",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <stack>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<string> tokens(n);\n        for (int i = 0; i < n; i++) {\n            cin >> tokens[i];\n        }\n        // Evaluate the Reverse Polish Notation expression and print the result\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        char tokens[10005][16];\n        for (int i = 0; i < n; i++) {\n            scanf("%s", tokens[i]);\n        }\n        // Evaluate the Reverse Polish Notation expression and print the result\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    tokens = input_data[1:n+1]\n    # Evaluate the Reverse Polish Notation expression and print the result\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const tokens = input.slice(1, n + 1);\n    // Evaluate the Reverse Polish Notation expression and print the result\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const tokens = input.slice(1, n + 1);\n    // Evaluate the Reverse Polish Notation expression and print the result\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            String[] tokens = new String[n];\n            for (int i = 0; i < n; i++) {\n                tokens[i] = scanner.next();\n            }\n            // Evaluate the Reverse Polish Notation expression and print the result\n        }\n    }\n}`,
    },
    testCases: [
      { input: "5\n2 1 + 3 *", expectedOutput: "9", isHidden: false },
      { input: "5\n4 13 5 / +", expectedOutput: "6", isHidden: false },
      { input: "13\n10 6 9 3 + -11 * / * 17 + 5 +", expectedOutput: "22", isHidden: false },
      { input: "3\n3 4 -", expectedOutput: "-1", isHidden: true },
      { input: "3\n4 2 /", expectedOutput: "2", isHidden: true },
    ],
    hints: [
      "Operands are pushed to a stack; operators pop two operands, apply operation, and push result back.",
    ],
  },
  {
    title: "Daily Temperatures",
    slug: "daily-temperatures",
    difficulty: "Medium",
    tags: ["Array", "Stack", "Monotonic Stack"],
    description: `Given an array of integers \`temperatures\` represents the daily temperatures, return *an array* \`answer\` *such that* \`answer[i]\` *is the number of days you have to wait after the* \`i\`th *day to get a warmer temperature*. If there is no future day for which this is possible, keep \`answer[i] == 0\` instead.`,
    constraints: [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100",
    ],
    examples: [
      {
        input: "temperatures = [73,74,75,71,69,72,76,73]",
        output: "[1,1,4,2,1,1,0,0]",
        explanation: "On day 0 (73), day 1 (74) is warmer (1 day wait).",
      },
      {
        input: "temperatures = [30,40,50,60]",
        output: "[1,1,1,0]",
        explanation: "Each day is warmer than the previous.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <stack>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> temperatures(n);\n        for (int i = 0; i < n; i++) {\n            cin >> temperatures[i];\n        }\n        // Compute the wait days for warmer temperature and print space-separated\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *temperatures = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) {\n            scanf("%d", &temperatures[i]);\n        }\n        // Compute the wait days for warmer temperature and print space-separated\n        free(temperatures);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    temperatures = [int(x) for x in input_data[1:n+1]]\n    # Compute the wait days for warmer temperature and print space-separated\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const temperatures = input.slice(1, n + 1).map(Number);\n    // Compute the wait days for warmer temperature and print space-separated\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const temperatures = input.slice(1, n + 1).map(Number);\n    // Compute the wait days for warmer temperature and print space-separated\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] temperatures = new int[n];\n            for (int i = 0; i < n; i++) {\n                temperatures[i] = scanner.nextInt();\n            }\n            // Compute the wait days for warmer temperature and print space-separated\n        }\n    }\n}`,
    },
    testCases: [
      { input: "8\n73 74 75 71 69 72 76 73", expectedOutput: "1 1 4 2 1 1 0 0", isHidden: false },
      { input: "4\n30 40 50 60", expectedOutput: "1 1 1 0", isHidden: false },
      { input: "3\n30 60 90", expectedOutput: "1 1 0", isHidden: true },
      { input: "4\n89 62 70 58", expectedOutput: "0 1 0 0", isHidden: true },
    ],
    hints: [
      "Use a monotonic decreasing stack storing indices.",
    ],
  },
  {
    title: "Largest Rectangle in Histogram",
    slug: "largest-rectangle-in-histogram",
    difficulty: "Hard",
    tags: ["Array", "Stack", "Monotonic Stack"],
    description: `Given an array of integers \`heights\` representing the histogram's bar height where the width of each bar is \`1\`, return *the area of the largest rectangle in the histogram*.`,
    constraints: [
      "1 <= heights.length <= 10^5",
      "0 <= heights[i] <= 10^4",
    ],
    examples: [
      {
        input: "heights = [2,1,5,6,2,3]",
        output: "10",
        explanation: "The largest rectangle is formed by bars [5, 6] with area = 2 * 5 = 10.",
      },
      {
        input: "heights = [2,4]",
        output: "4",
        explanation: "Max rectangle has area = 4.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <stack>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> heights(n);\n        for (int i = 0; i < n; i++) {\n            cin >> heights[i];\n        }\n        // Compute the largest rectangle area in the histogram and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        int *heights = (int *)malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) {\n            scanf("%d", &heights[i]);\n        }\n        // Compute the largest rectangle area in the histogram and print it\n        free(heights);\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    heights = [int(x) for x in input_data[1:n+1]]\n    # Compute the largest rectangle area in the histogram and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const heights = input.slice(1, n + 1).map(Number);\n    // Compute the largest rectangle area in the histogram and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const heights = input.slice(1, n + 1).map(Number);\n    // Compute the largest rectangle area in the histogram and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] heights = new int[n];\n            for (int i = 0; i < n; i++) {\n                heights[i] = scanner.nextInt();\n            }\n            // Compute the largest rectangle area in the histogram and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "6\n2 1 5 6 2 3", expectedOutput: "10", isHidden: false },
      { input: "2\n2 4", expectedOutput: "4", isHidden: false },
      { input: "1\n1", expectedOutput: "1", isHidden: true },
      { input: "3\n2 1 2", expectedOutput: "3", isHidden: true },
    ],
    hints: [
      "A monotonic increasing stack allows finding the nearest smaller elements on left and right.",
    ],
  },
  {
    title: "Implement Queue using Stacks",
    slug: "implement-queue-using-stacks",
    difficulty: "Easy",
    tags: ["Stack", "Design", "Queue"],
    description: `Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (\`push\`, \`peek\`, \`pop\`, and \`empty\`).`,
    constraints: [
      "1 <= x <= 9",
      "At most 100 calls will be made to push, pop, peek, and empty.",
      "All the calls to pop and peek are valid.",
    ],
    examples: [
      {
        input: '["MyQueue","push","push","peek","pop","empty"]\n[[],[1],[2],[],[],[]]',
        output: "[null,null,null,1,1,false]",
        explanation: "Queue handles push 1, push 2, peek (1), pop (1), empty (false).",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <string>\n#include <stack>\n\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        stack<int> inStack, outStack;\n        while (n--) {\n            string op;\n            cin >> op;\n            if (op == "push") {\n                int val;\n                cin >> val;\n                // push val into queue\n            } else if (op == "pop") {\n                // remove and print front element\n            } else if (op == "peek") {\n                // print front element\n            } else if (op == "empty") {\n                // print "true" or "false"\n            }\n        }\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <stdbool.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        // Implement Queue using two stacks and process operations: push <val>, pop, peek, empty\n        while (n--) {\n            char op[16];\n            scanf("%s", op);\n            if (strcmp(op, "push") == 0) {\n                int val;\n                scanf("%d", &val);\n            } else if (strcmp(op, "pop") == 0) {\n            } else if (strcmp(op, "peek") == 0) {\n            } else if (strcmp(op, "empty") == 0) {\n            }\n        }\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    idx = 1\n    # Implement Queue using two stacks and process operations: push <val>, pop, peek, empty\n    for _ in range(n):\n        op = input_data[idx]\n        idx += 1\n        if op == "push":\n            val = int(input_data[idx])\n            idx += 1\n        elif op == "pop":\n            pass\n        elif op == "peek":\n            pass\n        elif op == "empty":\n            pass\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    let idx = 1;\n    // Implement Queue using two stacks and process operations: push <val>, pop, peek, empty\n    for (let i = 0; i < n; i++) {\n        const op = input[idx++];\n        if (op === "push") {\n            const val = parseInt(input[idx++], 10);\n        } else if (op === "pop") {\n        } else if (op === "peek") {\n        } else if (op === "empty") {\n        }\n    }\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    let idx = 1;\n    // Implement Queue using two stacks and process operations: push <val>, pop, peek, empty\n    for (let i = 0; i < n; i++) {\n        const op = input[idx++];\n        if (op === "push") {\n            const val = parseInt(input[idx++], 10);\n        } else if (op === "pop") {\n        } else if (op === "peek") {\n        } else if (op === "empty") {\n        }\n    }\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            // Implement Queue using two stacks and process operations: push <val>, pop, peek, empty\n            while (n-- > 0 && scanner.hasNext()) {\n                String op = scanner.next();\n                if (op.equals("push")) {\n                    int val = scanner.nextInt();\n                } else if (op.equals("pop")) {\n                } else if (op.equals("peek")) {\n                } else if (op.equals("empty")) {\n                }\n            }\n        }\n    }\n}`,
    },
    testCases: [
      { input: "5\npush 1\npush 2\npeek\npop\nempty", expectedOutput: "1\n1\nfalse", isHidden: false },
      { input: "3\npush 5\npop\nempty", expectedOutput: "5\ntrue", isHidden: false },
      { input: "7\npush 10\npush 20\npush 30\npop\npeek\npop\nempty", expectedOutput: "10\n20\n20\nfalse", isHidden: true },
      { input: "4\nempty\npush 100\npeek\nempty", expectedOutput: "true\n100\nfalse", isHidden: true },
    ],
    hints: [
      "Use inStack for pushing and outStack for popping/peeking. Transfer elements only when outStack is empty.",
    ],
  },
];
