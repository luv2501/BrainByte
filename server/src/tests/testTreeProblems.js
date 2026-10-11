import dotenv from "dotenv";
dotenv.config();

import { evaluateSubmission } from "../services/pistonService.js";
import { treesGraphsProblems } from "../data/categories/treesGraphs.js";

const solutions = {
  "invert-binary-tree": {
    language: "python",
    code: `import sys
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = TreeNode(int(tokens[0]))
    q = deque([root])
    i = 1
    while q and i < len(tokens):
        curr = q.popleft()
        if i < len(tokens) and tokens[i] != "null":
            curr.left = TreeNode(int(tokens[i]))
            q.append(curr.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            curr.right = TreeNode(int(tokens[i]))
            q.append(curr.right)
        i += 1
    return root

def print_tree_bfs(root):
    if not root:
        return
    q = deque([root])
    res = []
    while q:
        curr = q.popleft()
        res.append(str(curr.val))
        if curr.left:
            q.append(curr.left)
        if curr.right:
            q.append(curr.right)
    print(" ".join(res))

def invert_tree(root):
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    tokens = input_data[1:n+1]
    root = build_tree(tokens)
    inverted = invert_tree(root)
    print_tree_bfs(inverted)

if __name__ == "__main__":
    main()`,
  },
  "maximum-depth-of-binary-tree": {
    language: "python",
    code: `import sys
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = TreeNode(int(tokens[0]))
    q = deque([root])
    i = 1
    while q and i < len(tokens):
        curr = q.popleft()
        if i < len(tokens) and tokens[i] != "null":
            curr.left = TreeNode(int(tokens[i]))
            q.append(curr.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            curr.right = TreeNode(int(tokens[i]))
            q.append(curr.right)
        i += 1
    return root

def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    tokens = input_data[1:n+1]
    root = build_tree(tokens)
    print(max_depth(root))

if __name__ == "__main__":
    main()`,
  },
  "same-tree": {
    language: "python",
    code: `import sys
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = TreeNode(int(tokens[0]))
    q = deque([root])
    i = 1
    while q and i < len(tokens):
        curr = q.popleft()
        if i < len(tokens) and tokens[i] != "null":
            curr.left = TreeNode(int(tokens[i]))
            q.append(curr.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            curr.right = TreeNode(int(tokens[i]))
            q.append(curr.right)
        i += 1
    return root

def is_same_tree(p, q):
    if not p and not q:
        return True
    if not p or not q or p.val != q.val:
        return False
    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    idx = 0
    n1 = int(input_data[idx]); idx += 1
    t1 = input_data[idx:idx+n1]; idx += n1
    n2 = int(input_data[idx]); idx += 1
    t2 = input_data[idx:idx+n2]; idx += n2
    p = build_tree(t1)
    q = build_tree(t2)
    print("true" if is_same_tree(p, q) else "false")

if __name__ == "__main__":
    main()`,
  },
  "lowest-common-ancestor-of-a-binary-search-tree": {
    language: "python",
    code: `import sys
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = TreeNode(int(tokens[0]))
    q = deque([root])
    i = 1
    while q and i < len(tokens):
        curr = q.popleft()
        if i < len(tokens) and tokens[i] != "null":
            curr.left = TreeNode(int(tokens[i]))
            q.append(curr.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            curr.right = TreeNode(int(tokens[i]))
            q.append(curr.right)
        i += 1
    return root

def lowest_common_ancestor(root, p_val, q_val):
    curr = root
    while curr:
        if p_val < curr.val and q_val < curr.val:
            curr = curr.left
        elif p_val > curr.val and q_val > curr.val:
            curr = curr.right
        else:
            return curr.val
    return None

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    tokens = input_data[1:n+1]
    p = int(input_data[n+1])
    q = int(input_data[n+2])
    root = build_tree(tokens)
    print(lowest_common_ancestor(root, p, q))

if __name__ == "__main__":
    main()`,
  },
  "binary-tree-level-order-traversal": {
    language: "python",
    code: `import sys
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = TreeNode(int(tokens[0]))
    q = deque([root])
    i = 1
    while q and i < len(tokens):
        curr = q.popleft()
        if i < len(tokens) and tokens[i] != "null":
            curr.left = TreeNode(int(tokens[i]))
            q.append(curr.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            curr.right = TreeNode(int(tokens[i]))
            q.append(curr.right)
        i += 1
    return root

def level_order(root):
    if not root:
        return
    q = deque([root])
    while q:
        level_size = len(q)
        level_vals = []
        for _ in range(level_size):
            curr = q.popleft()
            level_vals.append(str(curr.val))
            if curr.left:
                q.append(curr.left)
            if curr.right:
                q.append(curr.right)
        print(" ".join(level_vals))

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    tokens = input_data[1:n+1]
    root = build_tree(tokens)
    level_order(root)

if __name__ == "__main__":
    main()`,
  },
  "validate-binary-search-tree": {
    language: "python",
    code: `import sys
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = TreeNode(int(tokens[0]))
    q = deque([root])
    i = 1
    while q and i < len(tokens):
        curr = q.popleft()
        if i < len(tokens) and tokens[i] != "null":
            curr.left = TreeNode(int(tokens[i]))
            q.append(curr.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            curr.right = TreeNode(int(tokens[i]))
            q.append(curr.right)
        i += 1
    return root

def is_valid_bst(root, min_val=float('-inf'), max_val=float('inf')):
    if not root:
        return True
    if not (min_val < root.val < max_val):
        return False
    return is_valid_bst(root.left, min_val, root.val) and is_valid_bst(root.right, root.val, max_val)

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    tokens = input_data[1:n+1]
    root = build_tree(tokens)
    print("true" if is_valid_bst(root) else "false")

if __name__ == "__main__":
    main()`,
  },
  "binary-tree-maximum-path-sum": {
    language: "python",
    code: `import sys
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = TreeNode(int(tokens[0]))
    q = deque([root])
    i = 1
    while q and i < len(tokens):
        curr = q.popleft()
        if i < len(tokens) and tokens[i] != "null":
            curr.left = TreeNode(int(tokens[i]))
            q.append(curr.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            curr.right = TreeNode(int(tokens[i]))
            q.append(curr.right)
        i += 1
    return root

def max_path_sum(root):
    max_sum = float('-inf')

    def dfs(node):
        nonlocal max_sum
        if not node:
            return 0
        left_gain = max(0, dfs(node.left))
        right_gain = max(0, dfs(node.right))
        price_newpath = node.val + left_gain + right_gain
        max_sum = max(max_sum, price_newpath)
        return node.val + max(left_gain, right_gain)

    dfs(root)
    return max_sum

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    tokens = input_data[1:n+1]
    root = build_tree(tokens)
    print(max_path_sum(root))

if __name__ == "__main__":
    main()`,
  },
};

