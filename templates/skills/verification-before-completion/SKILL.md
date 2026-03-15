---
name: verification-before-completion
description: Use before claiming any task is complete, any feature works, or any bug is fixed - enforces fresh verification evidence through a 5-step HARD-GATE protocol that prevents false completion claims
---

## Overview

The verification-before-completion skill is the terminal checkpoint for every task in the toolkit. It enforces a strict 5-step protocol that requires running fresh verification commands, reading their full output, and confirming results match the completion claim. Without this skill, agents make unverified claims that lead to broken code in production — with it, every completion claim is backed by evidence.

---

## Iron Law

**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.**

You cannot say "it works," "it's done," "the bug is fixed," or "the feature is complete" without running verification commands and reading their output in this session. Cached results, previous runs, and assumptions do not count.

---

## Phase 1: Identify Verification Commands

Before running anything, explicitly list what needs to pass for this specific task:

| Verification Type | Example Commands | When Required |
|------------------|-----------------|---------------|
| Unit tests | `npm test`, `pytest`, `go test ./...`, `cargo test`, `php artisan test` | Always |
| Integration tests | `npm run test:integration`, `pytest tests/integration/` | When applicable |
| Type checking | `tsc --noEmit`, `mypy .`, `pyright`, `phpstan analyse` | When project uses type checking |
| Linting | `eslint .`, `ruff check .`, `golint ./...`, `php-cs-fixer fix --dry-run` | Always |
| Build | `npm run build`, `cargo build`, `go build ./...` | Always |
| Format check | `prettier --check .`, `black --check .`, `gofmt -l .`, `pint --test` | When project uses formatters |

**Action:** List which of these apply to the current project. Not all projects have all types. Be explicit about what you will run and why.

> **STOP: Do NOT proceed to running commands until you have identified ALL applicable verification types.**

---

## Phase 2: Run Commands Fresh

Execute every verification command identified in Phase 1.

| Rule | Rationale |
|------|-----------|
| Run AFTER the latest code change | Pre-change results are stale |
| Run the FULL suite, not a subset | Subset runs miss regressions |
| Do NOT rely on cached results | Code changed since last run |
| Do NOT skip commands because "they passed earlier" | Earlier is not now |
| If a command takes >5 minutes, note it | Explain what was run instead |

> **STOP: All commands must complete before proceeding to Phase 3.**

---

## Phase 3: Read Full Output

Read the entire output of each verification command. Pay attention to:

| Output Element | What to Look For | Why It Matters |
|---------------|-----------------|----------------|
| Exit code | Non-zero = failure | Even if output looks ok, non-zero means something failed |
| Test count | Expected number of tests ran? Any skipped? | Skipped tests = untested code |
| Warning messages | New warnings not present before | Warnings become errors; they indicate degradation |
| Deprecation notices | Deprecated API usage | Future breakage risk |
| Performance indicators | Unusually slow tests | May indicate performance regression |
| Error messages | Any error, even if tests "pass" | Some frameworks report errors alongside passing tests |

> **STOP: Do NOT proceed if you have not read the full output of every command.**

---

## Phase 4: Verify Output Matches Claim

Ask yourself these questions. ALL must be "yes" to proceed:

| Question | If "No" or "Unsure" |
|----------|---------------------|
| Do ALL tests pass (not just the ones I wrote)? | Fix failing tests before claiming done |
| Does the build succeed without errors? | Fix build errors |
| Does the type checker find no errors? | Fix type errors |
| Does the linter pass? | Fix lint errors |
| Are there any NEW warnings that were not there before? | Investigate and fix or explicitly justify |
| Did the full suite run (not just a subset)? | Run the full suite |
| Is the test count what I expected? | Investigate skipped or missing tests |

> **STOP: If ANY answer is "no" or "unsure", go back to fix and restart from Phase 1. Do NOT proceed to Phase 5.**

---

## Phase 5: Claim Completion with Evidence

Only now may you say the task is complete. Include this evidence:

```
VERIFICATION EVIDENCE
=====================
Task: [what was being done]
Date: [timestamp]

Commands Run:
  [x] Tests:      [command] -> [result: X passed, Y failed, Z skipped]
  [x] Build:      [command] -> [result: success/failure]
  [x] Lint:       [command] -> [result: X errors, Y warnings]
  [x] Type-check: [command] -> [result: X errors]
  [x] Format:     [command] -> [result: clean/X files to format]

All Green?  [x] YES  [ ] NO
New warnings introduced?  [ ] YES  [x] NO

Completion claim: [specific claim, e.g., "Feature X is implemented and all tests pass"]
```

> **STOP: This is the end of the verification protocol. Only claims with this evidence are valid.**

---

## Decision Table: What Counts as "Fresh" Evidence

| Counts as Fresh | Does NOT Count as Fresh |
|----------------|------------------------|
| Ran command after the latest code change | Ran before the latest code change |
| Full test suite executed | Subset of tests executed |
| Output read and analyzed | Output skimmed or ignored |
| All verification types run | Only tests run (no lint, no build) |
| Command run in current session | Recalled from memory of a previous session |
| Actual command output available | "I remember it passed" |

