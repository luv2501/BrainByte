/**
 * Trees & Graphs Problem Collection
 */

export const treesGraphsProblems = [
  {
    title: "Invert Binary Tree",
    slug: "invert-binary-tree",
    difficulty: "Easy",
    tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    description: `Given the \`root\` of a binary tree, invert the tree, and return *its root*.`,
    constraints: [
      "The number of nodes in the tree is in the range [1, 100].",
      "-100 <= Node.val <= 100",
    ],
    examples: [
      {
        input: "root = [4,2,7,1,3,6,9]",
        output: "[4,7,2,9,6,3,1]",
        explanation: "Left and right subtrees of all nodes are swapped.",
      },
      {
        input: "root = [2,1,3]",
        output: "[2,3,1]",
        explanation: "Children 1 and 3 are inverted.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <queue>\n\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nTreeNode* buildTree(const vector<string>& tokens) {\n    if (tokens.empty() || tokens[0] == "null") return nullptr;\n    TreeNode *root = new TreeNode(stoi(tokens[0]));\n    queue<TreeNode*> q;\n    q.push(root);\n    size_t i = 1;\n    while (!q.empty() && i < tokens.size()) {\n        TreeNode *curr = q.front();\n        q.pop();\n        if (i < tokens.size() && tokens[i] != "null") {\n            curr->left = new TreeNode(stoi(tokens[i]));\n            q.push(curr->left);\n        }\n        i++;\n        if (i < tokens.size() && tokens[i] != "null") {\n            curr->right = new TreeNode(stoi(tokens[i]));\n            q.push(curr->right);\n        }\n        i++;\n    }\n    return root;\n}\n\nvoid printTreeBFS(TreeNode *root) {\n    if (!root) return;\n    queue<TreeNode*> q;\n    q.push(root);\n    bool first = true;\n    while (!q.empty()) {\n        TreeNode *curr = q.front();\n        q.pop();\n        if (!first) cout << " ";\n        cout << curr->val;\n        first = false;\n        if (curr->left) q.push(curr->left);\n        if (curr->right) q.push(curr->right);\n    }\n    cout << endl;\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<string> tokens(n);\n        for (int i = 0; i < n; i++) cin >> tokens[i];\n        TreeNode *root = buildTree(tokens);\n        // Invert the binary tree rooted at root and print using printTreeBFS()\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nstruct TreeNode {\n    int val;\n    struct TreeNode *left;\n    struct TreeNode *right;\n};\n\nstruct TreeNode* createNode(int val) {\n    struct TreeNode *node = (struct TreeNode *)malloc(sizeof(struct TreeNode));\n    node->val = val;\n    node->left = NULL;\n    node->right = NULL;\n    return node;\n}\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        // Build and invert binary tree\n    }\n    return 0;\n}`,
      python: `import sys\nfrom collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef build_tree(tokens):\n    if not tokens or tokens[0] == "null":\n        return None\n    root = TreeNode(int(tokens[0]))\n    q = deque([root])\n    i = 1\n    while q and i < len(tokens):\n        curr = q.popleft()\n        if i < len(tokens) and tokens[i] != "null":\n            curr.left = TreeNode(int(tokens[i]))\n            q.append(curr.left)\n        i += 1\n        if i < len(tokens) and tokens[i] != "null":\n            curr.right = TreeNode(int(tokens[i]))\n            q.append(curr.right)\n        i += 1\n    return root\n\ndef print_tree_bfs(root):\n    if not root:\n        return\n    q = deque([root])\n    res = []\n    while q:\n        curr = q.popleft()\n        res.append(str(curr.val))\n        if curr.left:\n            q.append(curr.left)\n        if curr.right:\n            q.append(curr.right)\n    print(" ".join(res))\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    tokens = input_data[1:n+1]\n    root = build_tree(tokens)\n    # Invert the binary tree rooted at root and print using print_tree_bfs()\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nclass TreeNode {\n    constructor(val = 0, left = null, right = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nfunction buildTree(tokens) {\n    if (!tokens || tokens.length === 0 || tokens[0] === "null") return null;\n    const root = new TreeNode(parseInt(tokens[0], 10));\n    const q = [root];\n    let i = 1;\n    while (q.length > 0 && i < tokens.length) {\n        const curr = q.shift();\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.left = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.left);\n        }\n        i++;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.right = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.right);\n        }\n        i++;\n    }\n    return root;\n}\n\nfunction printTreeBFS(root) {\n    if (!root) return;\n    const q = [root];\n    const res = [];\n    while (q.length > 0) {\n        const curr = q.shift();\n        res.push(curr.val);\n        if (curr.left) q.push(curr.left);\n        if (curr.right) q.push(curr.right);\n    }\n    console.log(res.join(" "));\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const tokens = input.slice(1, n + 1);\n    const root = buildTree(tokens);\n    // Invert the binary tree rooted at root and print using printTreeBFS()\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nclass TreeNode {\n    val: number;\n    left: TreeNode | null;\n    right: TreeNode | null;\n    constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nfunction buildTree(tokens: string[]): TreeNode | null {\n    if (!tokens || tokens.length === 0 || tokens[0] === "null") return null;\n    const root = new TreeNode(parseInt(tokens[0], 10));\n    const q: TreeNode[] = [root];\n    let i = 1;\n    while (q.length > 0 && i < tokens.length) {\n        const curr = q.shift()!;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.left = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.left);\n        }\n        i++;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.right = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.right);\n        }\n        i++;\n    }\n    return root;\n}\n\nfunction printTreeBFS(root: TreeNode | null): void {\n    if (!root) return;\n    const q: TreeNode[] = [root];\n    const res: number[] = [];\n    while (q.length > 0) {\n        const curr = q.shift()!;\n        res.push(curr.val);\n        if (curr.left) q.push(curr.left);\n        if (curr.right) q.push(curr.right);\n    }\n    console.log(res.join(" "));\n}\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const tokens = input.slice(1, n + 1);\n    const root = buildTree(tokens);\n    // Invert the binary tree rooted at root and print using printTreeBFS()\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    static class TreeNode {\n        int val;\n        TreeNode left;\n        TreeNode right;\n        TreeNode(int val) { this.val = val; }\n    }\n\n    static TreeNode buildTree(String[] tokens) {\n        if (tokens == null || tokens.length == 0 || tokens[0].equals("null")) return null;\n        TreeNode root = new TreeNode(Integer.parseInt(tokens[0]));\n        Queue<TreeNode> q = new LinkedList<>();\n        q.offer(root);\n        int i = 1;\n        while (!q.isEmpty() && i < tokens.length) {\n            TreeNode curr = q.poll();\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                curr.left = new TreeNode(Integer.parseInt(tokens[i]));\n                q.offer(curr.left);\n            }\n            i++;\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                curr.right = new TreeNode(Integer.parseInt(tokens[i]));\n                q.offer(curr.right);\n            }\n            i++;\n        }\n        return root;\n    }\n\n    static void printTreeBFS(TreeNode root) {\n        if (root == null) return;\n        Queue<TreeNode> q = new LinkedList<>();\n        q.offer(root);\n        StringBuilder sb = new StringBuilder();\n        while (!q.isEmpty()) {\n            TreeNode curr = q.poll();\n            if (sb.length() > 0) sb.append(" ");\n            sb.append(curr.val);\n            if (curr.left != null) q.offer(curr.left);\n            if (curr.right != null) q.offer(curr.right);\n        }\n        System.out.println(sb.toString());\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            String[] tokens = new String[n];\n            for (int i = 0; i < n; i++) tokens[i] = scanner.next();\n            TreeNode root = buildTree(tokens);\n            // Invert the binary tree rooted at root and print using printTreeBFS()\n        }\n    }\n}`,
    },
    testCases: [
      { input: "7\n4 2 7 1 3 6 9", expectedOutput: "4 7 2 9 6 3 1", isHidden: false },
      { input: "3\n2 1 3", expectedOutput: "2 3 1", isHidden: false },
      { input: "1\n1", expectedOutput: "1", isHidden: true },
      { input: "3\n1 2 3", expectedOutput: "1 3 2", isHidden: true },
    ],
    hints: [
      "Recursively swap root.left and root.right.",
    ],
  },
  {
    title: "Maximum Depth of Binary Tree",
    slug: "maximum-depth-of-binary-tree",
    difficulty: "Easy",
    tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    description: `Given the \`root\` of a binary tree, return *its maximum depth*.

A binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    constraints: [
      "The number of nodes in the tree is in the range [1, 10^4].",
      "-100 <= Node.val <= 100",
    ],
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "3",
        explanation: "The longest path is 3 -> 20 -> 15 with depth 3.",
      },
      {
        input: "root = [1,null,2]",
        output: "2",
        explanation: "Path is 1 -> 2 with depth 2.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <queue>\n#include <algorithm>\n\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nTreeNode* buildTree(const vector<string>& tokens) {\n    if (tokens.empty() || tokens[0] == "null") return nullptr;\n    TreeNode *root = new TreeNode(stoi(tokens[0]));\n    queue<TreeNode*> q;\n    q.push(root);\n    size_t i = 1;\n    while (!q.empty() && i < tokens.size()) {\n        TreeNode *curr = q.front();\n        q.pop();\n        if (i < tokens.size() && tokens[i] != "null") {\n            curr->left = new TreeNode(stoi(tokens[i]));\n            q.push(curr->left);\n        }\n        i++;\n        if (i < tokens.size() && tokens[i] != "null") {\n            curr->right = new TreeNode(stoi(tokens[i]));\n            q.push(curr->right);\n        }\n        i++;\n    }\n    return root;\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<string> tokens(n);\n        for (int i = 0; i < n; i++) cin >> tokens[i];\n        TreeNode *root = buildTree(tokens);\n        // Compute maximum depth of binary tree and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        // Compute maximum depth\n    }\n    return 0;\n}`,
      python: `import sys\nfrom collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef build_tree(tokens):\n    if not tokens or tokens[0] == "null":\n        return None\n    root = TreeNode(int(tokens[0]))\n    q = deque([root])\n    i = 1\n    while q and i < len(tokens):\n        curr = q.popleft()\n        if i < len(tokens) and tokens[i] != "null":\n            curr.left = TreeNode(int(tokens[i]))\n            q.append(curr.left)\n        i += 1\n        if i < len(tokens) and tokens[i] != "null":\n            curr.right = TreeNode(int(tokens[i]))\n            q.append(curr.right)\n        i += 1\n    return root\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    tokens = input_data[1:n+1]\n    root = build_tree(tokens)\n    # Compute maximum depth of binary tree and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nclass TreeNode {\n    constructor(val = 0, left = null, right = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nfunction buildTree(tokens) {\n    if (!tokens || tokens.length === 0 || tokens[0] === "null") return null;\n    const root = new TreeNode(parseInt(tokens[0], 10));\n    const q = [root];\n    let i = 1;\n    while (q.length > 0 && i < tokens.length) {\n        const curr = q.shift();\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.left = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.left);\n        }\n        i++;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.right = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.right);\n        }\n        i++;\n    }\n    return root;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const tokens = input.slice(1, n + 1);\n    const root = buildTree(tokens);\n    // Compute maximum depth of binary tree and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nclass TreeNode {\n    val: number;\n    left: TreeNode | null;\n    right: TreeNode | null;\n    constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nfunction buildTree(tokens: string[]): TreeNode | null {\n    if (!tokens || tokens.length === 0 || tokens[0] === "null") return null;\n    const root = new TreeNode(parseInt(tokens[0], 10));\n    const q: TreeNode[] = [root];\n    let i = 1;\n    while (q.length > 0 && i < tokens.length) {\n        const curr = q.shift()!;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.left = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.left);\n        }\n        i++;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.right = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.right);\n        }\n        i++;\n    }\n    return root;\n}\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const tokens = input.slice(1, n + 1);\n    const root = buildTree(tokens);\n    // Compute maximum depth of binary tree and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    static class TreeNode {\n        int val;\n        TreeNode left;\n        TreeNode right;\n        TreeNode(int val) { this.val = val; }\n    }\n\n    static TreeNode buildTree(String[] tokens) {\n        if (tokens == null || tokens.length == 0 || tokens[0].equals("null")) return null;\n        TreeNode root = new TreeNode(Integer.parseInt(tokens[0]));\n        Queue<TreeNode> q = new LinkedList<>();\n        q.offer(root);\n        int i = 1;\n        while (!q.isEmpty() && i < tokens.length) {\n            TreeNode curr = q.poll();\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                curr.left = new TreeNode(Integer.parseInt(tokens[i]));\n                q.offer(curr.left);\n            }\n            i++;\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                curr.right = new TreeNode(Integer.parseInt(tokens[i]));\n                q.offer(curr.right);\n            }\n            i++;\n        }\n        return root;\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            String[] tokens = new String[n];\n            for (int i = 0; i < n; i++) tokens[i] = scanner.next();\n            TreeNode root = buildTree(tokens);\n            // Compute maximum depth of binary tree and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "7\n3 9 20 null null 15 7", expectedOutput: "3", isHidden: false },
      { input: "3\n1 null 2", expectedOutput: "2", isHidden: false },
      { input: "1\n1", expectedOutput: "1", isHidden: true },
      { input: "5\n1 2 3 4 5", expectedOutput: "3", isHidden: true },
    ],
    hints: [
      "maxDepth(root) = 1 + max(maxDepth(root.left), maxDepth(root.right)).",
    ],
  },
  {
    title: "Same Tree",
    slug: "same-tree",
    difficulty: "Easy",
    tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    description: `Given the roots of two binary trees \`p\` and \`q\`, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.`,
    constraints: [
      "The number of nodes in both trees is in the range [1, 100].",
      "-10^4 <= Node.val <= 10^4",
    ],
    examples: [
      {
        input: "p = [1,2,3], q = [1,2,3]",
        output: "true",
        explanation: "Both trees are identical.",
      },
      {
        input: "p = [1,2], q = [1,null,2]",
        output: "false",
        explanation: "Trees have different structure.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <queue>\n\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nTreeNode* buildTree(const vector<string>& tokens) {\n    if (tokens.empty() || tokens[0] == "null") return nullptr;\n    TreeNode *root = new TreeNode(stoi(tokens[0]));\n    queue<TreeNode*> q;\n    q.push(root);\n    size_t i = 1;\n    while (!q.empty() && i < tokens.size()) {\n        TreeNode *curr = q.front();\n        q.pop();\n        if (i < tokens.size() && tokens[i] != "null") {\n            curr->left = new TreeNode(stoi(tokens[i]));\n            q.push(curr->left);\n        }\n        i++;\n        if (i < tokens.size() && tokens[i] != "null") {\n            curr->right = new TreeNode(stoi(tokens[i]));\n            q.push(curr->right);\n        }\n        i++;\n    }\n    return root;\n}\n\nint main() {\n    int n1;\n    if (cin >> n1) {\n        vector<string> t1(n1);\n        for (int i = 0; i < n1; i++) cin >> t1[i];\n        int n2;\n        cin >> n2;\n        vector<string> t2(n2);\n        for (int i = 0; i < n2; i++) cin >> t2[i];\n        TreeNode *p = buildTree(t1);\n        TreeNode *q = buildTree(t2);\n        // Check if trees p and q are structurally identical and print "true" or "false"\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n1;\n    if (scanf("%d", &n1) == 1) {\n        // Determine if trees are identical\n    }\n    return 0;\n}`,
      python: `import sys\nfrom collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef build_tree(tokens):\n    if not tokens or tokens[0] == "null":\n        return None\n    root = TreeNode(int(tokens[0]))\n    q = deque([root])\n    i = 1\n    while q and i < len(tokens):\n        curr = q.popleft()\n        if i < len(tokens) and tokens[i] != "null":\n            curr.left = TreeNode(int(tokens[i]))\n            q.append(curr.left)\n        i += 1\n        if i < len(tokens) and tokens[i] != "null":\n            curr.right = TreeNode(int(tokens[i]))\n            q.append(curr.right)\n        i += 1\n    return root\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    idx = 0\n    n1 = int(input_data[idx]); idx += 1\n    t1 = input_data[idx:idx+n1]; idx += n1\n    n2 = int(input_data[idx]); idx += 1\n    t2 = input_data[idx:idx+n2]; idx += n2\n    p = build_tree(t1)\n    q = build_tree(t2)\n    # Check if trees p and q are identical and print "true" or "false"\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nclass TreeNode {\n    constructor(val = 0, left = null, right = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nfunction buildTree(tokens) {\n    if (!tokens || tokens.length === 0 || tokens[0] === "null") return null;\n    const root = new TreeNode(parseInt(tokens[0], 10));\n    const q = [root];\n    let i = 1;\n    while (q.length > 0 && i < tokens.length) {\n        const curr = q.shift();\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.left = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.left);\n        }\n        i++;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.right = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.right);\n        }\n        i++;\n    }\n    return root;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    let idx = 0;\n    const n1 = parseInt(input[idx++], 10);\n    const t1 = input.slice(idx, idx + n1); idx += n1;\n    const n2 = parseInt(input[idx++], 10);\n    const t2 = input.slice(idx, idx + n2); idx += n2;\n    const p = buildTree(t1);\n    const q = buildTree(t2);\n    // Check if trees p and q are identical and print "true" or "false"\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nclass TreeNode {\n    val: number;\n    left: TreeNode | null;\n    right: TreeNode | null;\n    constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nfunction buildTree(tokens: string[]): TreeNode | null {\n    if (!tokens || tokens.length === 0 || tokens[0] === "null") return null;\n    const root = new TreeNode(parseInt(tokens[0], 10));\n    const q: TreeNode[] = [root];\n    let i = 1;\n    while (q.length > 0 && i < tokens.length) {\n        const curr = q.shift()!;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.left = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.left);\n        }\n        i++;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.right = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.right);\n        }\n        i++;\n    }\n    return root;\n}\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    let idx = 0;\n    const n1 = parseInt(input[idx++], 10);\n    const t1 = input.slice(idx, idx + n1); idx += n1;\n    const n2 = parseInt(input[idx++], 10);\n    const t2 = input.slice(idx, idx + n2); idx += n2;\n    const p = buildTree(t1);\n    const q = buildTree(t2);\n    // Check if trees p and q are identical and print "true" or "false"\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    static class TreeNode {\n        int val;\n        TreeNode left;\n        TreeNode right;\n        TreeNode(int val) { this.val = val; }\n    }\n\n    static TreeNode buildTree(String[] tokens) {\n        if (tokens == null || tokens.length == 0 || tokens[0].equals("null")) return null;\n        TreeNode root = new TreeNode(Integer.parseInt(tokens[0]));\n        Queue<TreeNode> q = new LinkedList<>();\n        q.offer(root);\n        int i = 1;\n        while (!q.isEmpty() && i < tokens.length) {\n            TreeNode curr = q.poll();\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                curr.left = new TreeNode(Integer.parseInt(tokens[i]));\n                q.offer(curr.left);\n            }\n            i++;\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                curr.right = new TreeNode(Integer.parseInt(tokens[i]));\n                q.offer(curr.right);\n            }\n            i++;\n        }\n        return root;\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n1 = scanner.nextInt();\n            String[] t1 = new String[n1];\n            for (int i = 0; i < n1; i++) t1[i] = scanner.next();\n            int n2 = scanner.nextInt();\n            String[] t2 = new String[n2];\n            for (int i = 0; i < n2; i++) t2[i] = scanner.next();\n            TreeNode p = buildTree(t1);\n            TreeNode q = buildTree(t2);\n            // Check if trees p and q are identical and print "true" or "false"\n        }\n    }\n}`,
    },
    testCases: [
      { input: "3\n1 2 3\n3\n1 2 3", expectedOutput: "true", isHidden: false },
      { input: "2\n1 2\n3\n1 null 2", expectedOutput: "false", isHidden: false },
      { input: "3\n1 2 1\n3\n1 1 2", expectedOutput: "false", isHidden: true },
      { input: "1\n1\n1\n1", expectedOutput: "true", isHidden: true },
    ],
    hints: [
      "Check if both are null (true), one is null (false), or values differ (false), then recurse on children.",
    ],
  },
  {
    title: "Lowest Common Ancestor of a Binary Search Tree",
    slug: "lowest-common-ancestor-of-a-binary-search-tree",
    difficulty: "Medium",
    tags: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"],
    description: `Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.

According to the **definition of LCA on Wikipedia**: "The lowest common ancestor is defined between two nodes \`p\` and \`q\` as the lowest node in \`T\` that has both \`p\` and \`q\` as descendants (where we allow **a node to be a descendant of itself**)."`,
    constraints: [
      "The number of nodes in the tree is in the range [2, 10^5].",
      "-10^9 <= Node.val <= 10^9",
      "All Node.val are unique.",
      "p != q",
      "p and q will exist in the BST.",
    ],
    examples: [
      {
        input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8",
        output: "6",
        explanation: "The LCA of nodes 2 and 8 is 6.",
      },
      {
        input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4",
        output: "2",
        explanation: "The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <queue>\n\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nTreeNode* buildTree(const vector<string>& tokens) {\n    if (tokens.empty() || tokens[0] == "null") return nullptr;\n    TreeNode *root = new TreeNode(stoi(tokens[0]));\n    queue<TreeNode*> q;\n    q.push(root);\n    size_t i = 1;\n    while (!q.empty() && i < tokens.size()) {\n        TreeNode *curr = q.front();\n        q.pop();\n        if (i < tokens.size() && tokens[i] != "null") {\n            curr->left = new TreeNode(stoi(tokens[i]));\n            q.push(curr->left);\n        }\n        i++;\n        if (i < tokens.size() && tokens[i] != "null") {\n            curr->right = new TreeNode(stoi(tokens[i]));\n            q.push(curr->right);\n        }\n        i++;\n    }\n    return root;\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<string> tokens(n);\n        for (int i = 0; i < n; i++) cin >> tokens[i];\n        int p, q;\n        cin >> p >> q;\n        TreeNode *root = buildTree(tokens);\n        // Find lowest common ancestor value of p and q in BST and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        // Find LCA in BST\n    }\n    return 0;\n}`,
      python: `import sys\nfrom collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef build_tree(tokens):\n    if not tokens or tokens[0] == "null":\n        return None\n    root = TreeNode(int(tokens[0]))\n    q = deque([root])\n    i = 1\n    while q and i < len(tokens):\n        curr = q.popleft()\n        if i < len(tokens) and tokens[i] != "null":\n            curr.left = TreeNode(int(tokens[i]))\n            q.append(curr.left)\n        i += 1\n        if i < len(tokens) and tokens[i] != "null":\n            curr.right = TreeNode(int(tokens[i]))\n            q.append(curr.right)\n        i += 1\n    return root\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    tokens = input_data[1:n+1]\n    p = int(input_data[n+1])\n    q = int(input_data[n+2])\n    root = build_tree(tokens)\n    # Find lowest common ancestor value of p and q in BST and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nclass TreeNode {\n    constructor(val = 0, left = null, right = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nfunction buildTree(tokens) {\n    if (!tokens || tokens.length === 0 || tokens[0] === "null") return null;\n    const root = new TreeNode(parseInt(tokens[0], 10));\n    const q = [root];\n    let i = 1;\n    while (q.length > 0 && i < tokens.length) {\n        const curr = q.shift();\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.left = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.left);\n        }\n        i++;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.right = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.right);\n        }\n        i++;\n    }\n    return root;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const tokens = input.slice(1, n + 1);\n    const p = parseInt(input[n + 1], 10);\n    const q = parseInt(input[n + 2], 10);\n    const root = buildTree(tokens);\n    // Find lowest common ancestor value of p and q in BST and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nclass TreeNode {\n    val: number;\n    left: TreeNode | null;\n    right: TreeNode | null;\n    constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nfunction buildTree(tokens: string[]): TreeNode | null {\n    if (!tokens || tokens.length === 0 || tokens[0] === "null") return null;\n    const root = new TreeNode(parseInt(tokens[0], 10));\n    const q: TreeNode[] = [root];\n    let i = 1;\n    while (q.length > 0 && i < tokens.length) {\n        const curr = q.shift()!;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.left = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.left);\n        }\n        i++;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.right = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.right);\n        }\n        i++;\n    }\n    return root;\n}\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const tokens = input.slice(1, n + 1);\n    const p = parseInt(input[n + 1], 10);\n    const q = parseInt(input[n + 2], 10);\n    const root = buildTree(tokens);\n    // Find lowest common ancestor value of p and q in BST and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    static class TreeNode {\n        int val;\n        TreeNode left;\n        TreeNode right;\n        TreeNode(int val) { this.val = val; }\n    }\n\n    static TreeNode buildTree(String[] tokens) {\n        if (tokens == null || tokens.length == 0 || tokens[0].equals("null")) return null;\n        TreeNode root = new TreeNode(Integer.parseInt(tokens[0]));\n        Queue<TreeNode> q = new LinkedList<>();\n        q.offer(root);\n        int i = 1;\n        while (!q.isEmpty() && i < tokens.length) {\n            TreeNode curr = q.poll();\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                curr.left = new TreeNode(Integer.parseInt(tokens[i]));\n                q.offer(curr.left);\n            }\n            i++;\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                curr.right = new TreeNode(Integer.parseInt(tokens[i]));\n                q.offer(curr.right);\n            }\n            i++;\n        }\n        return root;\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            String[] tokens = new String[n];\n            for (int i = 0; i < n; i++) tokens[i] = scanner.next();\n            int p = scanner.nextInt();\n            int q = scanner.nextInt();\n            TreeNode root = buildTree(tokens);\n            // Find lowest common ancestor value of p and q in BST and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "11\n6 2 8 0 4 7 9 null null 3 5\n2\n8", expectedOutput: "6", isHidden: false },
      { input: "11\n6 2 8 0 4 7 9 null null 3 5\n2\n4", expectedOutput: "2", isHidden: false },
      { input: "2\n2 1\n2\n1", expectedOutput: "2", isHidden: true },
      { input: "7\n5 3 6 2 4 null null\n2\n4", expectedOutput: "3", isHidden: true },
    ],
    hints: [
      "Utilize the BST property: if both p and q are smaller than root, go left; if both are larger, go right; otherwise root is the split point (LCA).",
    ],
  },
  {
    title: "Binary Tree Level Order Traversal",
    slug: "binary-tree-level-order-traversal",
    difficulty: "Medium",
    tags: ["Tree", "Breadth-First Search", "Binary Tree"],
    description: `Given the \`root\` of a binary tree, return *the level order traversal of its nodes' values*. (i.e., from left to right, level by level).`,
    constraints: [
      "The number of nodes in the tree is in the range [1, 2000].",
      "-1000 <= Node.val <= 1000",
    ],
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
        explanation: "Level 1: [3], Level 2: [9,20], Level 3: [15,7].",
      },
      {
        input: "root = [1]",
        output: "[[1]]",
        explanation: "Single node tree.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <queue>\n\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nTreeNode* buildTree(const vector<string>& tokens) {\n    if (tokens.empty() || tokens[0] == "null") return nullptr;\n    TreeNode *root = new TreeNode(stoi(tokens[0]));\n    queue<TreeNode*> q;\n    q.push(root);\n    size_t i = 1;\n    while (!q.empty() && i < tokens.size()) {\n        TreeNode *curr = q.front();\n        q.pop();\n        if (i < tokens.size() && tokens[i] != "null") {\n            curr->left = new TreeNode(stoi(tokens[i]));\n            q.push(curr->left);\n        }\n        i++;\n        if (i < tokens.size() && tokens[i] != "null") {\n            curr->right = new TreeNode(stoi(tokens[i]));\n            q.push(curr->right);\n        }\n        i++;\n    }\n    return root;\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<string> tokens(n);\n        for (int i = 0; i < n; i++) cin >> tokens[i];\n        TreeNode *root = buildTree(tokens);\n        // Traverse tree level by level and print each level on a new line\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        // Print level order traversal\n    }\n    return 0;\n}`,
      python: `import sys\nfrom collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef build_tree(tokens):\n    if not tokens or tokens[0] == "null":\n        return None\n    root = TreeNode(int(tokens[0]))\n    q = deque([root])\n    i = 1\n    while q and i < len(tokens):\n        curr = q.popleft()\n        if i < len(tokens) and tokens[i] != "null":\n            curr.left = TreeNode(int(tokens[i]))\n            q.append(curr.left)\n        i += 1\n        if i < len(tokens) and tokens[i] != "null":\n            curr.right = TreeNode(int(tokens[i]))\n            q.append(curr.right)\n        i += 1\n    return root\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    tokens = input_data[1:n+1]\n    root = build_tree(tokens)\n    # Traverse tree level by level and print each level on a new line\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nclass TreeNode {\n    constructor(val = 0, left = null, right = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nfunction buildTree(tokens) {\n    if (!tokens || tokens.length === 0 || tokens[0] === "null") return null;\n    const root = new TreeNode(parseInt(tokens[0], 10));\n    const q = [root];\n    let i = 1;\n    while (q.length > 0 && i < tokens.length) {\n        const curr = q.shift();\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.left = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.left);\n        }\n        i++;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.right = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.right);\n        }\n        i++;\n    }\n    return root;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const tokens = input.slice(1, n + 1);\n    const root = buildTree(tokens);\n    // Traverse tree level by level and print each level on a new line\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nclass TreeNode {\n    val: number;\n    left: TreeNode | null;\n    right: TreeNode | null;\n    constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nfunction buildTree(tokens: string[]): TreeNode | null {\n    if (!tokens || tokens.length === 0 || tokens[0] === "null") return null;\n    const root = new TreeNode(parseInt(tokens[0], 10));\n    const q: TreeNode[] = [root];\n    let i = 1;\n    while (q.length > 0 && i < tokens.length) {\n        const curr = q.shift()!;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.left = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.left);\n        }\n        i++;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.right = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.right);\n        }\n        i++;\n    }\n    return root;\n}\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const tokens = input.slice(1, n + 1);\n    const root = buildTree(tokens);\n    // Traverse tree level by level and print each level on a new line\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    static class TreeNode {\n        int val;\n        TreeNode left;\n        TreeNode right;\n        TreeNode(int val) { this.val = val; }\n    }\n\n    static TreeNode buildTree(String[] tokens) {\n        if (tokens == null || tokens.length == 0 || tokens[0].equals("null")) return null;\n        TreeNode root = new TreeNode(Integer.parseInt(tokens[0]));\n        Queue<TreeNode> q = new LinkedList<>();\n        q.offer(root);\n        int i = 1;\n        while (!q.isEmpty() && i < tokens.length) {\n            TreeNode curr = q.poll();\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                curr.left = new TreeNode(Integer.parseInt(tokens[i]));\n                q.offer(curr.left);\n            }\n            i++;\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                curr.right = new TreeNode(Integer.parseInt(tokens[i]));\n                q.offer(curr.right);\n            }\n            i++;\n        }\n        return root;\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            String[] tokens = new String[n];\n            for (int i = 0; i < n; i++) tokens[i] = scanner.next();\n            TreeNode root = buildTree(tokens);\n            // Traverse tree level by level and print each level on a new line\n        }\n    }\n}`,
    },
    testCases: [
      { input: "7\n3 9 20 null null 15 7", expectedOutput: "3\n9 20\n15 7", isHidden: false },
      { input: "1\n1", expectedOutput: "1", isHidden: false },
      { input: "5\n1 2 3 4 5", expectedOutput: "1\n2 3\n4 5", isHidden: true },
      { input: "3\n1 null 2", expectedOutput: "1\n2", isHidden: true },
    ],
    hints: [
      "Use a queue to process level by level, noting the queue size at each level start.",
    ],
  },
  {
    title: "Validate Binary Search Tree",
    slug: "validate-binary-search-tree",
    difficulty: "Medium",
    tags: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"],
    description: `Given the \`root\` of a binary tree, *determine if it is a valid binary search tree (BST)*.

A **valid BST** is defined as follows:
- The left subtree of a node contains only nodes with keys **less than** the node's key.
- The right subtree of a node contains only nodes with keys **greater than** the node's key.
- Both the left and right subtrees must also be binary search trees.`,
    constraints: [
      "The number of nodes in the tree is in the range [1, 10^4].",
      "-2^31 <= Node.val <= 2^31 - 1",
    ],
    examples: [
      {
        input: "root = [2,1,3]",
        output: "true",
        explanation: "Valid BST: left 1 < 2 < right 3.",
      },
      {
        input: "root = [5,1,4,null,null,3,6]",
        output: "false",
        explanation: "The root node's value is 5 but its right child's value is 4.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <queue>\n\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nTreeNode* buildTree(const vector<string>& tokens) {\n    if (tokens.empty() || tokens[0] == "null") return nullptr;\n    TreeNode *root = new TreeNode(stoi(tokens[0]));\n    queue<TreeNode*> q;\n    q.push(root);\n    size_t i = 1;\n    while (!q.empty() && i < tokens.size()) {\n        TreeNode *curr = q.front();\n        q.pop();\n        if (i < tokens.size() && tokens[i] != "null") {\n            curr->left = new TreeNode(stoi(tokens[i]));\n            q.push(curr->left);\n        }\n        i++;\n        if (i < tokens.size() && tokens[i] != "null") {\n            curr->right = new TreeNode(stoi(tokens[i]));\n            q.push(curr->right);\n        }\n        i++;\n    }\n    return root;\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<string> tokens(n);\n        for (int i = 0; i < n; i++) cin >> tokens[i];\n        TreeNode *root = buildTree(tokens);\n        // Check if root is a valid BST and print "true" or "false"\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        // Validate BST\n    }\n    return 0;\n}`,
      python: `import sys\nfrom collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef build_tree(tokens):\n    if not tokens or tokens[0] == "null":\n        return None\n    root = TreeNode(int(tokens[0]))\n    q = deque([root])\n    i = 1\n    while q and i < len(tokens):\n        curr = q.popleft()\n        if i < len(tokens) and tokens[i] != "null":\n            curr.left = TreeNode(int(tokens[i]))\n            q.append(curr.left)\n        i += 1\n        if i < len(tokens) and tokens[i] != "null":\n            curr.right = TreeNode(int(tokens[i]))\n            q.append(curr.right)\n        i += 1\n    return root\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    tokens = input_data[1:n+1]\n    root = build_tree(tokens)\n    # Check if root is a valid BST and print "true" or "false"\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nclass TreeNode {\n    constructor(val = 0, left = null, right = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nfunction buildTree(tokens) {\n    if (!tokens || tokens.length === 0 || tokens[0] === "null") return null;\n    const root = new TreeNode(parseInt(tokens[0], 10));\n    const q = [root];\n    let i = 1;\n    while (q.length > 0 && i < tokens.length) {\n        const curr = q.shift();\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.left = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.left);\n        }\n        i++;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.right = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.right);\n        }\n        i++;\n    }\n    return root;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const tokens = input.slice(1, n + 1);\n    const root = buildTree(tokens);\n    // Check if root is a valid BST and print "true" or "false"\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nclass TreeNode {\n    val: number;\n    left: TreeNode | null;\n    right: TreeNode | null;\n    constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nfunction buildTree(tokens: string[]): TreeNode | null {\n    if (!tokens || tokens.length === 0 || tokens[0] === "null") return null;\n    const root = new TreeNode(parseInt(tokens[0], 10));\n    const q: TreeNode[] = [root];\n    let i = 1;\n    while (q.length > 0 && i < tokens.length) {\n        const curr = q.shift()!;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.left = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.left);\n        }\n        i++;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.right = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.right);\n        }\n        i++;\n    }\n    return root;\n}\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const tokens = input.slice(1, n + 1);\n    const root = buildTree(tokens);\n    // Check if root is a valid BST and print "true" or "false"\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    static class TreeNode {\n        int val;\n        TreeNode left;\n        TreeNode right;\n        TreeNode(int val) { this.val = val; }\n    }\n\n    static TreeNode buildTree(String[] tokens) {\n        if (tokens == null || tokens.length == 0 || tokens[0].equals("null")) return null;\n        TreeNode root = new TreeNode(Integer.parseInt(tokens[0]));\n        Queue<TreeNode> q = new LinkedList<>();\n        q.offer(root);\n        int i = 1;\n        while (!q.isEmpty() && i < tokens.length) {\n            TreeNode curr = q.poll();\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                curr.left = new TreeNode(Integer.parseInt(tokens[i]));\n                q.offer(curr.left);\n            }\n            i++;\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                curr.right = new TreeNode(Integer.parseInt(tokens[i]));\n                q.offer(curr.right);\n            }\n            i++;\n        }\n        return root;\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            String[] tokens = new String[n];\n            for (int i = 0; i < n; i++) tokens[i] = scanner.next();\n            TreeNode root = buildTree(tokens);\n            // Check if root is a valid BST and print "true" or "false"\n        }\n    }\n}`,
    },
    testCases: [
      { input: "3\n2 1 3", expectedOutput: "true", isHidden: false },
      { input: "7\n5 1 4 null null 3 6", expectedOutput: "false", isHidden: false },
      { input: "3\n2 2 2", expectedOutput: "false", isHidden: true },
      { input: "7\n10 5 15 null null 6 20", expectedOutput: "false", isHidden: true },
      { input: "1\n0", expectedOutput: "true", isHidden: true },
    ],
    hints: [
      "Pass min and max bounds downwards: (root.val > minVal && root.val < maxVal).",
    ],
  },
  {
    title: "Number of Islands",
    slug: "number-of-islands",
    difficulty: "Medium",
    tags: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"],
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return *the number of islands*.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'.",
    ],
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: "1",
        explanation: "All 1s form a single connected island.",
      },
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: "3",
        explanation: "3 disconnected islands.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n    int m, n;\n    if (cin >> m >> n) {\n        vector<vector<char>> grid(m, vector<char>(n));\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n; j++) {\n                cin >> grid[i][j];\n            }\n        }\n        // Count number of islands ('1's surrounded by '0's) and print the count\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int m, n;\n    if (scanf("%d %d", &m, &n) == 2) {\n        char grid[301][301];\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n; j++) {\n                scanf(" %c", &grid[i][j]);\n            }\n        }\n        // Count number of islands and print\n    }\n    return 0;\n}`,
      python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    m = int(input_data[0])\n    n = int(input_data[1])\n    idx = 2\n    grid = []\n    for _ in range(m):\n        row = input_data[idx:idx+n]\n        grid.append(row)\n        idx += n\n    # Count number of islands and print\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length < 2 || input[0] === "") return;\n    const m = parseInt(input[0], 10);\n    const n = parseInt(input[1], 10);\n    let idx = 2;\n    const grid = [];\n    for (let i = 0; i < m; i++) {\n        grid.push(input.slice(idx, idx + n));\n        idx += n;\n    }\n    // Count number of islands and print\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length < 2 || input[0] === "") return;\n    const m = parseInt(input[0], 10);\n    const n = parseInt(input[1], 10);\n    let idx = 2;\n    const grid: string[][] = [];\n    for (let i = 0; i < m; i++) {\n        grid.push(input.slice(idx, idx + n));\n        idx += n;\n    }\n    // Count number of islands and print\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int m = scanner.nextInt();\n            int n = scanner.nextInt();\n            char[][] grid = new char[m][n];\n            for (int i = 0; i < m; i++) {\n                for (int j = 0; j < n; j++) {\n                    grid[i][j] = scanner.next().charAt(0);\n                }\n            }\n            // Count number of islands and print\n        }\n    }\n}`,
    },
    testCases: [
      { input: "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0", expectedOutput: "1", isHidden: false },
      { input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", expectedOutput: "3", isHidden: false },
      { input: "1 1\n0", expectedOutput: "0", isHidden: true },
      { input: "3 3\n1 0 1\n0 1 0\n1 0 1", expectedOutput: "5", isHidden: true },
    ],
    hints: [
      "Iterate over each cell; when you find a '1', increment island count and run DFS/BFS to sink the connected land into '0'.",
    ],
  },
  {
    title: "Course Schedule",
    slug: "course-schedule",
    difficulty: "Medium",
    tags: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
    description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [ai, bi]\` indicates that you **must** take course \`bi\` first if you want to take course \`ai\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.`,
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "prerequisites[i].length == 2",
      "0 <= ai, bi < numCourses",
      "All the pairs prerequisites[i] are unique.",
    ],
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        output: "true",
        explanation: "Take course 0 then course 1.",
      },
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        output: "false",
        explanation: "Circular prerequisite dependency.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <queue>\n\nusing namespace std;\n\nint main() {\n    int numCourses, p;\n    if (cin >> numCourses >> p) {\n        vector<pair<int, int>> prerequisites(p);\n        for (int i = 0; i < p; i++) {\n            cin >> prerequisites[i].first >> prerequisites[i].second;\n        }\n        // Check if all courses can be finished using Kahn's algorithm or DFS cycle detection\n        // Print "true" or "false"\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n\nint main() {\n    int numCourses, p;\n    if (scanf("%d %d", &numCourses, &p) == 2) {\n        // Topological sort / cycle detection\n    }\n    return 0;\n}`,
      python: `import sys\nfrom collections import deque\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    num_courses = int(input_data[0])\n    p = int(input_data[1])\n    idx = 2\n    prerequisites = []\n    for _ in range(p):\n        a = int(input_data[idx])\n        b = int(input_data[idx+1])\n        prerequisites.append((a, b))\n        idx += 2\n    # Check if all courses can be finished and print "true" or "false"\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length < 2 || input[0] === "") return;\n    const numCourses = parseInt(input[0], 10);\n    const p = parseInt(input[1], 10);\n    let idx = 2;\n    const prerequisites = [];\n    for (let i = 0; i < p; i++) {\n        prerequisites.push([parseInt(input[idx], 10), parseInt(input[idx+1], 10)]);\n        idx += 2;\n    }\n    // Check if all courses can be finished and print "true" or "false"\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length < 2 || input[0] === "") return;\n    const numCourses = parseInt(input[0], 10);\n    const p = parseInt(input[1], 10);\n    let idx = 2;\n    const prerequisites: [number, number][] = [];\n    for (let i = 0; i < p; i++) {\n        prerequisites.push([parseInt(input[idx], 10), parseInt(input[idx+1], 10)]);\n        idx += 2;\n    }\n    // Check if all courses can be finished and print "true" or "false"\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int numCourses = scanner.nextInt();\n            int p = scanner.nextInt();\n            int[][] prerequisites = new int[p][2];\n            for (int i = 0; i < p; i++) {\n                prerequisites[i][0] = scanner.nextInt();\n                prerequisites[i][1] = scanner.nextInt();\n            }\n            // Check if all courses can be finished and print "true" or "false"\n        }\n    }\n}`,
    },
    testCases: [
      { input: "2\n1\n1 0", expectedOutput: "true", isHidden: false },
      { input: "2\n2\n1 0\n0 1", expectedOutput: "false", isHidden: false },
      { input: "3\n2\n1 0\n2 1", expectedOutput: "true", isHidden: true },
      { input: "1\n0", expectedOutput: "true", isHidden: true },
    ],
    hints: [
      "Model as a directed graph and check for cycles using Topological Sort (Kahn's Algorithm with in-degrees) or DFS cycle detection.",
    ],
  },
  {
    title: "Binary Tree Maximum Path Sum",
    slug: "binary-tree-maximum-path-sum",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Tree", "Depth-First Search", "Binary Tree"],
    description: `A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence **at most once**. Note that the path does not need to pass through the root.

The **path sum** of a path is the sum of the node's values in the path.

Given the \`root\` of a binary tree, return *the maximum* **path sum** *of any non-empty path*.`,
    constraints: [
      "The number of nodes in the tree is in the range [1, 3 * 10^4].",
      "-1000 <= Node.val <= 1000",
    ],
    examples: [
      {
        input: "root = [1,2,3]",
        output: "6",
        explanation: "The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.",
      },
      {
        input: "root = [-10,9,20,null,null,15,7]",
        output: "42",
        explanation: "The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <queue>\n#include <algorithm>\n\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nTreeNode* buildTree(const vector<string>& tokens) {\n    if (tokens.empty() || tokens[0] == "null") return nullptr;\n    TreeNode *root = new TreeNode(stoi(tokens[0]));\n    queue<TreeNode*> q;\n    q.push(root);\n    size_t i = 1;\n    while (!q.empty() && i < tokens.size()) {\n        TreeNode *curr = q.front();\n        q.pop();\n        if (i < tokens.size() && tokens[i] != "null") {\n            curr->left = new TreeNode(stoi(tokens[i]));\n            q.push(curr->left);\n        }\n        i++;\n        if (i < tokens.size() && tokens[i] != "null") {\n            curr->right = new TreeNode(stoi(tokens[i]));\n            q.push(curr->right);\n        }\n        i++;\n    }\n    return root;\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<string> tokens(n);\n        for (int i = 0; i < n; i++) cin >> tokens[i];\n        TreeNode *root = buildTree(tokens);\n        // Compute maximum path sum in binary tree and print it\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        // Compute max path sum\n    }\n    return 0;\n}`,
      python: `import sys\nfrom collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef build_tree(tokens):\n    if not tokens or tokens[0] == "null":\n        return None\n    root = TreeNode(int(tokens[0]))\n    q = deque([root])\n    i = 1\n    while q and i < len(tokens):\n        curr = q.popleft()\n        if i < len(tokens) and tokens[i] != "null":\n            curr.left = TreeNode(int(tokens[i]))\n            q.append(curr.left)\n        i += 1\n        if i < len(tokens) and tokens[i] != "null":\n            curr.right = TreeNode(int(tokens[i]))\n            q.append(curr.right)\n        i += 1\n    return root\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    tokens = input_data[1:n+1]\n    root = build_tree(tokens)\n    # Compute maximum path sum in binary tree and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nclass TreeNode {\n    constructor(val = 0, left = null, right = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nfunction buildTree(tokens) {\n    if (!tokens || tokens.length === 0 || tokens[0] === "null") return null;\n    const root = new TreeNode(parseInt(tokens[0], 10));\n    const q = [root];\n    let i = 1;\n    while (q.length > 0 && i < tokens.length) {\n        const curr = q.shift();\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.left = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.left);\n        }\n        i++;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.right = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.right);\n        }\n        i++;\n    }\n    return root;\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const tokens = input.slice(1, n + 1);\n    const root = buildTree(tokens);\n    // Compute maximum path sum in binary tree and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nclass TreeNode {\n    val: number;\n    left: TreeNode | null;\n    right: TreeNode | null;\n    constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n\nfunction buildTree(tokens: string[]): TreeNode | null {\n    if (!tokens || tokens.length === 0 || tokens[0] === "null") return null;\n    const root = new TreeNode(parseInt(tokens[0], 10));\n    const q: TreeNode[] = [root];\n    let i = 1;\n    while (q.length > 0 && i < tokens.length) {\n        const curr = q.shift()!;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.left = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.left);\n        }\n        i++;\n        if (i < tokens.length && tokens[i] !== "null") {\n            curr.right = new TreeNode(parseInt(tokens[i], 10));\n            q.push(curr.right);\n        }\n        i++;\n    }\n    return root;\n}\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const tokens = input.slice(1, n + 1);\n    const root = buildTree(tokens);\n    // Compute maximum path sum in binary tree and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    static class TreeNode {\n        int val;\n        TreeNode left;\n        TreeNode right;\n        TreeNode(int val) { this.val = val; }\n    }\n\n    static TreeNode buildTree(String[] tokens) {\n        if (tokens == null || tokens.length == 0 || tokens[0].equals("null")) return null;\n        TreeNode root = new TreeNode(Integer.parseInt(tokens[0]));\n        Queue<TreeNode> q = new LinkedList<>();\n        q.offer(root);\n        int i = 1;\n        while (!q.isEmpty() && i < tokens.length) {\n            TreeNode curr = q.poll();\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                curr.left = new TreeNode(Integer.parseInt(tokens[i]));\n                q.offer(curr.left);\n            }\n            i++;\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                curr.right = new TreeNode(Integer.parseInt(tokens[i]));\n                q.offer(curr.right);\n            }\n            i++;\n        }\n        return root;\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            String[] tokens = new String[n];\n            for (int i = 0; i < n; i++) tokens[i] = scanner.next();\n            TreeNode root = buildTree(tokens);\n            // Compute maximum path sum in binary tree and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "3\n1 2 3", expectedOutput: "6", isHidden: false },
      { input: "7\n-10 9 20 null null 15 7", expectedOutput: "42", isHidden: false },
      { input: "1\n-3", expectedOutput: "-3", isHidden: true },
      { input: "5\n2 -1 -2 null null", expectedOutput: "2", isHidden: true },
    ],
    hints: [
      "For each node, compute the max single-branch gain max(0, dfs(child)), and update global max sum with node.val + leftGain + rightGain.",
    ],
  },
  {
    title: "Word Ladder",
    slug: "word-ladder",
    difficulty: "Hard",
    tags: ["Hash Table", "String", "Breadth-First Search"],
    description: `A **transformation sequence** from word \`beginWord\` to word \`endWord\` using a dictionary \`wordList\` is a sequence of words \`beginWord -> s1 -> s2 -> ... -> sk\` such that:
- Every adjacent pair of words differs by a single letter.
- Every \`si\` for \`1 <= i <= k\` is in \`wordList\`.
- \`sk == endWord\`

Given two words, \`beginWord\` and \`endWord\`, and a dictionary \`wordList\`, return *the* **number of words** *in the* **shortest transformation sequence** *from* \`beginWord\` *to* \`endWord\`, *or* \`0\` *if no such sequence exists.*`,
    constraints: [
      "1 <= beginWord.length <= 10",
      "endWord.length == beginWord.length",
      "1 <= wordList.length <= 5000",
      "wordList[i].length == beginWord.length",
      "beginWord, endWord, and wordList[i] consist of lowercase English letters.",
      "beginWord != endWord",
      "All the words in wordList are unique.",
    ],
    examples: [
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        output: "5",
        explanation: 'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.',
      },
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]',
        output: "0",
        explanation: 'The endWord "cog" is not in wordList, therefore there is no valid transformation sequence.',
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <string>\n#include <vector>\n#include <unordered_set>\n#include <queue>\n\nusing namespace std;\n\nint main() {\n    string beginWord, endWord;\n    int n;\n    if (cin >> beginWord >> endWord >> n) {\n        vector<string> wordList(n);\n        for (int i = 0; i < n; i++) cin >> wordList[i];\n        // Find shortest transformation sequence length from beginWord to endWord\n        // Print length (0 if no sequence exists)\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n#include <stdlib.h>\n\nint main() {\n    char beginWord[20], endWord[20];\n    int n;\n    if (scanf("%s %s %d", beginWord, endWord, &n) == 3) {\n        // BFS shortest word ladder\n    }\n    return 0;\n}`,
      python: `import sys\nfrom collections import deque\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    begin_word = input_data[0]\n    end_word = input_data[1]\n    n = int(input_data[2])\n    word_list = input_data[3:3+n]\n    # Find shortest transformation sequence length and print it\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length < 3 || input[0] === "") return;\n    const beginWord = input[0];\n    const endWord = input[1];\n    const n = parseInt(input[2], 10);\n    const wordList = input.slice(3, 3 + n);\n    // Find shortest transformation sequence length and print it\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length < 3 || input[0] === "") return;\n    const beginWord = input[0];\n    const endWord = input[1];\n    const n = parseInt(input[2], 10);\n    const wordList = input.slice(3, 3 + n);\n    // Find shortest transformation sequence length and print it\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNext()) {\n            String beginWord = scanner.next();\n            String endWord = scanner.next();\n            int n = scanner.nextInt();\n            List<String> wordList = new ArrayList<>();\n            for (int i = 0; i < n; i++) wordList.add(scanner.next());\n            // Find shortest transformation sequence length and print it\n        }\n    }\n}`,
    },
    testCases: [
      { input: "hit\ncog\n6\nhot\ndot\ndog\nlot\nlog\ncog", expectedOutput: "5", isHidden: false },
      { input: "hit\ncog\n5\nhot\ndot\ndog\nlot\nlog", expectedOutput: "0", isHidden: false },
      { input: "a\nc\n3\na\nb\nc", expectedOutput: "2", isHidden: true },
      { input: "hot\ndog\n3\nhot\ndog\ndot", expectedOutput: "3", isHidden: true },
    ],
    hints: [
      "Use Breadth-First Search (BFS) starting from beginWord to find the shortest path in unweighted graph.",
    ],
  },
];
