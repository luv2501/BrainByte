import dotenv from "dotenv";
dotenv.config();

import { evaluateSubmission } from "../services/pistonService.js";
import { stackQueueProblems } from "../data/categories/stackQueue.js";

const solutions = {
  "valid-parentheses": {
    language: "python",
    code: `import sys
def main():
    data = sys.stdin.read().split()
    if not data: return
    s = data[0]
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                print("false")
                return
        else:
            stack.append(char)
    print("true" if not stack else "false")
if __name__ == '__main__':
    main()`,
  },
  "min-stack": {
    language: "python",
    code: `import sys
def main():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    idx = 1
    stack = []
    min_stack = []
    for _ in range(n):
        op = data[idx]; idx += 1
        if op == "push":
            val = int(data[idx]); idx += 1
            stack.append(val)
            if not min_stack or val <= min_stack[-1]:
                min_stack.append(val)
        elif op == "pop":
            val = stack.pop()
            if val == min_stack[-1]:
                min_stack.pop()
        elif op == "top":
            print(stack[-1])
        elif op == "getMin":
            print(min_stack[-1])
if __name__ == '__main__':
    main()`,
  },
  "evaluate-reverse-polish-notation": {
    language: "python",
    code: `import sys
def main():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    tokens = data[1:n+1]
    stack = []
    for token in tokens:
        if token in "+-*/":
            b = stack.pop()
            a = stack.pop()
            if token == "+": stack.append(a + b)
            elif token == "-": stack.append(a - b)
            elif token == "*": stack.append(a * b)
            elif token == "/": stack.append(int(a / b))
        else:
            stack.append(int(token))
    print(stack[0])
if __name__ == '__main__':
    main()`,
  },
  "daily-temperatures": {
    language: "python",
    code: `import sys
def main():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    temperatures = [int(x) for x in data[1:n+1]]
    res = [0] * n
    stack = []
    for i, t in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < t:
            prev = stack.pop()
            res[prev] = i - prev
        stack.append(i)
    print(' '.join(str(x) for x in res))
if __name__ == '__main__':
    main()`,
  },
  "largest-rectangle-in-histogram": {
    language: "python",
    code: `import sys
def main():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    heights = [int(x) for x in data[1:n+1]]
    stack = []
    max_area = 0
    heights.append(0)
    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    print(max_area)
if __name__ == '__main__':
    main()`,
  },
  "implement-queue-using-stacks": {
    language: "python",
    code: `import sys
def main():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    idx = 1
    in_stack = []
    out_stack = []
    for _ in range(n):
        op = data[idx]; idx += 1
        if op == "push":
            val = int(data[idx]); idx += 1
            in_stack.append(val)
        elif op == "pop":
            if not out_stack:
                while in_stack:
                    out_stack.append(in_stack.pop())
            print(out_stack.pop())
        elif op == "peek":
            if not out_stack:
                while in_stack:
                    out_stack.append(in_stack.pop())
            print(out_stack[-1])
        elif op == "empty":
            is_empty = not in_stack and not out_stack
            print("true" if is_empty else "false")
if __name__ == '__main__':
    main()`,
  },
};

async function runTests() {
  console.log("Testing all 6 Stack & Queue problems against Piston execution:\n");
  let allPassed = true;

  for (const prob of stackQueueProblems) {
    const sol = solutions[prob.slug];
    if (!sol) {
      console.log(`[MISSING TEST] ${prob.slug}`);
      allPassed = false;
      continue;
    }

    const result = await evaluateSubmission(
      sol.code,
      sol.language,
      prob.testCases
    );

    const isPass = result.verdict === "Accepted";
    const status = isPass ? "✅ PASS" : `❌ FAIL: ${result.verdict}`;
    console.log(
      `[${status}] ${prob.title} (${prob.slug}) - Passed ${result.passedTests}/${result.totalTests} tests (Lang: ${sol.language})`
    );

    if (!isPass) {
      allPassed = false;
      console.log("Failure results:", JSON.stringify(result.results, null, 2));
    }
  }

  if (allPassed) {
    console.log("\n🎉 ALL 6 STACK & QUEUE PROBLEMS PASSED SUCCESSFULLY!");
    process.exit(0);
  } else {
    console.error("\n❌ Some tests failed.");
    process.exit(1);
  }
}

runTests();
