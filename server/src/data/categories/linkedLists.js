/**
 * Linked Lists Problem Collection
 */

export const linkedListProblems = [
  {
    title: "Reverse Linked List",
    slug: "reverse-linked-list",
    difficulty: "Easy",
    tags: ["Linked List", "Recursion"],
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    constraints: [
      "The number of nodes in the list is the range [1, 5000].",
      "-5000 <= Node.val <= 5000",
    ],
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "The reversed list is returned.",
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
        explanation: "Two elements reversed.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nstruct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode* buildList(const vector<int>& vals) {\n    if (vals.empty()) return nullptr;\n    ListNode *head = new ListNode(vals[0]);\n    ListNode *curr = head;\n    for (size_t i = 1; i < vals.size(); i++) {\n        curr->next = new ListNode(vals[i]);\n        curr = curr->next;\n    }\n    return head;\n}\n\nvoid printList(ListNode *head) {\n    ListNode *curr = head;\n    bool first = true;\n    while (curr) {\n        if (!first) cout << " ";\n        cout << curr->val;\n        first = false;\n        curr = curr->next;\n    }\n    cout << endl;\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> vals(n);\n        for (int i = 0; i < n; i++) {\n            cin >> vals[i];\n        }\n        ListNode *head = buildList(vals);\n        // Reverse the linked list starting at head and print the result using printList()\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct ListNode {\n    int val;\n    struct ListNode *next;\n};\n\nstruct ListNode* createNode(int val) {\n    struct ListNode *node = (struct ListNode *)malloc(sizeof(struct ListNode));\n    node->val = val;\n    node->next = NULL;\n    return node;\n}\n\nvoid printList(struct ListNode *head) {\n    struct ListNode *curr = head;\n    int first = 1;\n    while (curr) {\n        if (!first) printf(" ");\n        printf("%d", curr->val);\n        first = 0;\n        curr = curr->next;\n    }\n    printf("\\n");\n}\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        struct ListNode *head = NULL, *tail = NULL;\n        for (int i = 0; i < n; i++) {\n            int val;\n            scanf("%d", &val);\n            struct ListNode *node = createNode(val);\n            if (!head) head = node;\n            else tail->next = node;\n            tail = node;\n        }\n        // Reverse the linked list starting at head and print the result using printList()\n    }\n    return 0;\n}`,
      python: `import sys\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef build_list(vals):\n    if not vals:\n        return None\n    head = ListNode(vals[0])\n    curr = head\n    for v in vals[1:]:\n        curr.next = ListNode(v)\n        curr = curr.next\n    return head\n\ndef print_list(head):\n    vals = []\n    curr = head\n    while curr:\n        vals.append(str(curr.val))\n        curr = curr.next\n    print(" ".join(vals))\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    vals = [int(x) for x in input_data[1:n+1]]\n    head = build_list(vals)\n    # Reverse the linked list starting at head and print the result using print_list()\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nclass ListNode {\n    constructor(val = 0, next = null) {\n        this.val = val;\n        this.next = next;\n    }\n}\n\nfunction buildList(vals) {\n    if (!vals || vals.length === 0) return null;\n    const head = new ListNode(vals[0]);\n    let curr = head;\n    for (let i = 1; i < vals.length; i++) {\n        curr.next = new ListNode(vals[i]);\n        curr = curr.next;\n    }\n    return head;\n}\n\nfunction printList(head) {\n    const res = [];\n    let curr = head;\n    while (curr) {\n        res.push(curr.val);\n        curr = curr.next;\n    }\n    console.log(res.join(" "));\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const vals = input.slice(1, n + 1).map(Number);\n    const head = buildList(vals);\n    // Reverse the linked list starting at head and print the result using printList()\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nclass ListNode {\n    val: number;\n    next: ListNode | null;\n    constructor(val = 0, next: ListNode | null = null) {\n        this.val = val;\n        this.next = next;\n    }\n}\n\nfunction buildList(vals: number[]): ListNode | null {\n    if (!vals || vals.length === 0) return null;\n    const head = new ListNode(vals[0]);\n    let curr = head;\n    for (let i = 1; i < vals.length; i++) {\n        curr.next = new ListNode(vals[i]);\n        curr = curr.next;\n    }\n    return head;\n}\n\nfunction printList(head: ListNode | null): void {\n    const res: number[] = [];\n    let curr = head;\n    while (curr) {\n        res.push(curr.val);\n        curr = curr.next;\n    }\n    console.log(res.join(" "));\n}\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const vals = input.slice(1, n + 1).map(Number);\n    const head = buildList(vals);\n    // Reverse the linked list starting at head and print the result using printList()\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    static class ListNode {\n        int val;\n        ListNode next;\n        ListNode(int val) { this.val = val; }\n    }\n\n    static ListNode buildList(int[] vals) {\n        if (vals == null || vals.length == 0) return null;\n        ListNode head = new ListNode(vals[0]);\n        ListNode curr = head;\n        for (int i = 1; i < vals.length; i++) {\n            curr.next = new ListNode(vals[i]);\n            curr = curr.next;\n        }\n        return head;\n    }\n\n    static void printList(ListNode head) {\n        StringBuilder sb = new StringBuilder();\n        ListNode curr = head;\n        while (curr != null) {\n            sb.append(curr.val);\n            if (curr.next != null) sb.append(" ");\n            curr = curr.next;\n        }\n        System.out.println(sb.toString());\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] vals = new int[n];\n            for (int i = 0; i < n; i++) {\n                vals[i] = scanner.nextInt();\n            }\n            ListNode head = buildList(vals);\n            // Reverse the linked list starting at head and print the result using printList()\n        }\n    }\n}`,
    },
    testCases: [
      { input: "5\n1 2 3 4 5", expectedOutput: "5 4 3 2 1", isHidden: false },
      { input: "2\n1 2", expectedOutput: "2 1", isHidden: false },
      { input: "1\n1", expectedOutput: "1", isHidden: true },
      { input: "4\n1 2 3 4", expectedOutput: "4 3 2 1", isHidden: true },
    ],
    hints: [
      "Iteratively reverse pointers: curr.next = prev.",
    ],
  },
  {
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    difficulty: "Easy",
    tags: ["Linked List", "Recursion"],
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return *the head of the merged linked list*.`,
    constraints: [
      "The number of nodes in both lists is in the range [1, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order.",
    ],
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
        explanation: "Lists are merged into a single sorted list.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nstruct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode* buildList(const vector<int>& vals) {\n    if (vals.empty()) return nullptr;\n    ListNode *head = new ListNode(vals[0]);\n    ListNode *curr = head;\n    for (size_t i = 1; i < vals.size(); i++) {\n        curr->next = new ListNode(vals[i]);\n        curr = curr->next;\n    }\n    return head;\n}\n\nvoid printList(ListNode *head) {\n    ListNode *curr = head;\n    bool first = true;\n    while (curr) {\n        if (!first) cout << " ";\n        cout << curr->val;\n        first = false;\n        curr = curr->next;\n    }\n    cout << endl;\n}\n\nint main() {\n    int n1;\n    if (cin >> n1) {\n        vector<int> vals1(n1);\n        for (int i = 0; i < n1; i++) cin >> vals1[i];\n        int n2;\n        cin >> n2;\n        vector<int> vals2(n2);\n        for (int i = 0; i < n2; i++) cin >> vals2[i];\n        ListNode *list1 = buildList(vals1);\n        ListNode *list2 = buildList(vals2);\n        // Merge list1 and list2 and print the merged list with printList()\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct ListNode {\n    int val;\n    struct ListNode *next;\n};\n\nstruct ListNode* createNode(int val) {\n    struct ListNode *node = (struct ListNode *)malloc(sizeof(struct ListNode));\n    node->val = val;\n    node->next = NULL;\n    return node;\n}\n\nvoid printList(struct ListNode *head) {\n    struct ListNode *curr = head;\n    int first = 1;\n    while (curr) {\n        if (!first) printf(" ");\n        printf("%d", curr->val);\n        first = 0;\n        curr = curr->next;\n    }\n    printf("\\n");\n}\n\nint main() {\n    int n1;\n    if (scanf("%d", &n1) == 1) {\n        struct ListNode *l1 = NULL, *t1 = NULL;\n        for (int i = 0; i < n1; i++) {\n            int val; scanf("%d", &val);\n            struct ListNode *node = createNode(val);\n            if (!l1) l1 = node; else t1->next = node;\n            t1 = node;\n        }\n        int n2;\n        scanf("%d", &n2);\n        struct ListNode *l2 = NULL, *t2 = NULL;\n        for (int i = 0; i < n2; i++) {\n            int val; scanf("%d", &val);\n            struct ListNode *node = createNode(val);\n            if (!l2) l2 = node; else t2->next = node;\n            t2 = node;\n        }\n        // Merge l1 and l2 and print with printList()\n    }\n    return 0;\n}`,
      python: `import sys\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef build_list(vals):\n    if not vals:\n        return None\n    head = ListNode(vals[0])\n    curr = head\n    for v in vals[1:]:\n        curr.next = ListNode(v)\n        curr = curr.next\n    return head\n\ndef print_list(head):\n    vals = []\n    curr = head\n    while curr:\n        vals.append(str(curr.val))\n        curr = curr.next\n    print(" ".join(vals))\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    idx = 0\n    n1 = int(input_data[idx]); idx += 1\n    vals1 = [int(x) for x in input_data[idx:idx+n1]]; idx += n1\n    n2 = int(input_data[idx]); idx += 1\n    vals2 = [int(x) for x in input_data[idx:idx+n2]]; idx += n2\n    list1 = build_list(vals1)\n    list2 = build_list(vals2)\n    # Merge list1 and list2 and print the merged list with print_list()\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nclass ListNode {\n    constructor(val = 0, next = null) {\n        this.val = val;\n        this.next = next;\n    }\n}\n\nfunction buildList(vals) {\n    if (!vals || vals.length === 0) return null;\n    const head = new ListNode(vals[0]);\n    let curr = head;\n    for (let i = 1; i < vals.length; i++) {\n        curr.next = new ListNode(vals[i]);\n        curr = curr.next;\n    }\n    return head;\n}\n\nfunction printList(head) {\n    const res = [];\n    let curr = head;\n    while (curr) {\n        res.push(curr.val);\n        curr = curr.next;\n    }\n    console.log(res.join(" "));\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    let idx = 0;\n    const n1 = parseInt(input[idx++], 10);\n    const vals1 = input.slice(idx, idx + n1).map(Number); idx += n1;\n    const n2 = parseInt(input[idx++], 10);\n    const vals2 = input.slice(idx, idx + n2).map(Number); idx += n2;\n    const list1 = buildList(vals1);\n    const list2 = buildList(vals2);\n    // Merge list1 and list2 and print the merged list with printList()\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nclass ListNode {\n    val: number;\n    next: ListNode | null;\n    constructor(val = 0, next: ListNode | null = null) {\n        this.val = val;\n        this.next = next;\n    }\n}\n\nfunction buildList(vals: number[]): ListNode | null {\n    if (!vals || vals.length === 0) return null;\n    const head = new ListNode(vals[0]);\n    let curr = head;\n    for (let i = 1; i < vals.length; i++) {\n        curr.next = new ListNode(vals[i]);\n        curr = curr.next;\n    }\n    return head;\n}\n\nfunction printList(head: ListNode | null): void {\n    const res: number[] = [];\n    let curr = head;\n    while (curr) {\n        res.push(curr.val);\n        curr = curr.next;\n    }\n    console.log(res.join(" "));\n}\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    let idx = 0;\n    const n1 = parseInt(input[idx++], 10);\n    const vals1 = input.slice(idx, idx + n1).map(Number); idx += n1;\n    const n2 = parseInt(input[idx++], 10);\n    const vals2 = input.slice(idx, idx + n2).map(Number); idx += n2;\n    const list1 = buildList(vals1);\n    const list2 = buildList(vals2);\n    // Merge list1 and list2 and print the merged list with printList()\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    static class ListNode {\n        int val;\n        ListNode next;\n        ListNode(int val) { this.val = val; }\n    }\n\n    static ListNode buildList(int[] vals) {\n        if (vals == null || vals.length == 0) return null;\n        ListNode head = new ListNode(vals[0]);\n        ListNode curr = head;\n        for (int i = 1; i < vals.length; i++) {\n            curr.next = new ListNode(vals[i]);\n            curr = curr.next;\n        }\n        return head;\n    }\n\n    static void printList(ListNode head) {\n        StringBuilder sb = new StringBuilder();\n        ListNode curr = head;\n        while (curr != null) {\n            sb.append(curr.val);\n            if (curr.next != null) sb.append(" ");\n            curr = curr.next;\n        }\n        System.out.println(sb.toString());\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n1 = scanner.nextInt();\n            int[] vals1 = new int[n1];\n            for (int i = 0; i < n1; i++) vals1[i] = scanner.nextInt();\n            int n2 = scanner.nextInt();\n            int[] vals2 = new int[n2];\n            for (int i = 0; i < n2; i++) vals2[i] = scanner.nextInt();\n            ListNode list1 = buildList(vals1);\n            ListNode list2 = buildList(vals2);\n            // Merge list1 and list2 and print with printList()\n        }\n    }\n}`,
    },
    testCases: [
      { input: "3\n1 2 4\n3\n1 3 4", expectedOutput: "1 1 2 3 4 4", isHidden: false },
      { input: "1\n2\n1\n1", expectedOutput: "1 2", isHidden: false },
      { input: "3\n2 5 7\n4\n1 3 4 6", expectedOutput: "1 2 3 4 5 6 7", isHidden: true },
      { input: "1\n5\n3\n1 2 3", expectedOutput: "1 2 3 5", isHidden: true },
    ],
    hints: [
      "Use a dummy head pointer and advance the pointer pointing to the smaller current value.",
    ],
  },
  {
    title: "Linked List Cycle",
    slug: "linked-list-cycle",
    difficulty: "Easy",
    tags: ["Hash Table", "Linked List", "Two Pointers"],
    description: `Given \`head\`, the head of a linked list, determine if the linked list has a cycle in it.

Return \`true\` *if there is some cycle in the linked list*. Otherwise, return \`false\`.`,
    constraints: [
      "The number of the nodes in the list is in the range [1, 10^4].",
      "-10^5 <= Node.val <= 10^5",
    ],
    examples: [
      {
        input: "head = [3,2,0,-4], pos = 1",
        output: "true",
        explanation: "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).",
      },
      {
        input: "head = [1,2], pos = 0",
        output: "true",
        explanation: "Cycle connects tail to 0th node.",
      },
      {
        input: "head = [1], pos = -1",
        output: "false",
        explanation: "No cycle in the list.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nstruct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<ListNode*> nodes(n);\n        for (int i = 0; i < n; i++) {\n            int val;\n            cin >> val;\n            nodes[i] = new ListNode(val);\n            if (i > 0) nodes[i - 1]->next = nodes[i];\n        }\n        int pos;\n        cin >> pos;\n        if (pos >= 0 && pos < n) {\n            nodes[n - 1]->next = nodes[pos];\n        }\n        ListNode *head = n > 0 ? nodes[0] : nullptr;\n        // Detect if the linked list has a cycle using Floyd's algorithm and print "true" or "false"\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n\nstruct ListNode {\n    int val;\n    struct ListNode *next;\n};\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        struct ListNode **nodes = (struct ListNode **)malloc(n * sizeof(struct ListNode *));\n        for (int i = 0; i < n; i++) {\n            int val;\n            scanf("%d", &val);\n            nodes[i] = (struct ListNode *)malloc(sizeof(struct ListNode));\n            nodes[i]->val = val;\n            nodes[i]->next = NULL;\n            if (i > 0) nodes[i - 1]->next = nodes[i];\n        }\n        int pos;\n        scanf("%d", &pos);\n        if (pos >= 0 && pos < n) {\n            nodes[n - 1]->next = nodes[pos];\n        }\n        struct ListNode *head = n > 0 ? nodes[0] : NULL;\n        // Detect if the linked list has a cycle using Floyd's algorithm and print "true" or "false"\n    }\n    return 0;\n}`,
      python: `import sys\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    vals = [int(x) for x in input_data[1:n+1]]\n    pos = int(input_data[n+1]) if len(input_data) > n + 1 else -1\n    nodes = [ListNode(v) for v in vals]\n    for i in range(n - 1):\n        nodes[i].next = nodes[i + 1]\n    if pos >= 0 and pos < n:\n        nodes[n - 1].next = nodes[pos]\n    head = nodes[0] if nodes else None\n    # Detect if the linked list has a cycle using Floyd's algorithm and print "true" or "false"\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nclass ListNode {\n    constructor(val = 0, next = null) {\n        this.val = val;\n        this.next = next;\n    }\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const vals = input.slice(1, n + 1).map(Number);\n    const pos = parseInt(input[n + 1], 10);\n    const nodes = vals.map(v => new ListNode(v));\n    for (let i = 0; i < n - 1; i++) {\n        nodes[i].next = nodes[i + 1];\n    }\n    if (pos >= 0 && pos < n) {\n        nodes[n - 1].next = nodes[pos];\n    }\n    const head = nodes.length > 0 ? nodes[0] : null;\n    // Detect if the linked list has a cycle using Floyd's algorithm and print "true" or "false"\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nclass ListNode {\n    val: number;\n    next: ListNode | null;\n    constructor(val = 0, next: ListNode | null = null) {\n        this.val = val;\n        this.next = next;\n    }\n}\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const vals = input.slice(1, n + 1).map(Number);\n    const pos = parseInt(input[n + 1], 10);\n    const nodes = vals.map(v => new ListNode(v));\n    for (let i = 0; i < n - 1; i++) {\n        nodes[i].next = nodes[i + 1];\n    }\n    if (pos >= 0 && pos < n) {\n        nodes[n - 1].next = nodes[pos];\n    }\n    const head = nodes.length > 0 ? nodes[0] : null;\n    // Detect if the linked list has a cycle using Floyd's algorithm and print "true" or "false"\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    static class ListNode {\n        int val;\n        ListNode next;\n        ListNode(int val) { this.val = val; }\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            ListNode[] nodes = new ListNode[n];\n            for (int i = 0; i < n; i++) {\n                nodes[i] = new ListNode(scanner.nextInt());\n                if (i > 0) nodes[i - 1].next = nodes[i];\n            }\n            int pos = scanner.nextInt();\n            if (pos >= 0 && pos < n) {\n                nodes[n - 1].next = nodes[pos];\n            }\n            ListNode head = n > 0 ? nodes[0] : null;\n            // Detect if the linked list has a cycle using Floyd's algorithm and print "true" or "false"\n        }\n    }\n}`,
    },
    testCases: [
      { input: "4\n3 2 0 -4\n1", expectedOutput: "true", isHidden: false },
      { input: "2\n1 2\n0", expectedOutput: "true", isHidden: false },
      { input: "1\n1\n-1", expectedOutput: "false", isHidden: false },
      { input: "5\n1 2 3 4 5\n-1", expectedOutput: "false", isHidden: true },
      { input: "3\n1 2 3\n2", expectedOutput: "true", isHidden: true },
    ],
    hints: [
      "Use Floyd's Tortoise and Hare algorithm: slow pointer moves 1 step, fast pointer moves 2 steps.",
    ],
  },
  {
    title: "Remove Nth Node From End of List",
    slug: "remove-nth-node-from-end-of-list",
    difficulty: "Medium",
    tags: ["Linked List", "Two Pointers"],
    description: `Given the \`head\` of a linked list, remove the \`n\`th node from the end of the list and return its head.`,
    constraints: [
      "The number of nodes in the list is sz.",
      "1 <= sz <= 30",
      "0 <= Node.val <= 100",
      "1 <= n <= sz",
    ],
    examples: [
      {
        input: "head = [1,2,3,4,5], n = 2",
        output: "[1,2,3,5]",
        explanation: "The 2nd node from the end (4) is removed.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nstruct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode* buildList(const vector<int>& vals) {\n    if (vals.empty()) return nullptr;\n    ListNode *head = new ListNode(vals[0]);\n    ListNode *curr = head;\n    for (size_t i = 1; i < vals.size(); i++) {\n        curr->next = new ListNode(vals[i]);\n        curr = curr->next;\n    }\n    return head;\n}\n\nvoid printList(ListNode *head) {\n    ListNode *curr = head;\n    bool first = true;\n    while (curr) {\n        if (!first) cout << " ";\n        cout << curr->val;\n        first = false;\n        curr = curr->next;\n    }\n    cout << endl;\n}\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> vals(n);\n        for (int i = 0; i < n; i++) cin >> vals[i];\n        int k;\n        cin >> k;\n        ListNode *head = buildList(vals);\n        // Remove the kth node from the end of list starting at head and print result with printList()\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct ListNode {\n    int val;\n    struct ListNode *next;\n};\n\nstruct ListNode* createNode(int val) {\n    struct ListNode *node = (struct ListNode *)malloc(sizeof(struct ListNode));\n    node->val = val;\n    node->next = NULL;\n    return node;\n}\n\nvoid printList(struct ListNode *head) {\n    struct ListNode *curr = head;\n    int first = 1;\n    while (curr) {\n        if (!first) printf(" ");\n        printf("%d", curr->val);\n        first = 0;\n        curr = curr->next;\n    }\n    printf("\\n");\n}\n\nint main() {\n    int n;\n    if (scanf("%d", &n) == 1) {\n        struct ListNode *head = NULL, *tail = NULL;\n        for (int i = 0; i < n; i++) {\n            int val; scanf("%d", &val);\n            struct ListNode *node = createNode(val);\n            if (!head) head = node; else tail->next = node;\n            tail = node;\n        }\n        int k;\n        scanf("%d", &k);\n        // Remove the kth node from the end and print with printList()\n    }\n    return 0;\n}`,
      python: `import sys\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef build_list(vals):\n    if not vals:\n        return None\n    head = ListNode(vals[0])\n    curr = head\n    for v in vals[1:]:\n        curr.next = ListNode(v)\n        curr = curr.next\n    return head\n\ndef print_list(head):\n    vals = []\n    curr = head\n    while curr:\n        vals.append(str(curr.val))\n        curr = curr.next\n    print(" ".join(vals))\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    vals = [int(x) for x in input_data[1:n+1]]\n    k = int(input_data[n+1])\n    head = build_list(vals)\n    # Remove the kth node from the end and print result with print_list()\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nclass ListNode {\n    constructor(val = 0, next = null) {\n        this.val = val;\n        this.next = next;\n    }\n}\n\nfunction buildList(vals) {\n    if (!vals || vals.length === 0) return null;\n    const head = new ListNode(vals[0]);\n    let curr = head;\n    for (let i = 1; i < vals.length; i++) {\n        curr.next = new ListNode(vals[i]);\n        curr = curr.next;\n    }\n    return head;\n}\n\nfunction printList(head) {\n    const res = [];\n    let curr = head;\n    while (curr) {\n        res.push(curr.val);\n        curr = curr.next;\n    }\n    console.log(res.join(" "));\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const vals = input.slice(1, n + 1).map(Number);\n    const k = parseInt(input[n + 1], 10);\n    const head = buildList(vals);\n    // Remove the kth node from the end and print result with printList()\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nclass ListNode {\n    val: number;\n    next: ListNode | null;\n    constructor(val = 0, next: ListNode | null = null) {\n        this.val = val;\n        this.next = next;\n    }\n}\n\nfunction buildList(vals: number[]): ListNode | null {\n    if (!vals || vals.length === 0) return null;\n    const head = new ListNode(vals[0]);\n    let curr = head;\n    for (let i = 1; i < vals.length; i++) {\n        curr.next = new ListNode(vals[i]);\n        curr = curr.next;\n    }\n    return head;\n}\n\nfunction printList(head: ListNode | null): void {\n    const res: number[] = [];\n    let curr = head;\n    while (curr) {\n        res.push(curr.val);\n        curr = curr.next;\n    }\n    console.log(res.join(" "));\n}\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    const n = parseInt(input[0], 10);\n    const vals = input.slice(1, n + 1).map(Number);\n    const k = parseInt(input[n + 1], 10);\n    const head = buildList(vals);\n    // Remove the kth node from the end and print result with printList()\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    static class ListNode {\n        int val;\n        ListNode next;\n        ListNode(int val) { this.val = val; }\n    }\n\n    static ListNode buildList(int[] vals) {\n        if (vals == null || vals.length == 0) return null;\n        ListNode head = new ListNode(vals[0]);\n        ListNode curr = head;\n        for (int i = 1; i < vals.length; i++) {\n            curr.next = new ListNode(vals[i]);\n            curr = curr.next;\n        }\n        return head;\n    }\n\n    static void printList(ListNode head) {\n        StringBuilder sb = new StringBuilder();\n        ListNode curr = head;\n        while (curr != null) {\n            sb.append(curr.val);\n            if (curr.next != null) sb.append(" ");\n            curr = curr.next;\n        }\n        System.out.println(sb.toString());\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            int[] vals = new int[n];\n            for (int i = 0; i < n; i++) vals[i] = scanner.nextInt();\n            int k = scanner.nextInt();\n            ListNode head = buildList(vals);\n            // Remove the kth node from the end and print with printList()\n        }\n    }\n}`,
    },
    testCases: [
      { input: "5\n1 2 3 4 5\n2", expectedOutput: "1 2 3 5", isHidden: false },
      { input: "2\n1 2\n1", expectedOutput: "1", isHidden: false },
      { input: "2\n1 2\n2", expectedOutput: "2", isHidden: true },
      { input: "4\n1 2 3 4\n4", expectedOutput: "2 3 4", isHidden: true },
    ],
    hints: [
      "Advance fast pointer by n steps first, then advance slow and fast together.",
    ],
  },
  {
    title: "Merge k Sorted Lists",
    slug: "merge-k-sorted-lists",
    difficulty: "Hard",
    tags: ["Linked List", "Divide and Conquer", "Heap", "Merge Sort"],
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

*Merge all the linked-lists into one sorted linked-list and return it.*`,
    constraints: [
      "k == lists.length",
      "1 <= k <= 10^4",
      "1 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4",
      "lists[i] is sorted in ascending order.",
    ],
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
        explanation: "All 3 lists merged into a single sorted list.",
      },
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <queue>\n\nusing namespace std;\n\nstruct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode* buildList(const vector<int>& vals) {\n    if (vals.empty()) return nullptr;\n    ListNode *head = new ListNode(vals[0]);\n    ListNode *curr = head;\n    for (size_t i = 1; i < vals.size(); i++) {\n        curr->next = new ListNode(vals[i]);\n        curr = curr->next;\n    }\n    return head;\n}\n\nvoid printList(ListNode *head) {\n    ListNode *curr = head;\n    bool first = true;\n    while (curr) {\n        if (!first) cout << " ";\n        cout << curr->val;\n        first = false;\n        curr = curr->next;\n    }\n    cout << endl;\n}\n\nint main() {\n    int k;\n    if (cin >> k) {\n        vector<ListNode*> lists(k);\n        for (int i = 0; i < k; i++) {\n            int len;\n            cin >> len;\n            vector<int> vals(len);\n            for (int j = 0; j < len; j++) cin >> vals[j];\n            lists[i] = buildList(vals);\n        }\n        // Merge all k sorted linked lists and print the result with printList()\n    }\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct ListNode {\n    int val;\n    struct ListNode *next;\n};\n\nstruct ListNode* createNode(int val) {\n    struct ListNode *node = (struct ListNode *)malloc(sizeof(struct ListNode));\n    node->val = val;\n    node->next = NULL;\n    return node;\n}\n\nvoid printList(struct ListNode *head) {\n    struct ListNode *curr = head;\n    int first = 1;\n    while (curr) {\n        if (!first) printf(" ");\n        printf("%d", curr->val);\n        first = 0;\n        curr = curr->next;\n    }\n    printf("\\n");\n}\n\nint main() {\n    int k;\n    if (scanf("%d", &k) == 1) {\n        struct ListNode **lists = (struct ListNode **)malloc(k * sizeof(struct ListNode *));\n        for (int i = 0; i < k; i++) {\n            int len;\n            scanf("%d", &len);\n            struct ListNode *head = NULL, *tail = NULL;\n            for (int j = 0; j < len; j++) {\n                int val;\n                scanf("%d", &val);\n                struct ListNode *node = createNode(val);\n                if (!head) head = node; else tail->next = node;\n                tail = node;\n            }\n            lists[i] = head;\n        }\n        // Merge all k sorted linked lists and print with printList()\n    }\n    return 0;\n}`,
      python: `import sys\nimport heapq\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef build_list(vals):\n    if not vals:\n        return None\n    head = ListNode(vals[0])\n    curr = head\n    for v in vals[1:]:\n        curr.next = ListNode(v)\n        curr = curr.next\n    return head\n\ndef print_list(head):\n    vals = []\n    curr = head\n    while curr:\n        vals.append(str(curr.val))\n        curr = curr.next\n    print(" ".join(vals))\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    idx = 0\n    k = int(input_data[idx]); idx += 1\n    lists = []\n    for _ in range(k):\n        length = int(input_data[idx]); idx += 1\n        vals = [int(x) for x in input_data[idx:idx+length]]; idx += length\n        lists.append(build_list(vals))\n    # Merge all k sorted linked lists and print with print_list()\n\nif __name__ == "__main__":\n    main()`,
      javascript: `const fs = require("fs");\n\nclass ListNode {\n    constructor(val = 0, next = null) {\n        this.val = val;\n        this.next = next;\n    }\n}\n\nfunction buildList(vals) {\n    if (!vals || vals.length === 0) return null;\n    const head = new ListNode(vals[0]);\n    let curr = head;\n    for (let i = 1; i < vals.length; i++) {\n        curr.next = new ListNode(vals[i]);\n        curr = curr.next;\n    }\n    return head;\n}\n\nfunction printList(head) {\n    const res = [];\n    let curr = head;\n    while (curr) {\n        res.push(curr.val);\n        curr = curr.next;\n    }\n    console.log(res.join(" "));\n}\n\nfunction main() {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    let idx = 0;\n    const k = parseInt(input[idx++], 10);\n    const lists = [];\n    for (let i = 0; i < k; i++) {\n        const len = parseInt(input[idx++], 10);\n        const vals = input.slice(idx, idx + len).map(Number); idx += len;\n        lists.push(buildList(vals));\n    }\n    // Merge all k sorted linked lists and print with printList()\n}\n\nmain();`,
      typescript: `import * as fs from "fs";\n\nclass ListNode {\n    val: number;\n    next: ListNode | null;\n    constructor(val = 0, next: ListNode | null = null) {\n        this.val = val;\n        this.next = next;\n    }\n}\n\nfunction buildList(vals: number[]): ListNode | null {\n    if (!vals || vals.length === 0) return null;\n    const head = new ListNode(vals[0]);\n    let curr = head;\n    for (let i = 1; i < vals.length; i++) {\n        curr.next = new ListNode(vals[i]);\n        curr = curr.next;\n    }\n    return head;\n}\n\nfunction printList(head: ListNode | null): void {\n    const res: number[] = [];\n    let curr = head;\n    while (curr) {\n        res.push(curr.val);\n        curr = curr.next;\n    }\n    console.log(res.join(" "));\n}\n\nfunction main(): void {\n    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\n    if (input.length === 0 || input[0] === "") return;\n    let idx = 0;\n    const k = parseInt(input[idx++], 10);\n    const lists: (ListNode | null)[] = [];\n    for (let i = 0; i < k; i++) {\n        const len = parseInt(input[idx++], 10);\n        const vals = input.slice(idx, idx + len).map(Number); idx += len;\n        lists.push(buildList(vals));\n    }\n    // Merge all k sorted linked lists and print with printList()\n}\n\nmain();`,
      java: `import java.util.*;\n\npublic class Main {\n    static class ListNode {\n        int val;\n        ListNode next;\n        ListNode(int val) { this.val = val; }\n    }\n\n    static ListNode buildList(int[] vals) {\n        if (vals == null || vals.length == 0) return null;\n        ListNode head = new ListNode(vals[0]);\n        ListNode curr = head;\n        for (int i = 1; i < vals.length; i++) {\n            curr.next = new ListNode(vals[i]);\n            curr = curr.next;\n        }\n        return head;\n    }\n\n    static void printList(ListNode head) {\n        StringBuilder sb = new StringBuilder();\n        ListNode curr = head;\n        while (curr != null) {\n            sb.append(curr.val);\n            if (curr.next != null) sb.append(" ");\n            curr = curr.next;\n        }\n        System.out.println(sb.toString());\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int k = scanner.nextInt();\n            ListNode[] lists = new ListNode[k];\n            for (int i = 0; i < k; i++) {\n                int len = scanner.nextInt();\n                int[] vals = new int[len];\n                for (int j = 0; j < len; j++) vals[j] = scanner.nextInt();\n                lists[i] = buildList(vals);\n            }\n            // Merge all k sorted linked lists and print with printList()\n        }\n    }\n}`,
    },
    testCases: [
      { input: "3\n3\n1 4 5\n3\n1 3 4\n2\n2 6", expectedOutput: "1 1 2 3 4 4 5 6", isHidden: false },
      { input: "2\n1\n1\n1\n0", expectedOutput: "0 1", isHidden: false },
      { input: "3\n1\n2\n2\n1 3\n2\n0 4", expectedOutput: "0 1 2 3 4", isHidden: true },
      { input: "4\n2\n-1 1\n1\n0\n2\n3 4\n1\n2", expectedOutput: "-1 0 1 2 3 4", isHidden: true },
    ],
    hints: [
      "Use a Min Heap / Priority Queue to pick the smallest current head among all k lists in O(log k) time.",
    ],
  },
];
