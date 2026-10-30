# Bug hunter (a dot with skills)

A dot for a software team. You talk to its **front** by voice, chat, in a Google Meet or through
the API; the **work** runs in its work session, apart from the conversation, one task at a time:

| Skill | Input | It… |
|---|---|---|
| `investigate_bug` | `repository`, `issue` | reads the issue, its errors in Sentry and the recent commits, writes `findings.md` with the evidence and a suggested fix, and comments a summary on the issue |
| `triage_issues` | `repository` | sorts the last week's open issues into `triage.csv`: bug or not, how bad, what to look at first |

Its connectors are MCP servers: GitHub's own (`api.githubcopilot.com/mcp/`, narrowed to the seven
tools the skills use) and a Sentry MCP server you run (set its address in `agent.config.ts`).

## Run it

```bash
cd sdk/examples/bug-hunter-dot
export POLKA_KEY=va_test_…
node ../../bin/polka.mjs deploy                                     # to test
echo "$GITHUB_TOKEN" | node ../../bin/polka.mjs vars set GITHUB_TOKEN  # a fine-grained token: read the repo, comment on issues
echo "$SENTRY_TOKEN" | node ../../bin/polka.mjs vars set SENTRY_TOKEN
node ../../bin/polka.mjs task run investigate_bug repository=acme/shop issue=482 --wait
node ../../bin/polka.mjs session                                    # what it is doing now
```

Or say it to the front: "Can you look into issue 482 in acme/shop?" It assigns the task, tells you
when it is done, and reads you the findings when you ask.
