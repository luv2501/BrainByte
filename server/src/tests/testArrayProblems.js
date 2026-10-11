import dotenv from "dotenv";
dotenv.config();

import { evaluateSubmission } from "../services/pistonService.js";
import { arrayProblems } from "../data/categories/arrays.js";

const solutions = {
  "two-sum": {
    language: "python",
    code: `import sys
def main():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    nums = [int(x) for x in data[1:n+1]]
    target = int(data[n+1])
    seen = {}
    for i, num in enumerate(nums):
        comp = target - num
        if comp in seen:
            print(f"{seen[comp]} {i}")
            break
        seen[num] = i
if __name__ == '__main__':
    main()`,
  },
  "contains-duplicate": {
    language: "python",
    code: `import sys
def main():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    nums = [int(x) for x in data[1:n+1]]
    print("true" if len(nums) != len(set(nums)) else "false")
if __name__ == '__main__':
    main()`,
  },
  "valid-anagram": {
    language: "javascript",
    code: `const fs = require('fs');
function main() {
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (input.length < 2) return;
    const s = input[0], t = input[1];
    const sortStr = str => str.split('').sort().join('');
    console.log(sortStr(s) === sortStr(t) ? 'true' : 'false');
}
main();`,
  },
  "group-anagrams": {
    language: "python",
    code: `import sys
from collections import defaultdict
def main():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    strs = data[1:n+1]
    groups = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))
        groups[key].append(s)
    for g in groups.values():
        print(' '.join(g))
if __name__ == '__main__':
    main()`,
  },
  "top-k-frequent-elements": {
    language: "python",
    code: `import sys
from collections import Counter
def main():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    nums = [int(x) for x in data[1:n+1]]
    k = int(data[n+1])
    counts = Counter(nums)
    most_common = [x[0] for x in counts.most_common(k)]
    print(' '.join(str(x) for x in most_common))
if __name__ == '__main__':
    main()`,
  },
  "product-of-array-except-self": {
    language: "python",
    code: `import sys
def main():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    nums = [int(x) for x in data[1:n+1]]
    res = [1] * n
    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= suffix
        suffix *= nums[i]
    print(' '.join(str(x) for x in res))
if __name__ == '__main__':
    main()`,
  },
  "longest-consecutive-sequence": {
    language: "python",
    code: `import sys
def main():
    data = sys.stdin.read().split()
    if not data:
        print(0)
        return
    n = int(data[0])
    if n == 0:
        print(0)
        return
    nums = set(int(x) for x in data[1:n+1])
    longest = 0
    for num in nums:
        if num - 1 not in nums:
            curr = num
            streak = 1
            while curr + 1 in nums:
                curr += 1
                streak += 1
            longest = max(longest, streak)
    print(longest)
if __name__ == '__main__':
    main()`,
  },
  "first-missing-positive": {
    language: "javascript",
    code: `const fs = require('fs');
function main() {
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (input.length === 0 || input[0] === '') return;
    const n = parseInt(input[0], 10);
    const nums = input.slice(1, n + 1).map(Number);
    const set = new Set(nums);
    let i = 1;
    while (set.has(i)) i++;
    console.log(i);
}
main();`,
  },
};

async function runTests() {
  console.log("Testing all 8 Array problems against Piston execution:\n");
  let allPassed = true;

  for (const prob of arrayProblems) {
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
      const { runCode } = await import("../services/pistonService.js");
      const direct = await runCode(sol.code, sol.language, prob.testCases[0].input);
      console.log("Direct runCode result:", JSON.stringify(direct, null, 2));
    }
  }

  if (allPassed) {
    console.log("\n🎉 ALL 8 ARRAY PROBLEMS PASSED SUCCESSFULLY!");
    process.exit(0);
  } else {
    console.error("\n❌ Some tests failed.");
    process.exit(1);
  }
}

runTests();
