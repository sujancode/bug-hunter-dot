import { defineTest } from "polka-cli";

// The front: it gives work to its skills instead of doing it, and says what it can do.
export default [
  defineTest({
    name: "gives a bug report to investigate_bug",
    turns: [{ user: "Can you look into issue 482 in acme/shop? Checkout is broken on Safari.", expect: { tool: "assign_task" } }],
    criteria: ["The agent says it has started looking into issue 482, and does not claim to know the cause yet."],
  }),
  defineTest({
    name: "says what it can do",
    turns: [{ user: "What can you do?" }],
    criteria: ["The agent says it can look into bug reports and sort new issues."],
  }),
];
