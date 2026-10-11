import dotenv from "dotenv";
dotenv.config();

import { evaluateSubmission } from "../services/pistonService.js";
import { linkedListProblems } from "../data/categories/linkedLists.js";

const solutions = {
  "reverse-linked-list": {
    language: "javascript",
    code: `const fs = require("fs");

class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function buildList(vals) {
    if (!vals || vals.length === 0) return null;
    const head = new ListNode(vals[0]);
    let curr = head;
    for (let i = 1; i < vals.length; i++) {
        curr.next = new ListNode(vals[i]);
        curr = curr.next;
    }
    return head;
}

function printList(head) {
    const res = [];
    let curr = head;
    while (curr) {
        res.push(curr.val);
        curr = curr.next;
    }
    console.log(res.join(" "));
}

function main() {
    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (input.length === 0 || input[0] === "") return;
    const n = parseInt(input[0], 10);
    const vals = input.slice(1, n + 1).map(Number);
    const head = buildList(vals);
    let prev = null;
    let curr = head;
    while (curr) {
        const nxt = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nxt;
    }
    printList(prev);
}

main();`,
  },
  "merge-two-sorted-lists": {
    language: "javascript",
    code: `const fs = require("fs");

class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function buildList(vals) {
    if (!vals || vals.length === 0) return null;
    const head = new ListNode(vals[0]);
    let curr = head;
    for (let i = 1; i < vals.length; i++) {
        curr.next = new ListNode(vals[i]);
        curr = curr.next;
    }
    return head;
}

function printList(head) {
    const res = [];
    let curr = head;
    while (curr) {
        res.push(curr.val);
        curr = curr.next;
    }
    console.log(res.join(" "));
}

function main() {
    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (input.length === 0 || input[0] === "") return;
    let idx = 0;
    const n1 = parseInt(input[idx++], 10);
    const vals1 = input.slice(idx, idx + n1).map(Number); idx += n1;
    const n2 = parseInt(input[idx++], 10);
    const vals2 = input.slice(idx, idx + n2).map(Number); idx += n2;
    const l1 = buildList(vals1);
    const l2 = buildList(vals2);
    const dummy = new ListNode(0);
    let curr = dummy;
    let p1 = l1, p2 = l2;
    while (p1 && p2) {
        if (p1.val <= p2.val) {
            curr.next = p1;
            p1 = p1.next;
        } else {
            curr.next = p2;
            p2 = p2.next;
        }
        curr = curr.next;
    }
    curr.next = p1 || p2;
    printList(dummy.next);
}

main();`,
  },
  "linked-list-cycle": {
    language: "javascript",
    code: `const fs = require("fs");

class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function main() {
    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (input.length === 0 || input[0] === "") return;
    const n = parseInt(input[0], 10);
    const vals = input.slice(1, n + 1).map(Number);
    const pos = parseInt(input[n + 1], 10);
    const nodes = vals.map(v => new ListNode(v));
    for (let i = 0; i < n - 1; i++) {
        nodes[i].next = nodes[i + 1];
    }
    if (pos >= 0 && pos < n) {
        nodes[n - 1].next = nodes[pos];
    }
    const head = nodes.length > 0 ? nodes[0] : null;
    let slow = head, fast = head;
    let hasCycle = false;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) {
            hasCycle = true;
            break;
        }
    }
    console.log(hasCycle ? "true" : "false");
}

main();`,
  },
  "remove-nth-node-from-end-of-list": {
    language: "javascript",
    code: `const fs = require("fs");

class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function buildList(vals) {
    if (!vals || vals.length === 0) return null;
    const head = new ListNode(vals[0]);
    let curr = head;
    for (let i = 1; i < vals.length; i++) {
        curr.next = new ListNode(vals[i]);
        curr = curr.next;
    }
    return head;
}

function printList(head) {
    const res = [];
    let curr = head;
    while (curr) {
        res.push(curr.val);
        curr = curr.next;
    }
    console.log(res.join(" "));
}

function main() {
    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (input.length === 0 || input[0] === "") return;
    const n = parseInt(input[0], 10);
    const vals = input.slice(1, n + 1).map(Number);
    const k = parseInt(input[n + 1], 10);
    const head = buildList(vals);
    const dummy = new ListNode(0, head);
    let fast = dummy, slow = dummy;
    for (let i = 0; i < k + 1; i++) {
        fast = fast.next;
    }
    while (fast) {
        slow = slow.next;
        fast = fast.next;
    }
    slow.next = slow.next.next;
    printList(dummy.next);
}

main();`,
  },
  "merge-k-sorted-lists": {
    language: "javascript",
    code: `const fs = require("fs");

class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function buildList(vals) {
    if (!vals || vals.length === 0) return null;
    const head = new ListNode(vals[0]);
    let curr = head;
    for (let i = 1; i < vals.length; i++) {
        curr.next = new ListNode(vals[i]);
        curr = curr.next;
    }
    return head;
}

function printList(head) {
    const res = [];
    let curr = head;
    while (curr) {
        res.push(curr.val);
        curr = curr.next;
    }
    console.log(res.join(" "));
}

function main() {
    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (input.length === 0 || input[0] === "") return;
    let idx = 0;
    const k = parseInt(input[idx++], 10);
    const allVals = [];
    for (let i = 0; i < k; i++) {
        const len = parseInt(input[idx++], 10);
        const vals = input.slice(idx, idx + len).map(Number); idx += len;
        for (const v of vals) allVals.push(v);
    }
    allVals.sort((a, b) => a - b);
    const head = buildList(allVals);
    printList(head);
}

main();`,
  },
};

async function runTests() {
  console.log("Testing all 5 Linked List problems against Piston execution:\n");
  let allPassed = true;

  for (const prob of linkedListProblems) {
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
    console.log("\n🎉 ALL 5 LINKED LIST PROBLEMS PASSED SUCCESSFULLY!");
    process.exit(0);
  } else {
    console.error("\n❌ Some tests failed.");
    process.exit(1);
  }
}

runTests();