async function runTests() {
  console.log("🌲 Starting Tree Problems Verification against Piston...\n");

  let totalPassed = 0;
  let totalProblems = 0;

  for (const [slug, sol] of Object.entries(solutions)) {
    totalProblems++;
    const problem = treesGraphsProblems.find((p) => p.slug === slug);
    if (!problem) {
      console.error(`❌ Problem not found: ${slug}`);
      continue;
    }

    console.log(`Testing: ${problem.title} (${slug})`);
    try {
      const result = await evaluateSubmission(
        sol.code,
        sol.language,
        problem.testCases
      );

      if (result.verdict === "Accepted") {
        console.log(`  ✅ Passed (${result.passedTests}/${result.totalTests} test cases)`);
        totalPassed++;
      } else {
        console.log(`  ❌ Failed: ${result.verdict}`);
        console.log(`     Passed: ${result.passedTests}/${result.totalTests}`);
        if (result.results) {
          result.results.forEach((tc, idx) => {
            if (!tc.passed) {
              console.log(`     Case ${idx + 1}: ${tc.status}`);
              console.log(`       Input: ${JSON.stringify(tc.input)}`);
              console.log(`       Expected: ${JSON.stringify(tc.expectedOutput)}`);
              console.log(`       Actual: ${JSON.stringify(tc.actualOutput)}`);
              console.log(`       Error: ${tc.stderr || tc.compile_output || "none"}`);
            }
          });
        }
      }
    } catch (err) {
      console.error(`  💥 Exception: ${err.message}`);
    }
    console.log("");
  }

  console.log(`========================================`);
  console.log(`Tree Problems Result: ${totalPassed}/${totalProblems} Accepted`);
  console.log(`========================================`);

  if (totalPassed === totalProblems) {
    console.log("🎉 All Tree problems successfully converted and verified!");
    process.exit(0);
  } else {
    console.error("❌ Some Tree problems failed verification.");
    process.exit(1);
  }
}

runTests();
