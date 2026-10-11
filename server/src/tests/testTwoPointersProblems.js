import dotenv from "dotenv";
dotenv.config();

import { evaluateSubmission } from "../services/pistonService.js";
import { twoPointersProblems } from "../data/categories/twoPointers.js";

const solutions = {
  "valid-palindrome": {
    language: "python",
    code: `import sys
def main():
    s = sys.stdin.read().rstrip('\\r\\n')
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    print("true" if cleaned == cleaned[::-1] else "false")
if __name__ == '__main__':
    main()`,
  },
  "two-sum-ii-input-array-is-sorted": {
    language: "python",
    code: `import sys
def main():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    numbers = [int(x) for x in data[1:n+1]]
    target = int(data[n+1])
    left, right = 0, n - 1
    while left < right:
        s = numbers[left] + numbers[right]
        if s == target:
            print(f"{left + 1} {right + 1}")
            break
        elif s < target:
            left += 1
        else:
            right -= 1
if __name__ == '__main__':
    main()`,
  },
  "3sum": {
    language: "python",
    code: `import sys
def main():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    nums = sorted([int(x) for x in data[1:n+1]])
    res = []
    for i in range(n - 2):
        if i > 0 and nums[i] == nums[i-1]:
            continue
        l, r = i + 1, n - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                res.append(f"{nums[i]} {nums[l]} {nums[r]}")
                while l < r and nums[l] == nums[l+1]: l += 1
                while l < r and nums[r] == nums[r-1]: r -= 1
                l += 1
                r -= 1
            elif s < 0:
                l += 1
            else:
                r -= 1
    for triplet in res:
        print(triplet)
if __name__ == '__main__':
    main()`,
  },
  "container-with-most-water": {
    language: "python",
    code: `import sys
def main():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    height = [int(x) for x in data[1:n+1]]
    left, right = 0, n - 1
    max_area = 0
    while left < right:
        area = min(height[left], height[right]) * (right - left)
        if area > max_area:
            max_area = area
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    print(max_area)
if __name__ == '__main__':
    main()`,
  },
  "trapping-rain-water": {
    language: "python",
    code: `import sys
def main():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    height = [int(x) for x in data[1:n+1]]
    if n < 3:
        print(0)
        return
    l, r = 0, n - 1
    left_max, right_max = height[l], height[r]
    water = 0
    while l < r:
        if left_max <= right_max:
            l += 1
            left_max = max(left_max, height[l])
            water += left_max - height[l]
        else:
            r -= 1
            right_max = max(right_max, height[r])
            water += right_max - height[r]
    print(water)
if __name__ == '__main__':
    main()`,
  },
  "best-time-to-buy-and-sell-stock": {
    language: "python",
    code: `import sys
def main():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    prices = [int(x) for x in data[1:n+1]]
    min_price = float('inf')
    max_profit = 0
    for p in prices:
        if p < min_price:
            min_price = p
        elif p - min_price > max_profit:
            max_profit = p - min_price
    print(max_profit)
if __name__ == '__main__':
    main()`,
  },
  "longest-substring-without-repeating-characters": {
    language: "python",
    code: `import sys
def main():
    s = sys.stdin.read().rstrip('\\r\\n')
    seen = {}
    left = 0
    max_len = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        max_len = max(max_len, right - left + 1)
    print(max_len)
if __name__ == '__main__':
    main()`,
  },
  "minimum-window-substring": {
    language: "python",
    code: `import sys
from collections import Counter
def main():
    data = sys.stdin.read().split()
    if len(data) < 2: return
    s, t = data[0], data[1]
    if not t or not s:
        print("")
        return
    t_count = Counter(t)
    required = len(t_count)
    window_count = {}
    formed = 0
    l, r = 0, 0
    ans = float("inf"), None, None
    while r < len(s):
        c = s[r]
        window_count[c] = window_count.get(c, 0) + 1
        if c in t_count and window_count[c] == t_count[c]:
            formed += 1
        while l <= r and formed == required:
            if r - l + 1 < ans[0]:
                ans = (r - l + 1, l, r)
            c = s[l]
            window_count[c] -= 1
            if c in t_count and window_count[c] < t_count[c]:
                formed -= 1
            l += 1
        r += 1
    print("" if ans[0] == float("inf") else s[ans[1]:ans[2]+1])
if __name__ == '__main__':
    main()`,
  },
};

async function runTests() {
  console.log("Testing all 8 Two Pointers & Sliding Window problems against Piston execution:\n");
  let allPassed = true;

  for (const prob of twoPointersProblems) {
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
    console.log("\n🎉 ALL 8 TWO POINTERS PROBLEMS PASSED SUCCESSFULLY!");
    process.exit(0);
  } else {
    console.error("\n❌ Some tests failed.");
    process.exit(1);
  }
}

runTests();
