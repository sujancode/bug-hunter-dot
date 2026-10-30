import { defineAgent } from "polka-cli";

// A dot that hunts bugs for a software team. You talk to its front (by voice, chat, in a Meet or
// through the API); the work runs in its work session: it reads the bug report on GitHub, the
// errors in Sentry and the recent commits, and writes up what broke, with the evidence.
// GITHUB_TOKEN and SENTRY_TOKEN are the environment's variables (`polka vars set`).
export default defineAgent({
  name: "Bug hunter",
  params: {
    persona: { name: "Hunt", stance: "calm and precise" },
    instructions:
      "You are the front of a bug-hunting dot for a software team. People ask you to look into bugs and to sort new issues; " +
      "you give that work to your skills and tell them how it is going. Ask for the repository (owner/name) and the issue number if you do not have them.",
    open: true,
    style: { length: "brief" },
    tools: {
      names: ["end_conversation"],
      mcp: [
        {
          // GitHub's own MCP server, with a fine-grained token that can read the repository and comment on issues.
          name: "github",
          url: "https://api.githubcopilot.com/mcp/",
          headers: { Authorization: "Bearer ${GITHUB_TOKEN}" },
          // A dot offers 16 tools at most: only what the skills need.
          tools: ["get_issue", "list_issues", "list_commits", "get_commit", "search_code", "get_file_contents", "add_issue_comment"],
        },
        {
          // A Sentry MCP server you run (e.g. `npx @sentry/mcp-server` with an access token), at its address.
          name: "sentry",
          url: "https://sentry-mcp.example.com/mcp",
          headers: { Authorization: "Bearer ${SENTRY_TOKEN}" },
        },
      ],
    },
    skills: [
      {
        name: "investigate_bug",
        description: "Look into a bug report: find its errors and the change that caused them, and write up what broke.",
        goal:
          "Read the issue. Find its errors in Sentry (when, how often, which browsers or versions). Look through the recent commits to the code the errors point at, " +
          "and find the change that most likely caused them. Report progress as you go. Write a report named findings.md with write_output: what breaks, " +
          "since when, the evidence (error counts, the commit, the lines), and a suggested fix. Then comment a short summary on the issue, and finish with one line.",
        connectors: ["github", "sentry"],
        input: {
          repository: { type: "string", description: "owner/name" },
          issue: { type: "number", description: "The issue's number" },
        },
        output: "report",
        model: "strong",
        budget: { steps: 40, minutes: 15 },
        queue: { max: 5 },
      },
      {
        name: "triage_issues",
        description: "Sort the repository's open issues from the last week: what is a bug, how bad, and what to look at first.",
        goal:
          "List the open issues created in the last seven days. For each, decide: bug or not, how many people it touches, how bad. " +
          "Write a table named triage.csv with write_output (number, title, kind, severity, why), and finish with the three to look at first.",
        connectors: ["github"],
        input: { repository: { type: "string", description: "owner/name" } },
        output: "table",
        model: "fast",
        budget: { steps: 20, minutes: 10 },
      },
    ],
  },
  knowledge: false,
});