---

## Decision Table: Edge Cases

| Situation | Protocol |
|-----------|----------|
| Full suite takes >5 minutes | Run related tests + smoke suite. Note that full suite was not run. Recommend CI run before merge. |
| No automated tests exist | Note as significant risk. Perform manual verification with documented steps. Recommend adding tests as follow-up. At minimum, verify code compiles/runs. |
| Tests are flaky | Re-run failing test in isolation. If it passes alone, note flakiness. Verify your changes did not introduce it. Do NOT use flakiness as excuse to skip. |
| Only config change | Config changes are #1 cause of outages. Full verification required. |
| Single line change | One-line changes cause production outages. Full verification required. |
| Refactoring only | Existing tests must still pass. Run full suite. |

---

## Common Failure Patterns

| Pattern | What Happens | Why It Is Dangerous |
|---------|-------------|-------------------|
| Tests pass but lint fails | Code works but has quality issues | Lint failures often indicate real problems (unused vars, unreachable code) |
| Tests pass but build fails | Test environment differs from build | Production deployments will fail |
| Tests pass but type-check fails | Runtime works but types are wrong | Bugs hiding behind `any` types, wrong interfaces |
| Tests pass in isolation but fail together | Shared state between tests | Flaky CI, unreliable test suite |
| Manual testing passes but automated fails | Manual test missed edge cases | The automated test is right |
| Tests pass but new warnings appeared | Something degraded | Warnings become errors over time |
| Subset of tests pass | Only ran related tests | Regression in unrelated area possible |
| Tests pass but coverage decreased | New code is not tested | Untested code is unverified code |
| Old test run used as evidence | Results are stale | Code changed since that run |
| "It compiled, so it works" | Compilation is necessary but not sufficient | Compiled code can still be wrong |

---

## Anti-Patterns / Common Mistakes

| What NOT to Do | Why It Fails | What to Do Instead |
|----------------|-------------|-------------------|
| Claim done without running tests | Unverified code breaks in production | Run all verification commands fresh |
| Use "it passed earlier" as evidence | Code changed since then | Run fresh after every change |
| Skip lint because "it is just warnings" | Warnings indicate real problems | Fix warnings or explicitly justify each one |
| Run only the tests you wrote | Misses regressions in other areas | Run the full suite |
| Read test output partially | Missed failures hidden in output | Read every line of output |
| Use manual testing as sole evidence | Manual testing is incomplete and unrepeatable | Run automated verification |
| Verify once, then make "small" additional changes | Those changes are unverified | Re-verify after every change |
| Suppress warnings without comment | Hides real issues | If truly false positive, add suppression comment explaining why |

---

## Anti-Rationalization Guards

| Excuse | Reality |
|--------|---------|
| "I only changed one line" | One-line changes cause production outages. Verify. |
| "The tests passed 5 minutes ago" | You made changes since then. Run them again. |
| "I have tested this pattern before" | This is a different instance. Verify this specific one. |
| "The change is obviously correct" | Obvious changes fail more often because they are not verified. |
| "Running tests takes too long" | Not running tests takes longer when the bug reaches production. |
| "I will verify after I submit" | You will not. And if verification fails, you will undo and redo. |
| "It is just a config change" | Config changes are the #1 cause of outages. Verify. |
| "The linter warnings are false positives" | Review each one. Suppress with comment if truly false. |
| "The type errors are in unrelated code" | They might interact. Run the full check. |
| "I tested it manually" | Manual testing is incomplete and unrepeatable. Run automated verification. |

> **Do NOT claim completion without Phase 5 evidence. There are zero exceptions.**

---

## Integration Points

| Skill | When Verification Is Required |
|-------|------------------------------|
| `test-driven-development` | After completing RED-GREEN-REFACTOR cycle for a feature |
| `systematic-debugging` | After applying a bug fix |
| `executing-plans` | After each task and after each batch |
| `subagent-driven-development` | After implementer delivers, after reviewers approve |
| `code-review` | Before approving any code review |
| `resilient-execution` | Before marking any task as complete |
| `autonomous-loop` | Before setting EXIT_SIGNAL to true |
| `finishing-a-development-branch` | Before merge or PR creation |

### Integration Flow
```
[Do the work using other skills]
    |
    v
[Think you are done?]
    |
    v
[Invoke verification-before-completion]
    |
    +-- All checks pass -> Claim completion with Phase 5 evidence
    |
    +-- Any check fails -> Fix and re-verify (do NOT claim completion)
```

---

## Enforcement by Other Skills

This skill is invoked by ALL other skills at completion time. It is not optional. It is a terminal checkpoint — called at the end of work, never at the beginning.

---

## Skill Type

**RIGID** — The 5-step protocol is a HARD-GATE. Every step must be executed in order. No step may be skipped. No completion claim is valid without Phase 5 evidence. Do not relax these requirements for any reason.
